-- ============================================================================
-- SUPABASE SQL SCHEMA: HỆ THỐNG WEB CÁ NHÂN HÓA TỰ ĐỘNG DUYỆT ĐƠN (VIETQR + SEPAY)
-- Hướng dẫn: Copy toàn bộ nội dung file này vào mục "SQL Editor" trên Supabase và bấm "Run"
-- ============================================================================

create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_code text unique not null,          -- Mã đơn hàng duy nhất (VD: LOVE83921)
  template_type text default 'fireworks',   -- 'fireworks' (Pháo hoa) hoặc 'galaxy' (Vũ trụ 3D)
  sender_name text not null,                -- Tên người gửi
  receiver_name text not null,              -- Tên người nhận
  occasion text default '',                 -- Dịp kỷ niệm
  message text default '',                  -- Lời chúc / Tâm thư
  payload jsonb default '{}'::jsonb,        -- Lưu mảng ảnh kỷ niệm, màu sắc, nhạc, ngày yêu...
  amount integer not null default 29000,    -- Số tiền cần thanh toán (VNĐ)
  status text not null default 'PENDING',   -- 'PENDING' (Chờ TT) hoặc 'PAID' (Đã thanh toán)
  transaction_id text,                      -- Mã giao dịch ngân hàng từ SePay
  paid_at timestamptz,                      -- Thời điểm thanh toán thành công
  created_at timestamptz default now()
);

-- Tạo index giúp tra cứu mã đơn hàng cực nhanh
create index if not exists idx_orders_order_code on public.orders (order_code);

-- Bật Row Level Security (RLS) để bảo mật tuyệt đối:
-- Không ai từ bên ngoài có thể tự sửa trạng thái đơn hàng sang PAID nếu không có SUPABASE_SERVICE_ROLE_KEY trên Vercel
alter table public.orders enable row level security;

-- Chỉ cho phép đọc thông tin đơn hàng qua API Server (Service Role)
create policy "Allow public read paid orders"
  on public.orders
  for select
  using (true);

-- ============================================================================
-- SUPABASE STORAGE: BUCKET "gift-photos" (LƯU ẢNH KỶ NIỆM TỰ ĐỘNG)
-- ============================================================================
-- 1. Tạo bucket công khai 'gift-photos' nếu chưa có
insert into storage.buckets (id, name, public)
values ('gift-photos', 'gift-photos', true)
on conflict (id) do nothing;

-- 2. Cho phép mọi người đọc ảnh công khai từ bucket 'gift-photos'
create policy "Public Access Gift Photos"
  on storage.objects
  for select
  using (bucket_id = 'gift-photos');

-- 3. Cho phép server / service role tải ảnh lên
create policy "Allow Upload Gift Photos"
  on storage.objects
  for insert
  with check (bucket_id = 'gift-photos');


