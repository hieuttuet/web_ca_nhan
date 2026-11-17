import '../../../templates-catalog.js';

export const dynamic = 'force-dynamic';

async function fetchOrderByCode(code) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!code || !supabaseUrl || !supabaseKey) return null;
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/orders?order_code=eq.${encodeURIComponent(code)}&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        },
        cache: 'no-store'
      }
    );
    const rows = await res.json();
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (_) {
    return null;
  }
}

function resolveTemplate(order) {
  const catalog = globalThis.TEMPLATES_CATALOG || [];
  if (!order) return catalog[0] || null;
  const tplId = order.payload?.templateId || order.template_type;
  return (
    catalog.find((t) => t.id === tplId) ||
    catalog.find((t) => t.engineUrl && t.engineUrl.includes(tplId)) ||
    catalog[0] ||
    null
  );
}

export async function generateMetadata({ params }) {
  const code = String(params.orderCode || '').toUpperCase().trim();
  const order = await fetchOrderByCode(code);
  const tpl = resolveTemplate(order);

  const receiver = order?.receiver_name || 'Bạn Yêu Thương';
  const sender = order?.sender_name || 'Người Thương';
  const occasion = order?.occasion || tpl?.preset?.occasion || 'Món Quà 3D Đặc Biệt';
  const emoji = tpl?.previewEmoji || '🎁';
  const tplTitle = tpl?.title || 'Không Gian Quà Tặng 3D';

  const title = `${emoji} Món quà đặc biệt gửi ${receiver} • Từ ${sender}`;
  const description = `${occasion} — ${tplTitle}. Chạm vào link để mở không gian 3D & lời chúc bí mật dành riêng cho ${receiver}!`;
  const ogImageUrl = `/api/og?code=${encodeURIComponent(code)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl]
    }
  };
}

export default async function GiftShortLinkPage({ params }) {
  const code = String(params.orderCode || '').toUpperCase().trim();
  const order = await fetchOrderByCode(code);
  const tpl = resolveTemplate(order);

  const enginePath = tpl?.engineUrl
    ? '/' + String(tpl.engineUrl).replace(/^\/+/, '')
    : '/templates/holiday/snow-globe-magic/index.html';
  const targetUrl = `${enginePath}?id=${encodeURIComponent(code)}`;
  const receiver = order?.receiver_name || 'Bạn Yêu Thương';
  const sender = order?.sender_name || 'Người Thương';
  const emoji = tpl?.previewEmoji || '🎁';

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 40%, #3b0d16 0%, #140508 65%, #070204 100%)',
        color: '#fffbeb'
      }}
    >
      <div style={{ fontSize: '3.4rem', marginBottom: '12px' }}>{emoji}</div>
      <div
        style={{
          display: 'inline-block',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(251, 191, 36, 0.15)',
          border: '1px solid rgba(251, 191, 36, 0.5)',
          color: '#fde047',
          fontSize: '0.84rem',
          fontWeight: 700,
          marginBottom: '12px'
        }}
      >
        ✨ Đang mở không gian quà tặng 3D...
      </div>
      <h1 style={{ fontSize: '1.8rem', color: '#fef08a', margin: '0 0 8px' }}>
        {`Gửi ${receiver} ❤️`}
      </h1>
      <p style={{ fontSize: '0.95rem', color: '#fde68a', opacity: 0.9, margin: '0 0 22px' }}>
        {`Một món quà 3D từ ${sender} đang được khởi tạo...`}
      </p>
      <a
        href={targetUrl}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '13px 26px',
          borderRadius: '999px',
          background: 'linear-gradient(135deg, #b91c1c, #dc2626 55%, #d97706)',
          border: '1.5px solid #fde047',
          color: '#fffbeb',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.94rem',
          boxShadow: '0 12px 32px rgba(185, 28, 28, 0.55)'
        }}
      >
        🎁 Mở Quà 3D Ngay
      </a>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(targetUrl)});`
        }}
      />
    </main>
  );
}
