import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function isAuthorized(req) {
  const adminKey = (process.env.ADMIN_PASSWORD || process.env.SEPAY_API_KEY || '').trim();
  if (!adminKey) return true;
  const provided = (req.headers.get('x-admin-key') || '').trim();
  return provided === adminKey;
}

export async function GET(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { error: 'Vui lòng nhập đúng mật khẩu Admin (SEPAY_API_KEY) ở khung phía trên để xem dữ liệu.' },
      { status: 401 }
    );
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
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(5, parseInt(searchParams.get('pageSize') || '20', 10)));
    const offset = (page - 1) * pageSize;

    let filterQuery = '';
    if (status === 'PAID' || status === 'PENDING') {
      filterQuery += `&status=eq.${status}`;
    }
    if (q) {
      filterQuery += `&or=(order_code.ilike.*${encodeURIComponent(q)}*,receiver_name.ilike.*${encodeURIComponent(q)}*,sender_name.ilike.*${encodeURIComponent(q)}*)`;
    }

    const listUrl = `${supabaseUrl}/rest/v1/orders?select=order_code,template_type,sender_name,receiver_name,occasion,amount,status,created_at,paid_at&order=created_at.desc&limit=${pageSize}&offset=${offset}${filterQuery}`;

    const [listRes, paidStatsRes] = await Promise.all([
      fetch(listUrl, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: 'count=exact'
        },
        cache: 'no-store'
      }),
      fetch(`${supabaseUrl}/rest/v1/orders?select=amount&status=eq.PAID`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        },
        cache: 'no-store'
      })
    ]);

    const orders = await listRes.json();
    const contentRange = listRes.headers.get('content-range') || '';
    const totalMatch = contentRange.match(/\/(\d+)$/);
    const totalCount = totalMatch ? parseInt(totalMatch[1], 10) : (Array.isArray(orders) ? orders.length : 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    const paidRows = await paidStatsRes.json().catch(() => []);
    const paidCount = Array.isArray(paidRows) ? paidRows.length : 0;
    const totalRevenue = Array.isArray(paidRows)
      ? paidRows.reduce((sum, r) => sum + Number(r.amount || 0), 0)
      : 0;

    return NextResponse.json({
      orders: Array.isArray(orders) ? orders : [],
      page,
      pageSize,
      totalCount,
      totalPages,
      paidCount,
      totalRevenue
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Sai mật khẩu Admin (SEPAY_API_KEY)' }, { status: 401 });
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
