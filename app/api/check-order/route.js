import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Chưa cấu hình Supabase trên Vercel' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const code = String(searchParams.get('code') || '').toUpperCase().trim();
    if (!code) {
      return NextResponse.json({ error: 'Thiếu mã đơn hàng (code)' }, { status: 400 });
    }

    const findRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?order_code=eq.${encodeURIComponent(code)}&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        },
        cache: 'no-store'
      }
    );

    const rows = await findRes.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    const order = rows[0];
    return NextResponse.json({
      status: order.status,
      order: order.status === 'PAID'
        ? order
        : {
            order_code: order.order_code,
            amount: order.amount,
            status: order.status
          }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
