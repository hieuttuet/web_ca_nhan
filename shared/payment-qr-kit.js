/**
 * SHARED PAYMENT, QR CARD & PHOTO UPLOAD KIT (shared/payment-qr-kit.js)
 * Dùng chung cho tất cả template HTML/JS thuần trong Web Cá Nhân Hóa:
 *  1. Thanh toán VietQR tự động (/api/create-order + /api/check-order + lưu PendingOrder)
 *  2. Tải ảnh QR & Thiệp QR chuẩn PNG (/api/download-qr + rasterizeBlobToPng)
 *  3. Vẽ Thiệp QR 600x780 chuẩn Hoa Đào / Hoa Mai Rơi 3D
 *  4. Upload & nén ảnh kỷ niệm client-side (bindPhotoUploader)
 */
(function (global) {
  'use strict';

  const ORDER_TTL_MS = 45 * 60 * 1000;
  let activeOrderCode = '';
  let pollTimer = null;
  let activeConfig = null;
  let modalInjected = false;

  // ==================== 1. PENDING ORDER STORAGE ====================
  function getPendingKey(templateId) {
    return 'pending_order_' + (templateId || 'default');
  }

  function savePendingOrder(templateId, data) {
    try {
      const payload = JSON.stringify({ ...data, savedAt: Date.now() });
      const k = getPendingKey(templateId);
      sessionStorage.setItem(k, payload);
      localStorage.setItem(k, payload);
    } catch (_) {}
  }

  function loadPendingOrder(templateId) {
    const k = getPendingKey(templateId);
    const raw = sessionStorage.getItem(k) || localStorage.getItem(k);
    if (!raw) return null;
    try {
      const p = JSON.parse(raw);
      if (!p.savedAt || Date.now() - p.savedAt > ORDER_TTL_MS) {
        clearPendingOrder(templateId);
        return null;
      }
      return p;
    } catch (_) {
      return null;
    }
  }

  function clearPendingOrder(templateId) {
    const k = getPendingKey(templateId);
    try { sessionStorage.removeItem(k); } catch (_) {}
    try { localStorage.removeItem(k); } catch (_) {}
  }

  // ==================== 2. QR DOWNLOAD & RASTER PNG ====================
  async function rasterizeBlobToPng(blob) {
    const url = URL.createObjectURL(blob);
    try {
      return await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement('canvas');
          c.width = img.naturalWidth || 600;
          c.height = img.naturalHeight || 600;
          const g = c.getContext('2d');
          g.fillStyle = '#ffffff';
          g.fillRect(0, 0, c.width, c.height);
          g.drawImage(img, 0, 0);
          c.toBlob((out) => (out ? resolve(out) : reject(new Error('toBlob failed'))), 'image/png', 1);
        };
        img.onerror = reject;
        img.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function urlToImageBlob(url, filename = 'QR.png') {
    if (url.startsWith('data:') || url.startsWith('blob:')) {
      const res = await fetch(url);
      return await res.blob();
    }
    try {
      const parsed = new URL(url, window.location.href);
      if (parsed.hostname === 'img.vietqr.io' || parsed.hostname === 'api.qrserver.com') {
        const proxyUrl = `/api/download-qr?url=${encodeURIComponent(parsed.toString())}&filename=${encodeURIComponent(filename)}`;
        const pRes = await fetch(proxyUrl);
        if (pRes.ok) {
          return await rasterizeBlobToPng(await pRes.blob());
        }
      }
    } catch (_) {}
    const res = await fetch(url, { mode: 'cors' });
    return await rasterizeBlobToPng(await res.blob());
  }

  async function downloadBlobImage(url, filename) {
    try {
      const blob = await urlToImageBlob(url, filename);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
    } catch (_) {
      window.open(url, '_blank');
    }
  }

  // ==================== 3. GIFT QR CARD RENDERER (600x780) ====================
  function renderGiftQrCard(canvas, opts = {}) {
    if (!canvas) return;
    const g = canvas.getContext('2d');
    const stops = opts.gradientStops || ['#450a0a', '#991b1b', '#2d0606'];
    const bg = g.createLinearGradient(0, 0, 600, 780);
    bg.addColorStop(0, stops[0]);
    bg.addColorStop(0.55, stops[1]);
    bg.addColorStop(1, stops[2]);
    g.fillStyle = bg;
    g.fillRect(0, 0, 600, 780);

    g.strokeStyle = '#fde047';
    g.lineWidth = 4;
    g.strokeRect(24, 24, 552, 732);

    g.fillStyle = '#fef08a';
    g.textAlign = 'center';
    g.font = '800 28px "Cinzel", Georgia, serif';
    g.fillText(opts.cardTitle || '✨ THIỆP QUÀ TẶNG 3D ✨', 300, 90);

    g.fillStyle = '#ffe4e6';
    let recSize = 40;
    const recLine = `Gửi ${opts.receiver || 'Bạn Yêu Thương'}`;
    do {
      g.font = `700 ${recSize}px "Dancing Script", Georgia, cursive`;
      if (g.measureText(recLine).width <= 500 || recSize <= 22) break;
      recSize -= 2;
    } while (recSize > 22);
    g.fillText(recLine, 300, 148);

    g.fillStyle = '#ffffff';
    g.fillRect(145, 195, 310, 310);

    const shareUrl = opts.shareUrl || window.location.href;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(shareUrl)}`;
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.onload = () => {
      g.drawImage(qrImg, 160, 210, 280, 280);
    };
    qrImg.src = qrUrl;

    g.fillStyle = '#fde047';
    g.font = '700 22px "Plus Jakarta Sans", sans-serif';
    g.fillText(opts.scanLabel || 'Quét QR để Mở Quà 3D', 300, 565);

    g.fillStyle = '#fef2f2';
    let subSize = 18;
    const subLine = `Từ: ${opts.sender || 'Người Bạn Thân'} • ${opts.occasion || ''}`.replace(/\s*•\s*$/, '');
    do {
      g.font = `500 ${subSize}px "Plus Jakarta Sans", sans-serif`;
      if (g.measureText(subLine).width <= 510 || subSize <= 12) break;
      subSize -= 1;
    } while (subSize > 12);
    g.fillText(subLine, 300, 610);

    g.fillStyle = 'rgba(253, 224, 71, 0.78)';
    g.font = '600 15px "Plus Jakarta Sans", sans-serif';
    g.fillText(opts.footerHint || 'Chạm để mở thiệp & album kỷ niệm 3D', 300, 705);
  }

  // ==================== 4. UNIFIED PAYMENT + QR MODAL ====================
  function ensureModalInjected() {
    if (modalInjected || document.getElementById('pqk-modal-payment')) {
      modalInjected = true;
      return;
    }
    const style = document.createElement('style');
    style.textContent = `
      #pqk-modal-payment {
        position: fixed; inset: 0; z-index: 9990;
        background: rgba(10, 4, 6, 0.84); backdrop-filter: blur(10px);
        display: flex; align-items: center; justify-content: center;
        padding: 16px; transition: opacity 0.25s ease;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #fffbeb;
      }
      #pqk-modal-payment.pqk-hidden { opacity: 0; pointer-events: none; display: none !important; }
      .pqk-card {
        position: relative; width: 100%; max-width: 470px; max-height: 92vh; overflow-y: auto;
        border-radius: 22px; padding: 24px 20px;
        background: linear-gradient(165deg, rgba(42, 13, 14, 0.98), rgba(18, 6, 8, 0.99));
        border: 1.5px solid rgba(251, 191, 36, 0.5);
        box-shadow: 0 28px 70px rgba(0, 0, 0, 0.85); text-align: center;
      }
      .pqk-close {
        position: absolute; top: 12px; right: 12px; width: 34px; height: 34px;
        border-radius: 50%; border: 1px solid rgba(251, 191, 36, 0.4);
        background: rgba(255, 255, 255, 0.08); color: #fef08a; font-size: 1rem; cursor: pointer;
      }
      .pqk-badge {
        display: inline-block; padding: 5px 14px; border-radius: 999px;
        background: rgba(251, 191, 36, 0.14); border: 1px solid rgba(251, 191, 36, 0.45);
        color: #fde047; font-size: 0.76rem; font-weight: 700; margin-bottom: 8px;
      }
      .pqk-title { font-family: 'Cinzel', serif; font-size: 1.15rem; color: #fef08a; margin-bottom: 6px; }
      .pqk-sub { font-size: 0.82rem; color: #fde68a; opacity: 0.86; margin-bottom: 12px; line-height: 1.45; }
      .pqk-qr-wrap {
        display: inline-block; padding: 10px; border-radius: 16px; background: #fff;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); margin: 4px auto 12px;
      }
      .pqk-qr-wrap img { width: 205px; height: 205px; display: block; object-fit: contain; }
      .pqk-info-table {
        border-radius: 14px; background: rgba(15, 6, 6, 0.68);
        border: 1px solid rgba(251, 191, 36, 0.28); padding: 10px 14px;
        margin-bottom: 12px; font-size: 0.82rem; text-align: left;
      }
      .pqk-info-row {
        display: flex; justify-content: space-between; padding: 5px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }
      .pqk-info-row:last-child { border-bottom: none; }
      .pqk-btn-primary, .pqk-btn-secondary {
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        padding: 11px 14px; border-radius: 999px; font-weight: 700; font-size: 0.84rem;
        cursor: pointer; border: 1px solid rgba(251, 191, 36, 0.45); transition: all 0.2s ease;
      }
      .pqk-btn-primary {
        background: linear-gradient(135deg, #b91c1c, #dc2626 55%, #d97706);
        color: #fffbeb; border-color: rgba(253, 224, 71, 0.78);
      }
      .pqk-btn-secondary { background: rgba(255, 255, 255, 0.08); color: #fef08a; }
      .pqk-btn-row { display: flex; gap: 8px; margin-bottom: 8px; }
      .pqk-btn-row > * { flex: 1; }
      .pqk-input {
        width: 100%; padding: 10px 12px; border-radius: 12px;
        border: 1px solid rgba(251, 191, 36, 0.35); background: rgba(15, 6, 6, 0.75);
        color: #fffbeb; font-size: 0.82rem; text-align: center; margin-bottom: 10px;
      }
      .pqk-canvas-wrap {
        margin: 0 auto 12px; max-width: 280px; border-radius: 16px; overflow: hidden;
        border: 1.5px solid rgba(251, 191, 36, 0.5); box-shadow: 0 14px 36px rgba(0, 0, 0, 0.55);
      }
      .pqk-canvas-wrap canvas { width: 100%; height: auto; display: block; }
    `;
    document.head.appendChild(style);

    const wrap = document.createElement('div');
    wrap.id = 'pqk-modal-payment';
    wrap.className = 'pqk-hidden';
    wrap.innerHTML = `
      <div class="pqk-card">
        <button type="button" class="pqk-close" id="pqk-btn-close" aria-label="Đóng">✕</button>
        <div id="pqk-step-waiting">
          <div class="pqk-badge">📲 Thanh Toán Tự Động VietQR</div>
          <h3 class="pqk-title" id="pqk-wait-title">Quét Mã Mở Khóa Thiệp VIP 3D</h3>
          <p class="pqk-sub">Quét mã VietQR bằng bất kỳ App Ngân Hàng nào. Hệ thống tự động mở khóa link sau 3 giây khi nhận chuyển khoản!</p>
          <div class="pqk-qr-wrap"><img id="pqk-vietqr-img" src="" alt="VietQR" /></div>
          <button type="button" id="pqk-btn-download-vietqr" class="pqk-btn-secondary" style="width:100%; margin-bottom:12px;">📥 Tải Mã QR Chuyển Tiền</button>
          <div class="pqk-info-table">
            <div class="pqk-info-row"><span style="color:#d6c7b2;">Ngân hàng:</span><strong id="pqk-bank-name">MB</strong></div>
            <div class="pqk-info-row"><span style="color:#d6c7b2;">Chủ tài khoản:</span><strong id="pqk-account-name">---</strong></div>
            <div class="pqk-info-row"><span style="color:#d6c7b2;">Số tài khoản:</span><strong id="pqk-account-no">---</strong></div>
            <div class="pqk-info-row"><span style="color:#d6c7b2;">Số tiền:</span><strong id="pqk-amount-text" style="color:#fde047;">39.000đ</strong></div>
            <div class="pqk-info-row"><span style="color:#d6c7b2;">Nội dung CK (Bắt buộc):</span><strong id="pqk-memo-text" style="color:#fda4af;">---</strong></div>
          </div>
          <div style="padding:10px; border-radius:12px; background:rgba(251,191,36,0.12); border:1px solid rgba(251,191,36,0.35); color:#fde047; font-size:0.82rem; font-weight:700;">
            🔄 Đang chờ ngân hàng xác nhận tự động...
          </div>
        </div>
        <div id="pqk-step-success" style="display:none;">
          <div style="font-size:2rem; margin-bottom:4px;" id="pqk-success-emoji">🎉</div>
          <h3 class="pqk-title" style="color:#6ee7b7;" id="pqk-success-title">Thiệp 3D Đã Sẵn Sàng!</h3>
          <p class="pqk-sub">Tải tấm <b>Thiệp QR</b> bên dưới hoặc sao chép đường link gửi cho người nhận nhé!</p>
          <div class="pqk-canvas-wrap"><canvas id="pqk-gift-card-canvas" width="600" height="780"></canvas></div>
          <input id="pqk-share-url" type="text" class="pqk-input" readonly />
          <div class="pqk-btn-row">
            <button type="button" id="pqk-btn-copy" class="pqk-btn-primary">📋 Copy Link</button>
            <button type="button" id="pqk-btn-download-card" class="pqk-btn-secondary">📥 Tải Thiệp QR</button>
          </div>
          <div class="pqk-btn-row">
            <button type="button" id="pqk-btn-download-qr" class="pqk-btn-secondary" style="color:#fde047;">📥 Tải Ảnh QR</button>
            <button type="button" id="pqk-btn-open-share" class="pqk-btn-primary">✨ Mở Xem Ngay</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
    modalInjected = true;

    document.getElementById('pqk-btn-close').addEventListener('click', () => {
      if (activeConfig) clearPendingOrder(activeConfig.templateId);
      if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
      wrap.classList.add('pqk-hidden');
    });

    document.getElementById('pqk-btn-download-vietqr').addEventListener('click', () => {
      const src = document.getElementById('pqk-vietqr-img').src;
      if (src) downloadBlobImage(src, `VietQR-${activeOrderCode || 'Gift'}.png`);
    });

    document.getElementById('pqk-btn-copy').addEventListener('click', async () => {
      const btn = document.getElementById('pqk-btn-copy');
      try {
        await navigator.clipboard.writeText(document.getElementById('pqk-share-url').value);
        btn.textContent = 'Đã chép ✓';
        setTimeout(() => { btn.textContent = '📋 Copy Link'; }, 2000);
      } catch (_) {}
    });

    document.getElementById('pqk-btn-download-card').addEventListener('click', async () => {
      const c = document.getElementById('pqk-gift-card-canvas');
      await downloadBlobImage(c.toDataURL('image/png'), `Thiep-QR-${activeOrderCode || 'VIP'}.png`);
    });

    document.getElementById('pqk-btn-download-qr').addEventListener('click', async () => {
      const shareUrl = document.getElementById('pqk-share-url').value;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=520x520&data=${encodeURIComponent(shareUrl)}`;
      await downloadBlobImage(qrUrl, `QR-${activeOrderCode || 'VIP'}.png`);
    });

    const recheck = () => {
      if (activeOrderCode && !wrap.classList.contains('pqk-hidden')) {
        checkActiveOrderOnce();
      }
    };
    window.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') recheck(); });
    window.addEventListener('focus', recheck);
  }

  function showWaitingModal(orderData, cfg) {
    ensureModalInjected();
    activeConfig = cfg;
    activeOrderCode = orderData.orderCode;
    document.getElementById('pqk-wait-title').textContent = cfg.waitTitle || 'Quét Mã Mở Khóa Thiệp VIP 3D';
    document.getElementById('pqk-step-waiting').style.display = 'block';
    document.getElementById('pqk-step-success').style.display = 'none';
    document.getElementById('pqk-vietqr-img').src = orderData.qrUrl || '';
    document.getElementById('pqk-bank-name').textContent = orderData.bankId || 'MB';
    document.getElementById('pqk-account-name').textContent = orderData.accountName || '---';
    document.getElementById('pqk-account-no').textContent = orderData.accountNo || '---';
    document.getElementById('pqk-amount-text').textContent = `${Number(orderData.amount || cfg.defaultAmount || 39000).toLocaleString('vi-VN')}đ`;
    document.getElementById('pqk-memo-text').textContent = orderData.orderCode || '---';
    document.getElementById('pqk-modal-payment').classList.remove('pqk-hidden');
  }

  function showSuccessStep(orderCode) {
    const cfg = activeConfig || {};
    clearPendingOrder(cfg.templateId);
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    document.getElementById('pqk-step-waiting').style.display = 'none';
    document.getElementById('pqk-step-success').style.display = 'block';
    document.getElementById('pqk-success-emoji').textContent = cfg.emoji || '🎉';
    document.getElementById('pqk-success-title').textContent = cfg.successTitle || 'Thiệp 3D Đã Sẵn Sàng!';
    const shareUrl = `${window.location.origin}/q/${encodeURIComponent(orderCode)}`;
    document.getElementById('pqk-share-url').value = shareUrl;
    document.getElementById('pqk-btn-open-share').onclick = () => { window.location.href = shareUrl; };
    renderGiftQrCard(document.getElementById('pqk-gift-card-canvas'), {
      shareUrl,
      cardTitle: cfg.cardTitle,
      receiver: cfg.receiverName,
      sender: cfg.senderName,
      occasion: cfg.occasion,
      scanLabel: cfg.scanLabel,
      footerHint: cfg.footerHint,
      gradientStops: cfg.gradientStops
    });
  }

  async function checkActiveOrderOnce() {
    if (!activeOrderCode) return;
    try {
      const res = await fetch(`/api/check-order?code=${encodeURIComponent(activeOrderCode)}`);
      const data = await res.json();
      if (res.ok && data && data.status === 'PAID') {
        showSuccessStep(activeOrderCode);
      }
    } catch (_) {}
  }

  async function createOrderAndPay(opts) {
    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: opts.templateId,
        templateType: opts.templateType,
        senderName: opts.senderName,
        receiverName: opts.receiverName,
        occasion: opts.occasion,
        message: opts.message,
        payload: opts.payload || {}
      })
    });
    const data = await res.json();
    if (!res.ok || !data.orderCode || !data.qrUrl) {
      throw new Error(data.error || 'Tạo đơn thất bại');
    }
    const orderSnap = { ...data, senderName: opts.senderName, receiverName: opts.receiverName, occasion: opts.occasion };
    savePendingOrder(opts.templateId, orderSnap);
    showWaitingModal(orderSnap, opts);
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(checkActiveOrderOnce, 3000);
    checkActiveOrderOnce();
    return orderSnap;
  }

  function restorePendingIfAny(cfg) {
    const snap = loadPendingOrder(cfg.templateId);
    if (!snap || !snap.orderCode) return false;
    showWaitingModal(snap, { ...cfg, ...snap });
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(checkActiveOrderOnce, 3000);
    checkActiveOrderOnce();
    return true;
  }

  // ==================== 5. SHARED PHOTO UPLOAD & COMPRESSION ====================
  function bindPhotoUploader(inputEl, opts = {}) {
    if (!inputEl) return;
    const maxCount = opts.maxCount || 6;
    const maxSide = opts.maxSide || 900;
    const quality = opts.quality || 0.8;

    inputEl.addEventListener('change', (e) => {
      const currentList = typeof opts.getList === 'function' ? opts.getList() : [];
      const files = Array.from(e.target.files || []).slice(0, Math.max(0, maxCount - currentList.length));
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const ratio = Math.min(1, maxSide / Math.max(img.width, img.height));
            const c = document.createElement('canvas');
            c.width = Math.round(img.width * ratio);
            c.height = Math.round(img.height * ratio);
            c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            const dataUrl = c.toDataURL('image/jpeg', quality);
            if (typeof opts.onPhotoReady === 'function') opts.onPhotoReady(dataUrl);
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    });
  }

  global.PaymentQrKit = {
    savePendingOrder,
    loadPendingOrder,
    clearPendingOrder,
    rasterizeBlobToPng,
    urlToImageBlob,
    downloadBlobImage,
    renderGiftQrCard,
    createOrderAndPay,
    restorePendingIfAny,
    bindPhotoUploader
  };
})(window);
