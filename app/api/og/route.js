import { ImageResponse } from 'next/og';
import '../../../templates-catalog.js';

export const runtime = 'edge';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = String(searchParams.get('code') || '').toUpperCase().trim();

  let receiver = searchParams.get('to') || 'Bạn Yêu Thương';
  let sender = searchParams.get('from') || 'Người Thương';
  let occasion = searchParams.get('occ') || 'Món Quà 3D Đặc Biệt';
  let emoji = '🎁';
  let title = 'Không Gian Quà Tặng 3D Độc Bản';
  let bg = 'linear-gradient(135deg, #2b0712 0%, #6b141a 52%, #140509 100%)';

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (code && supabaseUrl && supabaseKey) {
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
      if (Array.isArray(rows) && rows.length > 0) {
        const ord = rows[0];
        receiver = ord.receiver_name || receiver;
        sender = ord.sender_name || sender;
        occasion = ord.occasion || occasion;
        const tplId = ord.payload?.templateId || ord.template_type;
        const catalog = globalThis.TEMPLATES_CATALOG || [];
        const tpl = catalog.find((t) => t.id === tplId);
        if (tpl) {
          emoji = tpl.previewEmoji || emoji;
          title = tpl.title || title;
          bg = tpl.previewGradient || bg;
        }
      }
    } catch (_) {}
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: bg,
          color: '#fffbeb',
          padding: '48px 64px',
          position: 'relative',
          fontFamily: 'sans-serif'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '24px',
            border: '3px solid rgba(253, 224, 71, 0.55)',
            borderRadius: '28px',
            display: 'flex'
          }}
        />
        <div style={{ fontSize: 82, marginBottom: 12, display: 'flex' }}>{emoji}</div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#fde047',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 14,
            display: 'flex'
          }}
        >
          {occasion}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: 16,
            display: 'flex'
          }}
        >
          {`Gửi ${receiver} ❤️`}
        </div>
        <div
          style={{
            fontSize: 30,
            color: '#fef08a',
            marginBottom: 28,
            display: 'flex'
          }}
        >
          {`Từ: ${sender} • ${title}`}
        </div>
        <div
          style={{
            padding: '12px 28px',
            borderRadius: '999px',
            background: 'rgba(251, 191, 36, 0.2)',
            border: '2px solid #fde047',
            color: '#fffbeb',
            fontSize: 24,
            fontWeight: 700,
            display: 'flex'
          }}
        >
          ✨ Chạm để mở món quà 3D & lời chúc bí mật ✨
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
