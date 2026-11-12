# Tiêu Chuẩn Thiết Kế & Phát Triển Template Mới

Tài liệu quy chuẩn bắt buộc áp dụng cho mọi template quà tặng cá nhân hóa trong dự án (`templates/<category>/<template-name>/index.html`) nhằm đảm bảo giao diện tinh gọn, trải nghiệm mượt trên cả **PC** và **Điện thoại**, nội dung tự nhiên cho mọi đối tượng người dùng.

---

## 1. Bố Trí Vị Trí Button & Hiển Thị Text Trên PC vs Điện Thoại

### 1.1. Cụm HUD Góc Trên Bên Phải (`.top-right-group`)
- **Trên PC (`> 768px`)**:
  - Sắp xếp **theo chiều ngang** (`flex-direction: row; align-items: center; gap: 8px;`).
  - Hiển thị đầy đủ **icon + text** ngắn gọn (ví dụ: `🔄 Xem Lại`, `🔊 Âm Thanh`).
- **Trên Điện Thoại (`<= 768px`)**:
  - `.top-hud` căn trên (`align-items: flex-start;`) để cụm trái không bị trôi xuống giữa.
  - `.top-right-group` bắt buộc sắp **theo chiều dọc** (`flex-direction: column; align-items: flex-end; gap: 6px;`).
  - Các nút chức năng phụ bên phải (**Loa / Âm thanh**, **Xem lại / Refresh**, chuyển chế độ phụ) **chỉ hiển thị icon**, **ẩn toàn bộ text nhãn** (`.hud-btn-label { display: none; }`) với kích thước nút tròn/vuông gọn (`width: 38px; height: 38px; padding: 0; justify-content: center;`) để không che mất sân khấu chính.
  - Mọi pill thông báo phụ (ví dụ: nút gợi ý bật âm thanh) phải tính `top` đủ thấp để không đè lên hàng nút xếp dọc.

### 1.2. Cụm Dock Ở Dưới & Hướng Dẫn Tương Tác
- Nút chính ở dưới (`.bottom-dock`) dùng pill kính mờ độ tương phản cao (`--glass-bg` tối + viền sáng) để luôn đọc rõ ngay cả khi nền dưới là tuyết trắng hoặc hiệu ứng sáng.
- Các dòng gợi ý tương tác (nếu có) đặt **phía trên** `.bottom-dock`, căn khoảng cách an toàn trên cả PC và Mobile, **tuyệt đối không để đè lên nút bấm**.

---

## 2. Lược Bỏ Text Không Cần Thiết (Đặc Biệt Trên Điện Thoại)

- **Nút chuyển ảnh / điều hướng slide trong Gallery**:
  - **Chỉ hiện mũi tên** (`‹` / `›` hoặc icon mũi tên), **không hiện text** `"Ảnh Trước"`, `"Ảnh Sau"`.
  - Vẫn gắn `aria-label` và `title` đầy đủ cho accessibility/hover trên PC.
- **Bộ đếm & nhãn form**:
  - Bộ đếm ảnh giữ ngắn gọn (`Ảnh 1 / 6`), tránh chèn câu hướng dẫn dài dòng lặp lại (`Vuốt ngang...`, `Tối đa 8 ảnh` khi đã có `6/8 ảnh`).
  - Nhãn input đặt súc tích: `Tên của bạn`, `Tên người ấy` — **không kèm ngoặc giải thích** `(Người gửi)`, `(Người nhận)`.
- **Ưu tiên trải nghiệm trực quan**:
  - Giảm tối đa chữ thừa trên màn hình chính, nhất là màn hình dọc điện thoại (`<= 768px`), giữ vùng trung tâm rộng rãi cho hiệu ứng 3D/Canvas/hình ảnh kỷ niệm.
  - Hỗ trợ vuốt trái/phải đổi ảnh mượt trên điện thoại (gắn `touch-action: none` trên vùng canvas/stage khi xử lý pointer/swipe riêng để trình duyệt không cướp cử chỉ cuộn).

---

## 3. Nội Dung Tâm Thư, Lời Chúc & Nhãn Trung Tính 100%

Toàn bộ văn bản mặc định trong template phải dùng **danh xưng trung tính, tự nhiên**, phù hợp cho mọi trường hợp (nữ gửi nam, nam gửi nữ, bạn bè, người thân):

- **Không dùng cứng `anh` / `em`** trong:
  - Tiêu đề & chữ ký tâm thư (Chuẩn: `"Gửi [Tên người ấy] Yêu Thương"`, chữ ký: `"Thương gửi, [Tên bạn] ♥"`).
  - Kho lời chúc mẫu & hàm `generateAiWish(...)` theo từng dịp kỷ niệm.
  - Câu mô tả mặc định trên ảnh mẫu hoặc các badge tiêu đề.
- **Cách viết tự nhiên thay thế**:
  - Dùng `[Tên người nhận]`, `bạn`, `mình`, `chúng ta`, `hai đứa`, hoặc viết không lộ ngôi (`Chúc ... một mùa Giáng Sinh an lành...`, `Cảm ơn vì đã luôn đồng hành...`).
- **Quy tắc kỹ thuật khi xử lý chuỗi lời chúc**:
  - Tuyệt đối không dùng `.replace(/em/g, ...)` hay regex ngắn tương tự làm hỏng các từ tiếng Việt (`xem`, `đêm`, `thêm`, `kỷ niệm`...). Nếu có template placeholder, dùng token rõ ràng như `{{receiver}}`, `{{sender}}`.
- **Font chữ & tự co giãn**:
  - Tên người nhận hiển thị trên Canvas/3D ưu tiên font mềm mại hỗ trợ tốt tiếng Việt (`Dancing Script`, kết hợp `Cinzel` / `Plus Jakarta Sans`), luôn có vòng lặp tự giảm `fontSize` theo `measureText(...).width` để tên dài không bị cắt mép.

---

## 4. Quy Chuẩn Kỹ Thuật Chung Khi Đăng Ký & Thanh Toán Template

1. **Dropdown `<select>` trên giao diện tối**: Luôn khai báo `color-scheme: dark;` và đặt `option { background: #0f172a; color: #f8fafc; }` để không bị chữ trắng trên nền trắng khi mở dropdown trên PC Windows/Chrome.
2. **Đăng ký vào `templates-catalog.js`**:
   - Khai báo đầy đủ trong mảng danh mục tương ứng (`templates-catalog.js`) với `id` trùng khớp tuyệt đối với `appState.templateId` trong file `index.html` của template để API `/api/create-order` áp đúng mức giá trên server.
3. **API Thanh toán & Tra cứu đơn**:
   - Đọc mã ảnh QR thanh toán từ `data.qrUrl` (khớp với output của `api/create-order.js`).
   - Hỗ trợ query `?id=<ORDER_CODE>` gọi `/api/check-order?code=...` để nạp tên, dịp, tâm thư, danh sách ảnh đã lưu và ẩn các nút dành riêng cho người tạo (`.creator-only`).
4. **Kiểm tra trước khi đẩy code**:
   - Kiểm tra cú pháp JavaScript (`new Function`) và kiểm tra `templates-catalog.js` load thành công qua Node trước khi commit/push.
