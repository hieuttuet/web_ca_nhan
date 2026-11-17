import { NextResponse } from 'next/server';
import '../../../templates-catalog.js';

async function uploadDataUrlToStorage(dataUrl, filePath, supabaseUrl, supabaseKey) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }
  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!matches) return dataUrl;
    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const fullPath = `${filePath}.${ext}`;

    const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/gift-photos/${fullPath}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': `image/${matches[1]}`,
        'x-upsert': 'true'
      },
      body: buffer
    });

    if (uploadRes.ok) {
      return `${supabaseUrl}/storage/v1/object/public/gift-photos/${fullPath}`;
    }
  } catch (err) {
    console.error('Supabase Storage upload error:', err);
  }
  return dataUrl;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      templateId = 'galaxy_love_3d',
      templateType = 'galaxy',
      senderName = 'Anh',
      receiverName = 'Em',
      occasion = 'Kỷ Niệm Đặc Biệt',
      message = '',
      payload = {}
    } = body || {};

    const bankId = process.env.BANK_ID || 'MB';
    const accountNo = process.env.ACCOUNT_NO || '';
    const accountName = process.env.ACCOUNT_NAME || 'CHU SHOP';

    const catalog = globalThis.TEMPLATES_CATALOG || [];
    const matchedTemplate = catalog.find((t) => t.id === templateId);
    const amount = matchedTemplate
      ? matchedTemplate.price
      : parseInt(process.env.PRICE_VND || '29000', 10);

    if (!accountNo) {
      return NextResponse.json(
        { error: 'Chưa cấu hình biến môi trường ACCOUNT_NO trên Vercel Settings.' },
        { status: 500 }
      );
    }

    const timePart = Date.now().toString(36).toUpperCase();
    const randPart = Math.random().toString(36).substring(2, 5).toUpperCase();
    const orderCode = `LOVE${timePart}${randPart}`;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Chưa cấu hình SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trên Vercel.' },
        { status: 500 }
      );
    }

    const finalPayload = { ...payload, templateId };

    if (finalPayload.framePhoto && typeof finalPayload.framePhoto === 'string') {
      finalPayload.framePhoto = await uploadDataUrlToStorage(
        finalPayload.framePhoto,
        `${orderCode}/frame_photo`,
        supabaseUrl,
        supabaseKey
      );
    }

    if (Array.isArray(finalPayload.photos)) {
      finalPayload.photos = await Promise.all(
        finalPayload.photos.map(async (photo, idx) => {
          if (typeof photo === 'string') {
            const url = await uploadDataUrlToStorage(photo, `${orderCode}/photo_${idx + 1}`, supabaseUrl, supabaseKey);
            return { url };
          }
          if (photo && photo.url) {
            const url = await uploadDataUrlToStorage(photo.url, `${orderCode}/photo_${idx + 1}`, supabaseUrl, supabaseKey);
            return { ...photo, url };
          }
          return photo;
        })
      );
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=representation'
      },
      body: JSON.stringify({
        order_code: orderCode,
        template_type: templateId || templateType,
        sender_name: String(senderName).slice(0, 50),
        receiver_name: String(receiverName).slice(0, 50),
        occasion: String(occasion).slice(0, 100),
        message: String(message).slice(0, 2000),
        payload: finalPayload,
        amount,
        status: 'PENDING'
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: 'Lỗi lưu đơn hàng Supabase: ' + errText }, { status: 500 });
    }

    const encodedAccName = encodeURIComponent(accountName);
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${orderCode}&accountName=${encodedAccName}`;

    return NextResponse.json({
      orderCode,
      templateId,
      amount,
      bankId,
      accountNo,
      accountName,
      qrUrl,
      qrImageUrl: qrUrl
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
