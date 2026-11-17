import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function isAuthorized(req) {
  const adminKey = process.env.ADMIN_PASSWORD || process.env.SEPAY_API_KEY || '';
  if (!adminKey) return true; // Cho phép truy cập khi đang dev chưa đặt mật khẩu
  const provided = req.headers.get('x-admin-key') || '';
  return provided === adminKey;
}

export async function GET(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Sai mật khẩu Admin' }, { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Chưa cấu hình SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const q = (searchParams.get('q') || '').trim();

    let url = `${supabaseUrl}/rest/v1/orders?select=order_code,template_type,sender_name,receiver_name,occasion,amount,status,created_at,paid_at&order=created_at.desc&limit=100`;
    if (status === 'PAID' || status === 'PENDING') {
      url += `&status=eq.${status}`;
    }
    if (q) {
      url += `&or=(order_code.ilike.*${encodeURIComponent(q)}*,receiver_name.ilike.*${encodeURIComponent(q)}*,sender_name.ilike.*${encodeURIComponent(q)}*)`;
    }

    const res = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
      },
      cache: 'no-store'
    });
    const orders = await res.json();
    return NextResponse.json({ orders: Array.isArray(orders) ? orders : [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Sai mật khẩu Admin' }, { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  try {
    const { orderCode, status = 'PAID' } = await req.json();
    if (!orderCode) {
      return NextResponse.json({ error: 'Thiếu orderCode' }, { status: 400 });
    }
    const res = await fetch(
      `${supabaseUrl}/rest/v1/orders?order_code=eq.${encodeURIComponent(orderCode)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          status,
          paid_at: status === 'PAID' ? new Date().toISOString() : null
        })
      }
    );
    if (!res.ok) {
      return NextResponse.json({ error: 'Cập nhật thất bại' }, { status: 500 });
    }
    return NextResponse.json({ success: true, orderCode, status });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
