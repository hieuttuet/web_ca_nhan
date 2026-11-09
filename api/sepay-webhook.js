/**
 * VERCEL SERVERLESS FUNCTION: POST /api/sepay-webhook
 * Nhiệm vụ:
 * 1. Nhận thông báo biến động số dư tự động từ SePay.vn (hoặc Casso.vn) ngay khi khách chuyển khoản.
 * 2. Kiểm tra mã bảo mật SEPAY_API_KEY (Tránh giả mạo giao dịch).
 * 3. Tách mã đơn hàng (VD: LOVE849201) từ nội dung chuyển khoản.
 * 4. Kiểm tra số tiền khách chuyển có đủ (>= amount của đơn hàng) hay không.
 * 5. Tự động cập nhật trạng thái đơn hàng trong Supabase thành 'PAID'.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Xác thực API Key bảo mật từ SePay (Header: "Authorization: Apikey YOUR_SEPAY_API_KEY")
    const expectedApiKey = process.env.SEPAY_API_KEY;
    if (expectedApiKey) {
      const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
      const token = authHeader.replace(/^Apikey\s+/i, '').replace(/^Bearer\s+/i, '').trim();
      if (token !== expectedApiKey) {
        return res.status(401).json({ success: false, error: 'Unauthorized Webhook Key' });
      }
    }

    const body = req.body || {};

    // Hỗ trợ chuẩn dữ liệu của SePay.vn (content, transferAmount, id)
    const content = String(body.content || body.description || '').toUpperCase();
    const transferAmount = Number(body.transferAmount || body.amount || 0);
    const transactionId = String(body.id || body.referenceCode || Date.now());

    // 2. Tìm mã đơn hàng dạng LOVE + 6 chữ số trong nội dung chuyển khoản
    const match = content.match(/LOVE\d{6}/i);
    if (!match) {
      return res.status(200).json({
        success: true,
        message: 'Ignored: Không tìm thấy mã đơn LOVE trong nội dung chuyển khoản'
      });
    }

    const orderCode = match[0].toUpperCase();
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 3. Tra cứu đơn hàng trong Supabase
    const findRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?order_code=eq.${encodeURIComponent(orderCode)}&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        }
      }
    );

    const orders = await findRes.json();
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: `Order ${orderCode} not found`
      });
    }

    const order = orders[0];

    // 4. Kiểm tra số tiền chuyển khoản phải >= số tiền đơn hàng
    if (transferAmount < Number(order.amount)) {
      return res.status(200).json({
        success: false,
        message: `Số tiền chuyển (${transferAmount}) nhỏ hơn giá trị đơn (${order.amount})`
      });
    }

    // 5. Cập nhật trạng thái đơn hàng sang PAID
    await fetch(
      `${supabaseUrl}/rest/v1/orders?order_code=eq.${encodeURIComponent(orderCode)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          status: 'PAID',
          transaction_id: transactionId,
          paid_at: new Date().toISOString()
        })
      }
    );

    return res.status(200).json({
      success: true,
      orderCode,
      status: 'PAID'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

