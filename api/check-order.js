/**
 * VERCEL SERVERLESS FUNCTION: GET / POST /api/check-order
 * Nhiệm vụ:
 * - GET ?code=LOVE123456: Kiểm tra trạng thái đơn hàng (Polling mỗi 2.5 giây khi khách chờ quét QR,
 *   hoặc tải dữ liệu món quà khi người nhận mở link ?id=LOVE123456).
 * - POST { orderCode, vipCode }: Xác thực Mã VIP bí mật ở phía Server (chỉ khớp với biến môi trường VIP_UNLOCK_CODE).
 */

export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Chưa cấu hình Supabase trên Vercel' });
  }

  try {
    // 1. Xử lý mở khóa bằng Mã VIP (Kiểm tra ở Server, khách F12 không thể biết mã VIP)
    if (req.method === 'POST') {
      const { orderCode, vipCode } = req.body || {};
      const serverVipCode = process.env.VIP_UNLOCK_CODE;

      if (!serverVipCode || !vipCode || vipCode.trim() !== serverVipCode.trim()) {
        return res.status(403).json({ error: 'Mã VIP không chính xác!' });
      }

      const updateRes = await fetch(
        `${supabaseUrl}/rest/v1/orders?order_code=eq.${encodeURIComponent(orderCode)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: 'return=representation'
          },
          body: JSON.stringify({
            status: 'PAID',
            transaction_id: 'VIP_CODE_UNLOCK',
            paid_at: new Date().toISOString()
          })
        }
      );

      const updatedRows = await updateRes.json();
      const order = Array.isArray(updatedRows) ? updatedRows[0] : null;
      return res.status(200).json({ status: 'PAID', order });
    }

    // 2. Xử lý GET kiểm tra trạng thái đơn hàng hoặc lấy dữ liệu món quà đã thanh toán
    const code = String(req.query.code || '').toUpperCase().trim();
    if (!code) {
      return res.status(400).json({ error: 'Thiếu mã đơn hàng (code)' });
    }

    const findRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?order_code=eq.${encodeURIComponent(code)}&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        }
      }
    );

    const rows = await findRes.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }

    const order = rows[0];
    return res.status(200).json({
      status: order.status,
      order: order.status === 'PAID' ? order : {
        order_code: order.order_code,
        amount: order.amount,
        status: order.status
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

