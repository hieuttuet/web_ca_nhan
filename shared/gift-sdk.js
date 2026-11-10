/**
 * SHARED GIFT & VIETQR PAYMENT SDK (shared/gift-sdk.js)
 * Dùng chung cho tất cả các bộ Template theo từng Sự kiện (Category).
 *
 * Chức năng tự động:
 * 1. Tự động kiểm tra chế độ Người Nhận Quà (?id=LOVE...) -> Tải dữ liệu từ Supabase & ẩn nút chỉnh sửa/thanh toán.
 * 2. Tự động render Modal Thanh Toán VietQR + Nút tải mã QR chuyển tiền.
 * 3. Tự động Polling (/api/check-order) mỗi 2.5s -> Mở khóa Link & Mã QR quà tặng ngay khi khách chuyển khoản.
 * 4. Hỗ trợ nút Sao chép Link & Lưu Mã QR Quà Tặng (.png) về điện thoại.
 */

(function (global) {
  const GiftSDK = {
    currentOrderCode: null,
    pollTimer: null,
    isRecipientMode: false,
    orderData: null,

    /**
     * Khởi tạo SDK cho một Template
     * @param {Object} options
     * @param {string} options.templateId - Mã định danh template trong catalog
     * @param {Function} options.onGiftLoaded - Callback(order) khi người nhận mở link quà đã thanh toán (?id=LOVE...)
     * @param {Function} options.onDemoMode - Callback() khi khách bấm Xem Demo (?demo=1)
     * @param {Function} options.onCreateMode - Callback() khi khách bấm Tạo Ngay (?create=1)
     */
    async init(options = {}) {
      this.templateId = options.templateId || 'custom_template';
      this.injectModalStylesAndDOM();

      const params = new URLSearchParams(window.location.search);
      const tplFromUrl = params.get('tpl');
      if (tplFromUrl) this.templateId = tplFromUrl;

      const orderId = params.get('id');
      if (orderId) {
        try {
          const res = await fetch(`/api/check-order?code=${encodeURIComponent(orderId)}`);
          const data = await res.json();
          if (res.ok && data.status === 'PAID' && data.order) {
            this.isRecipientMode = true;
            this.orderData = data.order;
            this.applyRecipientUI();
            if (typeof options.onGiftLoaded === 'function') {
              options.onGiftLoaded(data.order);
            }
            return { mode: 'recipient', order: data.order };
          }
        } catch (err) {
          console.warn('GiftSDK load order error:', err);
        }
      }

      if (params.get('demo') === '1' && typeof options.onDemoMode === 'function') {
        options.onDemoMode();
        return { mode: 'demo' };
      }

      if (params.get('create') === '1' && typeof options.onCreateMode === 'function') {
        options.onCreateMode();
        return { mode: 'create' };
      }

      return { mode: 'default' };
    },

    /**
     * Ẩn toàn bộ phần tử dành cho người tạo có class .creator-only khi người nhận mở link quà
     */
    applyRecipientUI() {
      document.querySelectorAll('.creator-only, [data-creator-only]').forEach((el) => {
        el.style.display = 'none';
      });
    },

    /**
     * Mở Modal Thanh Toán VietQR cho đơn hàng mới
     */
    async openPayment({
      templateId,
      templateType = 'custom',
      senderName = 'Anh',
      receiverName = 'Em',
      occasion = 'Món Quà Đặc Biệt',
      message = '',
      payload = {},
      sharePath = window.location.pathname
    }) {
      const tplId = templateId || this.templateId;
      this.showToast('⏳ Đang khởi tạo mã VietQR...');

      try {
        const res = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId: tplId,
            templateType,
            senderName,
            receiverName,
            occasion,
            message,
            payload
          })
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Chưa cấu hình Biến môi trường trên Vercel.');
          return;
        }

        this.currentOrderCode = data.orderCode;
        this.currentReceiverName = receiverName;
        this.currentSharePath = sharePath;

        document.getElementById('gsdk-vietqr-img').src = data.qrUrl;
        document.getElementById('gsdk-bank').textContent = data.bankId;
        document.getElementById('gsdk-acc-name').textContent = data.accountName;
        document.getElementById('gsdk-acc-no').textContent = data.accountNo;
        document.getElementById('gsdk-amount').textContent = Number(data.amount).toLocaleString('vi-VN') + 'đ';
        document.getElementById('gsdk-memo').textContent = data.orderCode;

        document.getElementById('gsdk-step-waiting').style.display = 'block';
        document.getElementById('gsdk-step-paid').style.display = 'none';
        document.getElementById('gsdk-payment-modal').classList.add('active');

        this.startPolling(data.orderCode);
      } catch (err) {
        alert('Hãy triển khai lên Vercel để sử dụng thanh toán tự động VietQR.');
      }
    },

    startPolling(orderCode) {
      if (this.pollTimer) clearInterval(this.pollTimer);
      this.pollTimer = setInterval(async () => {
        try {
          const res = await fetch(`/api/check-order?code=${encodeURIComponent(orderCode)}`);
          const data = await res.json();
          if (res.ok && data.status === 'PAID') {
            clearInterval(this.pollTimer);
            this.unlockOrder(orderCode);
          }
        } catch (e) {}
      }, 2500);
    },

    unlockOrder(orderCode) {
      const shareUrl = `${window.location.origin}${this.currentSharePath || window.location.pathname}?id=${orderCode}`;
      document.getElementById('gsdk-share-url').value = shareUrl;
      document.getElementById('gsdk-gift-qr-img').src =
        `https://api.qrserver.com/v1/create-qr-code/?size=360x360&color=be185d&data=${encodeURIComponent(shareUrl)}`;

      document.getElementById('gsdk-step-waiting').style.display = 'none';
      document.getElementById('gsdk-step-paid').style.display = 'block';
      this.showToast('🎉 Thanh toán thành công! Đã mở khóa Link & Mã QR!');
    },

    closeModal() {
      if (this.pollTimer) clearInterval(this.pollTimer);
      const modal = document.getElementById('gsdk-payment-modal');
      if (modal) modal.classList.remove('active');
    },

    async downloadBlobImage(url, filename) {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
      } catch (e) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.download = filename;
        a.click();
      }
    },

    showToast(msg) {
      let toast = document.getElementById('gsdk-toast');
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2800);
    },

    injectModalStylesAndDOM() {
      if (document.getElementById('gsdk-payment-modal')) return;

      const style = document.createElement('style');
      style.textContent = `
        .gsdk-toast {
          position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-20px);
          z-index: 9999; background: linear-gradient(135deg, #10b981, #059669); color: #fff;
          padding: 9px 20px; border-radius: 999px; font-size: 0.84rem; font-weight: 600;
          opacity: 0; pointer-events: none; transition: all 0.3s ease; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .gsdk-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
        .gsdk-modal-overlay {
          position: fixed; inset: 0; z-index: 9990; background: rgba(6, 3, 15, 0.85);
          backdrop-filter: blur(14px); display: flex; align-items: center; justify-content: center;
          padding: 16px; opacity: 0; visibility: hidden; pointer-events: none; transition: all 0.3s ease;
          font-family: 'Plus Jakarta Sans', sans-serif; color: #fff;
        }
        .gsdk-modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
        .gsdk-card {
          position: relative; width: 100%; max-width: 420px; max-height: 92vh; overflow-y: auto;
          background: rgba(20, 10, 38, 0.96); border: 1px solid rgba(255, 140, 205, 0.35);
          border-radius: 24px; padding: 26px 22px; text-align: center;
          box-shadow: 0 24px 60px rgba(0,0,0,0.75);
        }
        .gsdk-close {
          position: absolute; top: 14px; right: 14px; width: 34px; height: 34px;
          border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08);
          color: #fff; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        .gsdk-qr-box {
          background: #fff; padding: 12px; border-radius: 16px; width: 215px; margin: 0 auto 12px;
        }
        .gsdk-qr-box img { width: 100%; display: block; border-radius: 8px; }
        .gsdk-info-box {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px; padding: 10px 14px; font-size: 0.82rem; margin-bottom: 12px; text-align: left;
        }
        .gsdk-row {
          display: flex; justify-content: space-between; padding: 5px 0;
          border-bottom: 1px dashed rgba(255,255,255,0.1);
        }
        .gsdk-row:last-child { border-bottom: none; }
        .gsdk-btn {
          width: 100%; padding: 12px 16px; border-radius: 999px; border: none;
          font-family: inherit; font-size: 0.88rem; font-weight: 700; cursor: pointer;
          color: #fff; background: linear-gradient(135deg, #ff2a85, #9333ea);
          transition: transform 0.2s ease;
        }
        .gsdk-btn:hover { transform: translateY(-2px); }
        .gsdk-btn-outline {
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,158,198,0.45);
          margin-bottom: 12px;
        }
        .gsdk-input {
          width: 100%; padding: 11px 12px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.07);
          color: #fff; font-size: 0.8rem; margin-bottom: 12px; text-align: center; outline: none;
        }
      `;
      document.head.appendChild(style);

      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <div id="gsdk-toast" class="gsdk-toast">Đã sao chép!</div>
        <div id="gsdk-payment-modal" class="gsdk-modal-overlay">
          <div class="gsdk-card">
            <button type="button" class="gsdk-close" id="gsdk-btn-close">✕</button>

            <div id="gsdk-step-waiting">
              <h3 style="font-size: 1.35rem; margin-bottom: 6px; color: #ff9ec6;">📲 Quét VietQR Mở Khóa Link</h3>
              <p style="font-size: 0.82rem; color: #cbd5e1; margin-bottom: 12px;">
                Hệ thống tự động mở khóa Link & Mã QR ngay sau 3 giây khi nhận chuyển khoản!
              </p>
              <div class="gsdk-qr-box">
                <img id="gsdk-vietqr-img" src="" alt="VietQR" />
              </div>
              <button type="button" id="gsdk-btn-dl-vietqr" class="gsdk-btn gsdk-btn-outline">
                📥 Tải Mã QR Chuyển Tiền (Quét từ App Ngân Hàng)
              </button>
              <div class="gsdk-info-box">
                <div class="gsdk-row"><span style="color:#94a3b8;">Ngân hàng:</span><strong id="gsdk-bank">BIDV</strong></div>
                <div class="gsdk-row"><span style="color:#94a3b8;">Chủ TK:</span><strong id="gsdk-acc-name">---</strong></div>
                <div class="gsdk-row"><span style="color:#94a3b8;">Số tài khoản:</span><strong id="gsdk-acc-no">---</strong></div>
                <div class="gsdk-row"><span style="color:#94a3b8;">Số tiền:</span><strong id="gsdk-amount" style="color:#fde047;">---</strong></div>
                <div class="gsdk-row"><span style="color:#94a3b8;">Nội dung CK:</span><strong id="gsdk-memo" style="color:#ff9ec6;">LOVE...</strong></div>
              </div>
              <div style="padding: 10px; border-radius: 12px; background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.35); color: #fde047; font-size: 0.8rem; font-weight: 600;">
                🔄 Đang chờ xác nhận thanh toán tự động...
              </div>
            </div>

            <div id="gsdk-step-paid" style="display: none;">
              <h3 style="font-size: 1.45rem; margin-bottom: 6px; color: #6ee7b7;">🎉 Đã Mở Khóa Món Quà!</h3>
              <p style="font-size: 0.82rem; color: #cbd5e1; margin-bottom: 12px;">
                Gửi đường link hoặc lưu mã QR bên dưới để gửi tặng người thương nhé!
              </p>
              <div class="gsdk-qr-box">
                <img id="gsdk-gift-qr-img" src="" alt="Gift QR" />
              </div>
              <input id="gsdk-share-url" type="text" class="gsdk-input" readonly />
              <div style="display: flex; gap: 8px;">
                <button type="button" id="gsdk-btn-copy" class="gsdk-btn" style="flex: 1;">📋 Sao Chép Link</button>
                <button type="button" id="gsdk-btn-dl-giftqr" class="gsdk-btn" style="flex: 1; background: linear-gradient(135deg, #059669, #10b981);">📥 Lưu Mã QR</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(wrapper);

      document.getElementById('gsdk-btn-close').addEventListener('click', () => this.closeModal());
      document.getElementById('gsdk-btn-copy').addEventListener('click', () => {
        const input = document.getElementById('gsdk-share-url');
        input.select();
        navigator.clipboard.writeText(input.value);
        this.showToast('📋 Đã sao chép đường link quà tặng!');
      });
      document.getElementById('gsdk-btn-dl-vietqr').addEventListener('click', async () => {
        const img = document.getElementById('gsdk-vietqr-img');
        if (!img.src) return;
        this.showToast('⏳ Đang tải mã VietQR...');
        await this.downloadBlobImage(img.src, `VietQR-${this.currentOrderCode || 'Pay'}.png`);
        this.showToast('✅ Đã lưu mã VietQR vào máy!');
      });
      document.getElementById('gsdk-btn-dl-giftqr').addEventListener('click', async () => {
        const img = document.getElementById('gsdk-gift-qr-img');
        if (!img.src) return;
        this.showToast('⏳ Đang lưu mã QR quà tặng...');
        await this.downloadBlobImage(img.src, `Ma-QR-Qua-Tang-${this.currentReceiverName || 'Gift'}.png`);
        this.showToast('✅ Đã lưu mã QR Quà Tặng vào máy!');
      });
    }
  };

  global.GiftSDK = GiftSDK;
})(typeof window !== 'undefined' ? window : globalThis);
