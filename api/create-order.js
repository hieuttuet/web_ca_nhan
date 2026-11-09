/**
 * VERCEL SERVERLESS FUNCTION: POST /api/create-order
 * Nhiệm vụ:
 * 1. Nhận templateId, lời chúc, tên, ảnh từ khách hàng.
 * 2. Tra cứu đúng Giá tiền của Template đó từ danh mục Server (TEMPLATES_CATALOG)
 *    hoặc biến môi trường PRICE_VND (Khách KHÔNG THỂ tự sửa giá).
 * 3. Lưu đơn hàng vào Supabase với trạng thái 'PENDING'.
 * 4. Trả về mã đơn (orderCode) và link ảnh VietQR chính xác để khách quét.
 */

import '../templates-catalog.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      templateId = 'galaxy_love_3d',
      templateType = 'galaxy',
      senderName = 'Anh',
      receiverName = 'Em',
      occasion = 'Kỷ Niệm Đặc Biệt',
      message = '',
      payload = {}
    } = req.body || {};

    // Đọc thông tin tài khoản của Chủ Shop từ Vercel Environment Variables
    const bankId = process.env.BANK_ID || 'MB';
    const accountNo = process.env.ACCOUNT_NO || '';
    const accountName = process.env.ACCOUNT_NAME || 'CHU SHOP';

    // Lấy giá tiền riêng của từng Template từ danh mục chuẩn trên Server
    const catalog = globalThis.TEMPLATES_CATALOG || [];
    const matchedTemplate = catalog.find((t) => t.id === templateId);
    const amount = matchedTemplate
      ? matchedTemplate.price
      : parseInt(process.env.PRICE_VND || '29000', 10);

    if (!accountNo) {
      return res.status(500).json({
        error: 'Chưa cấu hình biến môi trường ACCOUNT_NO trên Vercel Settings.'
      });
    }

    // Sinh mã đơn hàng duy nhất (VD: LOVE849201) để đưa vào nội dung chuyển khoản VietQR
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderCode = `LOVE${randomDigits}`;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: 'Chưa cấu hình SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trên Vercel.'
      });
    }

    // Lưu đơn hàng vào bảng public.orders trên Supabase với trạng thái PENDING
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
        payload: { ...payload, templateId },
        amount: amount,
        status: 'PENDING'
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: 'Lỗi lưu đơn hàng Supabase: ' + errText });
    }

    const encodedAccName = encodeURIComponent(accountName);
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${orderCode}&accountName=${encodedAccName}`;

    return res.status(200).json({
      orderCode,
      templateId,
      amount,
      bankId,
      accountNo,
      accountName,
      qrUrl
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
