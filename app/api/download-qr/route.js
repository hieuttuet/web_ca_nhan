import { NextResponse } from 'next/server';

const ALLOWED_QR_HOSTS = new Set(['img.vietqr.io', 'api.qrserver.com']);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const rawUrl = String(searchParams.get('url') || '').trim();
    if (!rawUrl) {
      return NextResponse.json({ error: 'Thiếu tham số url' }, { status: 400 });
    }

    let parsed;
    try {
      parsed = new URL(rawUrl);
    } catch {
      return NextResponse.json({ error: 'URL không hợp lệ' }, { status: 400 });
    }

    if (parsed.protocol !== 'https:' || !ALLOWED_QR_HOSTS.has(parsed.hostname)) {
      return NextResponse.json({ error: 'Nguồn ảnh QR không được phép' }, { status: 403 });
    }

    const rawName = String(searchParams.get('filename') || 'VietQR.png');
    const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_') || 'VietQR.png';

    const upstream = await fetch(parsed.toString());
    if (!upstream.ok) {
      return NextResponse.json({ error: 'Không tải được ảnh QR từ máy chủ nguồn' }, { status: upstream.status });
    }

    const contentType = upstream.headers.get('content-type') || 'image/png';
    const arrayBuf = await upstream.arrayBuffer();

    return new NextResponse(arrayBuf, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${safeName}"`,
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Lỗi tải ảnh QR' }, { status: 500 });
  }
}
