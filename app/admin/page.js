'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [query, setQuery] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  async function loadOrders(customStatus = statusFilter, customQ = query, key = adminKey) {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (customStatus) params.set('status', customStatus);
      if (customQ) params.set('q', customQ);
      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: { 'x-admin-key': key }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Không tải được danh sách đơn');
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_key') || '';
    setAdminKey(saved);
    loadOrders('', '', saved);
  }, []);

  async function markOrderPaid(orderCode) {
    if (!confirm(`Xác nhận mở khóa (PAID) cho đơn ${orderCode}?`)) return;
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({ orderCode, status: 'PAID' })
      });
      if (res.ok) loadOrders();
    } catch (_) {}
  }

  function copyShortLink(code) {
    const url = `${window.location.origin}/q/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 1800);
  }

  const paidCount = orders.filter((o) => o.status === 'PAID').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'PAID')
    .reduce((sum, o) => sum + Number(o.amount || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#0c0608', color: '#fffbeb', padding: '24px 16px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#fef08a' }}>🛠️ Quản Lý Đơn Hàng & Link Quà 3D</h1>
            <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: '#fde68a', opacity: 0.85 }}>
              Tra cứu đơn, sao chép link ngắn <code>/q/LOVE...</code> (có OG Preview Zalo) & kích hoạt đơn thủ công.
            </p>
          </div>
          <a
            href="/"
            style={{
              padding: '9px 16px',
              borderRadius: 999,
              border: '1px solid rgba(251,191,36,0.45)',
              color: '#fef08a',
              textDecoration: 'none',
              fontSize: '0.84rem',
              fontWeight: 600
            }}
          >
            ← Về Trang Chủ
          </a>
        </div>

        {/* Thống kê nhanh */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
          <div style={{ padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(251,191,36,0.25)' }}>
            <div style={{ fontSize: '0.78rem', color: '#fde68a' }}>Tổng đơn hiển thị</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{orders.length}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 16, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.35)' }}>
            <div style={{ fontSize: '0.78rem', color: '#6ee7b7' }}>Đơn đã thanh toán (PAID)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#6ee7b7' }}>{paidCount}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 16, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.38)' }}>
            <div style={{ fontSize: '0.78rem', color: '#fde047' }}>Doanh thu (PAID)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fde047' }}>
              {totalRevenue.toLocaleString('vi-VN')}đ
            </div>
          </div>
        </div>

        {/* Bộ lọc */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
          <input
            type="text"
            placeholder="Tìm mã LOVE..., tên người nhận/gửi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadOrders(statusFilter, query, adminKey)}
            style={{
              flex: '1 1 240px',
              padding: '10px 14px',
              borderRadius: 12,
              border: '1px solid rgba(251,191,36,0.35)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fffbeb'
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              loadOrders(e.target.value, query, adminKey);
            }}
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              border: '1px solid rgba(251,191,36,0.35)',
              background: '#1a0c10',
              color: '#fef08a'
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PAID">✅ Đã thanh toán (PAID)</option>
            <option value="PENDING">⏳ Chờ thanh toán (PENDING)</option>
          </select>
          <input
            type="password"
            placeholder="Mật khẩu Admin (nếu cài)"
            value={adminKey}
            onChange={(e) => {
              setAdminKey(e.target.value);
              sessionStorage.setItem('admin_key', e.target.value);
            }}
            style={{
              width: 190,
              padding: '10px 14px',
              borderRadius: 12,
              border: '1px solid rgba(251,191,36,0.28)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fffbeb'
            }}
          />
          <button
            type="button"
            onClick={() => loadOrders(statusFilter, query, adminKey)}
            style={{
              padding: '10px 18px',
              borderRadius: 12,
              border: '1px solid #fde047',
              background: 'linear-gradient(135deg, #b91c1c, #d97706)',
              color: '#fffbeb',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🔄 Làm mới
          </button>
        </div>

        {error && (
          <div style={{ padding: 12, borderRadius: 12, background: 'rgba(239,68,68,0.18)', border: '1px solid #ef4444', color: '#fca5a5', marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Bảng danh sách đơn */}
        <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(251,191,36,0.28)', background: 'rgba(20,9,12,0.85)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(251,191,36,0.25)', color: '#fde047', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px' }}>Mã đơn</th>
                <th style={{ padding: '12px 14px' }}>Template</th>
                <th style={{ padding: '12px 14px' }}>Người gửi ➔ Nhận</th>
                <th style={{ padding: '12px 14px' }}>Số tiền</th>
                <th style={{ padding: '12px 14px' }}>Trạng thái</th>
                <th style={{ padding: '12px 14px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#fde68a' }}>
                    ⏳ Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#fde68a' }}>
                    Chưa có đơn hàng nào khớp bộ lọc.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.order_code} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '11px 14px', fontWeight: 700, color: '#fef08a' }}>{ord.order_code}</td>
                    <td style={{ padding: '11px 14px', color: '#fde68a' }}>{ord.template_type}</td>
                    <td style={{ padding: '11px 14px' }}>
                      <strong>{ord.sender_name}</strong> ➔ <strong style={{ color: '#fda4af' }}>{ord.receiver_name}</strong>
                      <div style={{ fontSize: '0.76rem', opacity: 0.75 }}>{ord.occasion}</div>
                    </td>
                    <td style={{ padding: '11px 14px', color: '#fde047', fontWeight: 700 }}>
                      {Number(ord.amount || 0).toLocaleString('vi-VN')}đ
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: 999,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: ord.status === 'PAID' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                          color: ord.status === 'PAID' ? '#6ee7b7' : '#fcd34d'
                        }}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td style={{ padding: '11px 14px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => copyShortLink(ord.order_code)}
                        style={{
                          padding: '6px 11px',
                          borderRadius: 8,
                          border: '1px solid rgba(251,191,36,0.45)',
                          background: 'rgba(251,191,36,0.12)',
                          color: '#fef08a',
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        {copiedCode === ord.order_code ? '✓ Đã chép' : '📋 Copy /q/'}
                      </button>
                      <a
                        href={`/q/${ord.order_code}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: '6px 11px',
                          borderRadius: 8,
                          border: '1px solid rgba(255,255,255,0.22)',
                          color: '#fffbeb',
                          textDecoration: 'none',
                          fontSize: '0.78rem'
                        }}
                      >
                        👁️ Xem 3D
                      </a>
                      {ord.status !== 'PAID' && (
                        <button
                          type="button"
                          onClick={() => markOrderPaid(ord.order_code)}
                          style={{
                            padding: '6px 11px',
                            borderRadius: 8,
                            border: '1px solid #10b981',
                            background: 'rgba(16,185,129,0.22)',
                            color: '#6ee7b7',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          ✅ Duyệt PAID
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
