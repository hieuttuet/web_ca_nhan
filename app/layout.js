export const metadata = {
  title: 'Món Quà 3D Cá Nhân Hóa • Gửi Trọn Yêu Thương',
  description: 'Thiết kế thiệp & không gian 3D cá nhân hóa độc bản cho Sinh Nhật, Tỏ Tình, Kỷ Niệm, Lễ Tết & Giáng Sinh.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body style={{ margin: 0, padding: 0, background: '#090406', color: '#fffbeb', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
