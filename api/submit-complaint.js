/**
 * VERCEL SERVERLESS FUNCTION: POST /api/submit-complaint
 * Nhiệm vụ:
 * 1. Tiếp nhận phiếu khiếu nại / yêu cầu hỗ trợ từ khách hàng trên màn hình chính.
 * 2. Lưu vào Supabase bảng 'complaints'.
 * 3. Nếu khách có đính kèm ảnh biên lai / ảnh lỗi (Base64), tự động tải lên Supabase Storage bucket 'gift-photos'.
 * 4. Trả về mã khiếu nại (complaintCode) và thông báo tiếp nhận để khách an tâm.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      orderCode = '',
      contact = '',
      issueType = 'NOT_UNLOCKED',
      description = '',
      evidenceBase64 = ''
    } = req.body || {};

    const cleanContact = String(contact).trim();
    const cleanDesc = String(description).trim();
    const cleanOrderCode = String(orderCode).trim().toUpperCase();

    if (!cleanContact) {
      return res.status(400).json({ error: 'Vui lòng cung cấp Số điện thoại hoặc Zalo để CSKH liên hệ hỗ trợ.' });
    }

    if (!cleanDesc) {
      return res.status(400).json({ error: 'Vui lòng nhập mô tả chi tiết vấn đề bạn đang gặp phải.' });
    }

    const timePart = Date.now().toString(36).toUpperCase();
    const randPart = Math.random().toString(36).substring(2, 5).toUpperCase();
    const complaintCode = `KN-${timePart}${randPart}`;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let evidenceUrl = '';

    // Upload ảnh biên lai chuyển khoản (nếu có) lên Supabase Storage
    if (evidenceBase64 && evidenceBase64.startsWith('data:image/') && supabaseUrl && supabaseKey) {
      try {
        const matches = evidenceBase64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches) {
          const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          const filePath = `complaints/${complaintCode}.${ext}`;

          const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/gift-photos/${filePath}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${supabaseKey}`,
              'Content-Type': `image/${matches[1]}`,
              'x-upsert': 'true'
            },
            body: buffer
          });

          if (uploadRes.ok) {
            evidenceUrl = `${supabaseUrl}/storage/v1/object/public/gift-photos/${filePath}`;
          }
        }
      } catch (uploadErr) {
        console.warn('Lỗi tải ảnh khiếu nại lên Supabase Storage:', uploadErr);
      }
    }

    // Lưu vào bảng public.complaints nếu có Supabase
    if (supabaseUrl && supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/complaints`, {
          method: 'POST',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal'
          },
          body: JSON.stringify({
            complaint_code: complaintCode,
            order_code: cleanOrderCode,
            contact: cleanContact,
            issue_type: issueType,
            description: cleanDesc,
            evidence_url: evidenceUrl,
            status: 'PENDING',
            created_at: new Date().toISOString()
          })
        });
      } catch (dbErr) {
        console.warn('Cảnh báo khi lưu bảng complaints (có thể chưa chạy SQL schema):', dbErr);
      }
    }

    return res.status(200).json({
      success: true,
      complaintCode,
      message: 'Đã tiếp nhận khiếu nại thành công! Đội ngũ CSKH sẽ kiểm tra và liên hệ qua Zalo/SĐT của bạn trong vòng 5 - 15 phút.'
    });
  } catch (err) {
    console.error('Lỗi API submit-complaint:', err);
    return res.status(500).json({ error: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại hoặc liên hệ Zalo hỗ trợ.' });
  }
}

