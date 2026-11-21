/**
 * shared/tiktok-mode.js
 * Nút Chế độ Quay TikTok (#btn-tiktok-mode) dùng chung cho tất cả template.
 * Bấm nút 📹 ở góc trên phải (hoặc phím H) để ẩn toàn bộ HUD/nút bấm khi quay video TikTok.
 */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (document.getElementById('btn-tiktok-mode')) return;

  const STYLE_ID = 'shared-tiktok-mode-style';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #btn-tiktok-mode.shared-tiktok-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 34px;
        height: 34px;
        padding: 0 9px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.22);
        background: rgba(15, 10, 24, 0.58);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #fff;
        font-size: 0.92rem;
        line-height: 1;
        cursor: pointer;
        pointer-events: auto;
        transition: opacity 0.25s ease, transform 0.2s ease, background 0.2s ease;
        user-select: none;
        flex-shrink: 0;
      }
      #btn-tiktok-mode.shared-tiktok-btn:hover {
        background: rgba(255, 255, 255, 0.16);
        transform: translateY(-1px);
      }
      #btn-tiktok-mode.shared-tiktok-btn.floating-fallback {
        position: fixed;
        top: 12px;
        right: 12px;
        z-index: 9990;
      }
      @media (max-width: 520px) {
        #btn-tiktok-mode.shared-tiktok-btn {
          min-width: 29px;
          height: 29px;
          padding: 0 6px;
          font-size: 0.8rem;
        }
      }

      /* Ẩn toàn bộ HUD/nút bấm khi bật Chế độ Quay TikTok */
      body.tiktok-clean-mode .top-hud > :not(.top-hud-group):not(#btn-tiktok-mode),
      body.tiktok-clean-mode .top-hud-group > :not(#btn-tiktok-mode),
      body.tiktok-clean-mode .top-right-group > :not(#btn-tiktok-mode),
      body.tiktok-clean-mode .top-bar > :not(#btn-tiktok-mode),
      body.tiktok-clean-mode .hud-top-right > :not(#btn-tiktok-mode),
      body.tiktok-clean-mode .bottom-dock,
      body.tiktok-clean-mode .bottom-bar,
      body.tiktok-clean-mode .dock-wrap,
      body.tiktok-clean-mode .controls-bar,
      body.tiktok-clean-mode .hud-bottom-bar,
      body.tiktok-clean-mode .hud-header,
      body.tiktok-clean-mode .hud-hint,
      body.tiktok-clean-mode .preset-bar,
      body.tiktok-clean-mode .quick-presets-bar,
      body.tiktok-clean-mode .quick-preset-bar,
      body.tiktok-clean-mode .action-hint-pill,
      body.tiktok-clean-mode .story-caption-pill,
      body.tiktok-clean-mode .swipe-hint-pill,
      body.tiktok-clean-mode .gift-tap-banner,
      body.tiktok-clean-mode .bow-charge-wrap,
      body.tiktok-clean-mode #phase-pill,
      body.tiktok-clean-mode #rose-header,
      body.tiktok-clean-mode #garden-header,
      body.tiktok-clean-mode .hud-region-switch,
      body.tiktok-clean-mode .creator-only:not(#btn-tiktok-mode) {
        opacity: 0 !important;
        pointer-events: none !important;
        transition: opacity 0.25s ease;
      }

      body.tiktok-clean-mode #btn-tiktok-mode {
        opacity: 0.26 !important;
        pointer-events: auto !important;
      }
      body.tiktok-clean-mode #btn-tiktok-mode:hover {
        opacity: 1 !important;
      }

      .shared-tiktok-toast {
        position: fixed;
        top: 56px;
        left: 50%;
        transform: translateX(-50%) translateY(-8px);
        z-index: 9999;
        padding: 7px 14px;
        border-radius: 999px;
        background: rgba(12, 8, 22, 0.86);
        border: 1px solid rgba(255, 255, 255, 0.18);
        color: #fef3c7;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        font-size: 0.76rem;
        font-weight: 600;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.25s ease, transform 0.25s ease;
      }
      .shared-tiktok-toast.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  function showMiniToast(msg) {
    let toast = document.getElementById('shared-tiktok-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'shared-tiktok-toast';
      toast.className = 'shared-tiktok-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function toggleTikTokMode() {
    document.body.classList.toggle('tiktok-clean-mode');
    const isClean = document.body.classList.contains('tiktok-clean-mode');
    showMiniToast(
      isClean
        ? '📹 Chế độ Quay TikTok: Bật (chạm lại 📹 để hiện nút)'
        : '✨ Đã hiện lại thanh điều khiển'
    );
  }

  function mountButton() {
    if (document.getElementById('btn-tiktok-mode')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'btn-tiktok-mode';
    btn.className = 'shared-tiktok-btn';
    btn.title = 'Chế độ Quay TikTok (Ẩn nút bấm • Phím H)';
    btn.setAttribute('aria-label', 'Chế độ Quay TikTok');
    btn.textContent = '📹';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleTikTokMode();
    });

    const hudGroups = document.querySelectorAll('.top-hud-group');
    const container =
      (hudGroups.length ? hudGroups[hudGroups.length - 1] : null) ||
      document.querySelector('.top-right-group') ||
      document.querySelector('.hud-top-right') ||
      document.querySelector('.top-hud') ||
      document.querySelector('.top-bar');

    if (container) {
      container.appendChild(btn);
    } else {
      btn.classList.add('floating-fallback');
      document.body.appendChild(btn);
    }
  }

  window.addEventListener('keydown', (e) => {
    if (e.key && e.key.toLowerCase() === 'h' && !/INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '')) {
      toggleTikTokMode();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountButton);
  } else {
    mountButton();
  }
})();
