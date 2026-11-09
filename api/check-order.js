/**
 * VERCEL SERVERLESS FUNCTION: GET /api/check-order
 * Nhiệm vụ:
 * - GET ?code=LOVE123456: Kiểm tra trạng thái đơn hàng (Polling mỗi 2.5 giây khi khách chờ quét QR,
 *   hoặc tải dữ liệu món quà khi người nhận mở link ?id=LOVE123456).
 */

export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Chưa cấu hình Supabase trên Vercel' });
  }

  try {
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


