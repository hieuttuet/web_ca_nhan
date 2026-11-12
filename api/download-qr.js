/**
 * VERCEL SERVERLESS FUNCTION: GET /api/download-qr
 * Nhiệm vụ:
 * - Proxy tải ảnh mã QR từ img.vietqr.io / api.qrserver.com với header
 *   Content-Disposition: attachment (same-origin) để điện thoại Android/iOS và PC
 *   tải trực tiếp file .png về máy thay vì bị mở tab mới do chặn CORS.
 */

const ALLOWED_QR_HOSTS = new Set(['img.vietqr.io', 'api.qrserver.com']);

export default async function handler(req, res) {
  try {
    const rawUrl = String(req.query.url || '').trim();
    if (!rawUrl) {
      return res.status(400).json({ error: 'Thiếu tham số url' });
    }

    let parsed;
    try {
      parsed = new URL(rawUrl);
    } catch {
      return res.status(400).json({ error: 'URL không hợp lệ' });
    }

    if (parsed.protocol !== 'https:' || !ALLOWED_QR_HOSTS.has(parsed.hostname)) {
      return res.status(403).json({ error: 'Nguồn ảnh QR không được phép' });
    }

    const rawName = String(req.query.filename || 'VietQR.png');
    const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_') || 'VietQR.png';

    const upstream = await fetch(parsed.toString());
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'Không tải được ảnh QR từ máy chủ nguồn' });
    }

    const contentType = upstream.headers.get('content-type') || 'image/png';
    const arrayBuf = await upstream.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(buffer);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Lỗi tải ảnh QR' });
  }
}

