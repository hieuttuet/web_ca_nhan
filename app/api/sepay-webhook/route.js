import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { searchParams } = new URL(req.url);

    const expectedApiKey = process.env.SEPAY_API_KEY ? process.env.SEPAY_API_KEY.trim() : '';
    if (expectedApiKey) {
      const authHeader = req.headers.get('authorization') || '';
      const headerToken = authHeader.replace(/^Apikey\s+/i, '').replace(/^Bearer\s+/i, '').trim();
      const queryToken = String(searchParams.get('apiKey') || searchParams.get('token') || '').trim();
      const bodyToken = String(body?.apiKey || '').trim();
      const receivedToken = headerToken || queryToken || bodyToken;

      if (receivedToken !== expectedApiKey) {
        return NextResponse.json({ success: false, error: 'Unauthorized Webhook Key' }, { status: 401 });
      }
    }

    const rawContent = String(
      body.content || body.description || body.transaction_content || body.order_code || ''
    );
    const content = rawContent.toUpperCase();
    const transferAmount = Number(body.transferAmount || body.amount || body.accumulated || 0);
    const transactionId = String(body.id || body.referenceCode || body.reference_number || Date.now());

    const match = content.match(/LOVE[A-Z0-9]{4,14}/i);
    if (!match) {
      return NextResponse.json({
        success: true,
        message: 'Ignored: Không tìm thấy mã đơn LOVE trong nội dung: ' + content
      });
    }

    const orderCode = match[0].toUpperCase();
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const findRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?order_code=eq.${encodeURIComponent(orderCode)}&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        },
        cache: 'no-store'
      }
    );

    const orders = await findRes.json();
    if (!Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json({ success: true, message: `Order ${orderCode} not found` });
    }

    const order = orders[0];
    if (transferAmount < Number(order.amount)) {
      return NextResponse.json({
        success: false,
        message: `Số tiền chuyển (${transferAmount}) nhỏ hơn giá trị đơn (${order.amount})`
      });
    }

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

    return NextResponse.json({ success: true, orderCode, status: 'PAID' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
