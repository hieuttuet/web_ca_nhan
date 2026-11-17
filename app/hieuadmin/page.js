'use client';

import { useState, useEffect } from 'react';

export default function HieuAdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [query, setQuery] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [paidCount, setPaidCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  async function loadOrders({
    nextPage = page,
    nextSize = pageSize,
    nextStatus = statusFilter,
    nextQuery = query,
    nextKey = adminKey
  } = {}) {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', String(nextPage));
      params.set('pageSize', String(nextSize));
      if (nextStatus) params.set('status', nextStatus);
      if (nextQuery) params.set('q', nextQuery);

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: { 'x-admin-key': nextKey }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Không tải được danh sách đơn');

      setOrders(data.orders || []);
      setPage(data.page || nextPage);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
      setPaidCount(data.paidCount || 0);
      setTotalRevenue(data.totalRevenue || 0);
    } catch (err) {
      setOrders([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('hieuadmin_key') || sessionStorage.getItem('admin_key') || '';
    setAdminKey(saved);
    if (saved) {
      loadOrders({ nextPage: 1, nextKey: saved });
    } else {
      setError('Vui lòng nhập mật khẩu Admin (SEPAY_API_KEY) ở khung bên trên rồi bấm Mở khóa.');
    }
  }, []);

  function handleUnlockSubmit(e) {
    e.preventDefault();
    const clean = adminKey.trim();
    localStorage.setItem('hieuadmin_key', clean);
    sessionStorage.setItem('admin_key', clean);
    loadOrders({ nextPage: 1, nextKey: clean });
  }

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
      if (res.ok) loadOrders({ nextPage: page });
    } catch (_) {}
  }

  function copyShortLink(code) {
    const url = `${window.location.origin}/q/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 1800);
  }

  function goToPage(targetPage) {
    const p = Math.max(1, Math.min(totalPages, targetPage));
    setPage(p);
    loadOrders({ nextPage: p });
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0c0608', color: '#fffbeb', padding: '24px 16px' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#fef08a' }}>🛠️ Quản Lý Đơn Hàng & Link Quà 3D (/hieuadmin)</h1>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#fde68a', opacity: 0.85 }}>
              Tra cứu đơn hàng có phân trang, sao chép link ngắn <code>/q/LOVE...</code> & kích hoạt đơn thủ công.
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

        {/* 1. KHUNG NHẬP PASSWORD Ở TRÊN CÙNG */}
        <form
          onSubmit={handleUnlockSubmit}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 10,
            padding: '14px 16px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(185,28,28,0.22), rgba(217,119,6,0.16))',
            border: '1.5px solid rgba(251,191,36,0.5)',
            marginBottom: 18
          }}
        >
          <span style={{ fontWeight: 700, color: '#fde047', fontSize: '0.9rem' }}>
            🔐 Mật khẩu Admin (SEPAY_API_KEY):
          </span>
          <input
            type={showKey ? 'text' : 'password'}
            placeholder="Dán SEPAY_API_KEY vào đây..."
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            style={{
              flex: '1 1 240px',
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid rgba(251,191,36,0.45)',
              background: 'rgba(10,4,6,0.85)',
              color: '#fffbeb',
              fontSize: '0.88rem'
            }}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            style={{
              padding: '10px 13px',
              borderRadius: 10,
              border: '1px solid rgba(251,191,36,0.35)',
              background: 'rgba(255,255,255,0.06)',
              color: '#fde68a',
              cursor: 'pointer',
              fontSize: '0.82rem'
            }}
          >
            {showKey ? '🙈 Ẩn' : '👁️ Hiện'}
          </button>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              border: '1.5px solid #fde047',
              background: 'linear-gradient(135deg, #b91c1c, #d97706)',
              color: '#fffbeb',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.88rem'
            }}
          >
            🔓 Mở khóa & Tải dữ liệu
          </button>
        </form>

        {error && (
          <div style={{ padding: 12, borderRadius: 12, background: 'rgba(239,68,68,0.18)', border: '1px solid #ef4444', color: '#fca5a5', marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Thống kê tổng */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
          <div style={{ padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(251,191,36,0.25)' }}>
            <div style={{ fontSize: '0.78rem', color: '#fde68a' }}>Tổng số đơn (khớp lọc)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalCount}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 16, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.35)' }}>
            <div style={{ fontSize: '0.78rem', color: '#6ee7b7' }}>Tổng đơn PAID toàn hệ thống</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#6ee7b7' }}>{paidCount}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 16, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.38)' }}>
            <div style={{ fontSize: '0.78rem', color: '#fde047' }}>Tổng doanh thu (PAID)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fde047' }}>
              {totalRevenue.toLocaleString('vi-VN')}đ
            </div>
          </div>
        </div>

        {/* Bộ lọc tìm kiếm */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Tìm mã LOVE..., tên người nhận/gửi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadOrders({ nextPage: 1, nextQuery: query })}
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
              const st = e.target.value;
              setStatusFilter(st);
              loadOrders({ nextPage: 1, nextStatus: st });
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
          <select
            value={pageSize}
            onChange={(e) => {
              const sz = Number(e.target.value);
              setPageSize(sz);
              loadOrders({ nextPage: 1, nextSize: sz });
            }}
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              border: '1px solid rgba(251,191,36,0.35)',
              background: '#1a0c10',
              color: '#fef08a'
            }}
          >
            <option value={20}>20 đơn / trang</option>
            <option value={50}>50 đơn / trang</option>
            <option value={100}>100 đơn / trang</option>
          </select>
          <button
            type="button"
            onClick={() => loadOrders({ nextPage: 1 })}
            style={{
              padding: '10px 18px',
              borderRadius: 12,
              border: '1px solid #fde047',
              background: 'rgba(251,191,36,0.16)',
              color: '#fef08a',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🔍 Tìm / Làm mới
          </button>
        </div>

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
                    <td style={{ padding: '11px 14px', fontWeight: 700, color: '#fef08a' }}>
                      {ord.order_code}
                      <div style={{ fontSize: '0.72rem', color: '#a8a29e', fontWeight: 400 }}>
                        {ord.created_at ? new Date(ord.created_at).toLocaleString('vi-VN') : ''}
                      </div>
                    </td>
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

        {/* Thanh Phân Trang (Pagination) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginTop: 16,
            padding: '12px 16px',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(251,191,36,0.22)'
          }}
        >
          <div style={{ fontSize: '0.84rem', color: '#fde68a' }}>
            Trang <strong>{page}</strong> / <strong>{totalPages}</strong> • Tổng <strong>{totalCount}</strong> đơn hàng
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => goToPage(1)}
              style={{
                padding: '7px 11px',
                borderRadius: 8,
                border: '1px solid rgba(251,191,36,0.35)',
                background: 'rgba(255,255,255,0.06)',
                color: page <= 1 ? '#6b7280' : '#fef08a',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem'
              }}
            >
              « Đầu
            </button>
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => goToPage(page - 1)}
              style={{
                padding: '7px 12px',
                borderRadius: 8,
                border: '1px solid rgba(251,191,36,0.35)',
                background: 'rgba(255,255,255,0.06)',
                color: page <= 1 ? '#6b7280' : '#fef08a',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem'
              }}
            >
              ‹ Trước
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => goToPage(page + 1)}
              style={{
                padding: '7px 12px',
                borderRadius: 8,
                border: '1px solid rgba(251,191,36,0.35)',
                background: 'rgba(255,255,255,0.06)',
                color: page >= totalPages ? '#6b7280' : '#fef08a',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Sau ›
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => goToPage(totalPages)}
              style={{
                padding: '7px 11px',
                borderRadius: 8,
                border: '1px solid rgba(251,191,36,0.35)',
                background: 'rgba(255,255,255,0.06)',
                color: page >= totalPages ? '#6b7280' : '#fef08a',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Cuối »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
