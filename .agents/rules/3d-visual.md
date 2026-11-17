---
trigger: glob
globs: "templates/**/*.html, templates/**/*.js"
---

# Quy Chuẩn Đồ Họa 3D & Hiệu Ứng Thị Giác Toàn Dự Án (`3d-visual.md`)

Tài liệu này quy định chuẩn kỹ thuật đồ họa 2D/3D, ánh sáng, chuyển động, âm thanh và trải nghiệm người dùng cho toàn bộ các template trong dự án **Web Cá Nhân Hóa**, được đúc kết từ 2 mẫu chuẩn:
- **Chuẩn Three.js 3D & Tương tác**: `templates/holiday/christmas-tree-3d/index.html` (*Cây Thông Noel 3D Hoàng Gia & Cử Chỉ Tay*)
- **Chuẩn Canvas Hiệu Ứng Ánh Sáng & Vật Lý**: `templates/holiday/tet-fireworks/index.html` (*Pháo Hoa Giao Thừa & Countdown Tết 2027*)

---

## 1. Kiến Trúc & Ngăn Xếp Công Nghệ
- **100% Vanilla HTML/CSS/JS**: Không sử dụng bundler (Vite/Webpack) hay framework SPA. Mỗi template là một file `index.html` độc lập, chạy trực tiếp trên trình duyệt.
- **3D Engine**: Sử dụng **Three.js (`r128`)** qua CDN (`https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`).
- **2D / Hiệu ứng ánh sáng cao tốc**: Sử dụng **Dual-Canvas Stage** (`trails-canvas` + `main-canvas`) cho các hiệu ứng hạt/tia sáng có đuôi chuyển động mượt.
- **AI / Cảm biến (tùy chọn)**: `@mediapipe/hands` cho điều khiển cử chỉ tay hoặc `DeviceMotionEvent` / `DeviceOrientationEvent` cho lắc và nghiêng điện thoại.

---

## 2. Chuẩn Render, Camera & Hiệu Năng
1. **WebGLRenderer chuẩn**:
   ```js
   const renderer = new THREE.WebGLRenderer({
     canvas,
     antialias: true,
     alpha: true,
     powerPreference: 'high-performance'
   });
   renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
   renderer.outputEncoding = THREE.sRGBEncoding;
   ```
   - Giới hạn `devicePixelRatio` tối đa `2` ở cả Three.js và 2D Canvas để tránh tụt FPS trên màn hình Retina/4K.
2. **Responsive Camera cho Mobile & Desktop**:
   - Luôn tách thông số vị trí/tỷ lệ theo tỷ lệ khung hình (`isMobile = window.innerWidth < 768` hoặc `aspect < 0.8`).
   - Trên màn hình dọc điện thoại, tự động lùi `camera.position.z` hoặc thu gọn `scale` của cụm 3D chính để không bị cắt mép trái/phải.
   - Bắt sự kiện `resize` để cập nhật `camera.aspect`, `camera.updateProjectionMatrix()`, `renderer.setSize(...)` và kích thước `WebGLRenderTarget` (nếu có).
3. **Vòng lặp Animation (`deltaTime`)**:
   - Dùng `THREE.Clock()` với `const dt = Math.min(clock.getDelta(), 0.05)` để vật lý không bị nhảy cóc khi chuyển tab.

---

## 3. Chuẩn Ánh Sáng, Màu Sắc & Độ Tương Phản
Áp dụng mô hình **3-Point Lighting + Tương phản Nóng/Lạnh** như mẫu *Cây Thông Noel 3D Hoàng Gia*:
1. **Hệ thống đèn 3D**:
   - `AmbientLight` cường độ vừa (`0.6 – 0.75`) để giữ độ sâu vùng tối, không làm phẳng khối.
   - `PointLight` ấm ở tâm/chủ thể (`0xffaa00` / `0xff9e2c`) tạo hào quang ấm áp.
   - `SpotLight` hoặc `DirectionalLight` phụ màu lạnh tương phản (`0x38bdf8` / `0x93c5fd`) đánh từ góc chéo ngược để tách viền vật thể khỏi nền tối.
2. **Màu sắc & Tone Mapping**:
   - Texture vẽ trên `<canvas>` hoặc SVG phải gán `tex.encoding = THREE.sRGBEncoding` (Three.js r128).
   - Với các bề mặt cần giữ nguyên độ rực của chữ/họa tiết (nhãn hộp quà, con dấu, văn bản 3D), ưu tiên đặt `toneMapped: false` hoặc dùng màu nền đậm sâu để tránh bị rửa trôi thành màu nhạt.
3. **Bối cảnh Nền Đêm Sâu**:
   - Nền sử dụng `radial-gradient` tối sâu (đỏ rượu vang `#2b060a -> #090204`, xanh đêm `#071326 -> #030614`, hoặc nâu gỗ ấm `#2b130d -> #090404`) làm nổi bật tối đa các hạt phát sáng 3D.

---

## 4. Chuẩn Hệ Thống Hạt, Biến Hình (Morphing) & Vệt Sáng
1. **Hệ thống hạt 3D (`THREE.Points` + `BufferGeometry`)** *(chuẩn `christmas-tree-3d`)*:
   - Phân lớp hạt theo vai trò (hạt chính, hạt điểm nhấn, bụi lấp lánh nền, tuyết/hoa rơi).
   - Mỗi `BufferGeometry` lưu sẵn nhiều mảng tọa độ đích trong `geo.userData` (ví dụ: `tree`, `explode`, `heart`, hoặc tọa độ lấy mẫu từ chữ `canvas.getImageData`) để nội suy (`lerp`) chuyển hình mượt mà.
   - Vật liệu hạt phát sáng luôn bật:
     ```js
     blending: THREE.AdditiveBlending,
     depthWrite: false,
     sizeAttenuation: true
     ```
2. **Hiệu ứng vệt sáng & tàn lửa 2D (`Dual-Canvas`)** *(chuẩn `tet-fireworks`)*:
   - Lớp `trails-canvas` dùng `globalCompositeOperation = 'source-over'` phủ lớp `rgba(0, 0, 0, 0.175 * speed)` mỗi frame để tạo đuôi sáng mờ dần tự nhiên, sau đó chuyển sang `globalCompositeOperation = 'lighten'` để vẽ tia sáng (`prevX/prevY -> x/y`) và tâm nổ `createRadialGradient`.
   - Lớp `main-canvas` vẽ các chi tiết sắc nét không cần lưu vệt.
3. **Thủy tinh & Hiệu ứng Khúc xạ (Shader)**:
   - Với vật thể kính/pha lê (quả cầu tuyết, lăng kính), ưu tiên dùng **GLSL `ShaderMaterial` 2-pass** với `WebGLRenderTarget` (`refract(-V, N, ior)`) + viền Fresnel + phản chiếu specular động từ các nguồn sáng xung quanh.

---

## 5. Chuẩn Texture & Vật Liệu Thủ Công
- **Ưu tiên Procedural Texture**: Tạo sprite ánh sáng, vân gỗ, đồng xu, con dấu, tem thư, bảng đồng... trực tiếp bằng **Offscreen `<canvas>`** hoặc **SVG DataURL** (`svgToTexture`) để tải tức thì, sắc nét ở mọi độ phân giải và không lỗi CORS.
- **Ảnh người dùng upload**:
  - Luôn nén/resize client-side trước khi lưu (`maxSide = 720–900px`, JPEG `0.8`), hỗ trợ gắn trực tiếp lên khung ảnh 3D (`PlaneGeometry` + `CanvasTexture` crop tỷ lệ `cover`) và xem trong Album kỷ niệm.

---

## 6. Chuẩn Tương Tác & Âm Thanh Đa Tầng
1. **Tương tác đa phương thức**:
   - Dùng `THREE.Raycaster` phân biệt rõ **kéo xoay/zoom 3D** (`dragDist > 4–8px`) và **chạm mở quà / kích hoạt phép thuật** (`dragDist <= 4–8px`).
   - Hỗ trợ **cảm biến lắc & nghiêng điện thoại** (`devicemotion`, `deviceorientation`, có gọi `requestPermission()` cho iOS khi người dùng chạm lần đầu).
2. **Âm thanh Web Audio API thuần**:
   - Không phụ thuộc file `.mp3` ngoài dễ lỗi link; tổng hợp âm thanh theo tầng bằng `AudioContext` (gió/nền ➔ chuông/rít ➔ tiếng "keng"/nổ ➔ giai điệu Lofi/Nhạc xuân nhẹ) và luôn có nút bật/tắt **🔊 / 🔇 Âm Thanh** ở góc trên phải.

---

## 7. Chuẩn Giao Diện HUD & Thanh Toán / QR
- **HUD Tối Giản (Glassmorphism)**:
  - Trên cùng: `← Trang chủ` (trái), các nút phụ như `🔄 Xem Lại`, `🔊 Âm Thanh` (phải).
  - Dưới cùng: `.bottom-dock` giữ các nút chính trên **1 hàng ngang** (`flex-wrap: nowrap`) ngay cả trên điện thoại nhỏ (`<= 520px`).
  - Khi mở kết quả 3D (ví dụ: thẻ quẻ, vật phẩm quay), không dùng nền tối che mất 3D; tách 2 bên trên desktop (3D trái – thẻ thông tin phải) hoặc trên/dưới trên mobile.
- **Luồng Tạo Link & Thiệp QR chuẩn**:
  - Gửi đơn qua `/api/create-order`, kiểm tra qua `/api/check-order`, lưu đơn chờ vào `localStorage`/`sessionStorage`, tải ảnh QR qua `/api/download-qr` + raster PNG, và xuất **Thiệp QR Canvas (`600x780`)** sau khi thanh toán thành công.
# Quy Chuẩn Đồ Họa 3D & Hiệu Ứng Thị Giác Toàn Dự Án (`3d-visual.md`)

Tài liệu này quy định chuẩn kỹ thuật đồ họa 2D/3D, ánh sáng, chuyển động, âm thanh và trải nghiệm người dùng cho toàn bộ các template trong dự án **Web Cá Nhân Hóa**, được đúc kết từ 2 mẫu chuẩn:
- **Chuẩn Three.js 3D & Tương tác**: `templates/holiday/christmas-tree-3d/index.html` (*Cây Thông Noel 3D Hoàng Gia & Cử Chỉ Tay*)
- **Chuẩn Canvas Hiệu Ứng Ánh Sáng & Vật Lý**: `templates/holiday/tet-fireworks/index.html` (*Pháo Hoa Giao Thừa & Countdown Tết 2027*)

---

## 1. Kiến Trúc & Ngăn Xếp Công Nghệ
- **100% Vanilla HTML/CSS/JS**: Không sử dụng bundler (Vite/Webpack) hay framework SPA. Mỗi template là một file `index.html` độc lập, chạy trực tiếp trên trình duyệt.
- **3D Engine**: Sử dụng **Three.js (`r128`)** qua CDN (`https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`).
- **2D / Hiệu ứng ánh sáng cao tốc**: Sử dụng **Dual-Canvas Stage** (`trails-canvas` + `main-canvas`) cho các hiệu ứng hạt/tia sáng có đuôi chuyển động mượt.
- **AI / Cảm biến (tùy chọn)**: `@mediapipe/hands` cho điều khiển cử chỉ tay hoặc `DeviceMotionEvent` / `DeviceOrientationEvent` cho lắc và nghiêng điện thoại.

---

## 2. Chuẩn Render, Camera & Hiệu Năng
1. **WebGLRenderer chuẩn**:
   ```js
   const renderer = new THREE.WebGLRenderer({
     canvas,
     antialias: true,
     alpha: true,
     powerPreference: 'high-performance'
   });
   renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
   renderer.outputEncoding = THREE.sRGBEncoding;
   ```
   - Giới hạn `devicePixelRatio` tối đa `2` ở cả Three.js và 2D Canvas để tránh tụt FPS trên màn hình Retina/4K.
2. **Responsive Camera cho Mobile & Desktop**:
   - Luôn tách thông số vị trí/tỷ lệ theo tỷ lệ khung hình (`isMobile = window.innerWidth < 768` hoặc `aspect < 0.8`).
   - Trên màn hình dọc điện thoại, tự động lùi `camera.position.z` hoặc thu gọn `scale` của cụm 3D chính để không bị cắt mép trái/phải.
   - Bắt sự kiện `resize` để cập nhật `camera.aspect`, `camera.updateProjectionMatrix()`, `renderer.setSize(...)` và kích thước `WebGLRenderTarget` (nếu có).
3. **Vòng lặp Animation (`deltaTime`)**:
   - Dùng `THREE.Clock()` với `const dt = Math.min(clock.getDelta(), 0.05)` để vật lý không bị nhảy cóc khi chuyển tab.

---

## 3. Chuẩn Ánh Sáng, Màu Sắc & Độ Tương Phản
Áp dụng mô hình **3-Point Lighting + Tương phản Nóng/Lạnh** như mẫu *Cây Thông Noel 3D Hoàng Gia*:
1. **Hệ thống đèn 3D**:
   - `AmbientLight` cường độ vừa (`0.6 – 0.75`) để giữ độ sâu vùng tối, không làm phẳng khối.
   - `PointLight` ấm ở tâm/chủ thể (`0xffaa00` / `0xff9e2c`) tạo hào quang ấm áp.
   - `SpotLight` hoặc `DirectionalLight` phụ màu lạnh tương phản (`0x38bdf8` / `0x93c5fd`) đánh từ góc chéo ngược để tách viền vật thể khỏi nền tối.
2. **Màu sắc & Tone Mapping**:
   - Texture vẽ trên `<canvas>` hoặc SVG phải gán `tex.encoding = THREE.sRGBEncoding` (Three.js r128).
   - Với các bề mặt cần giữ nguyên độ rực của chữ/họa tiết (nhãn hộp quà, con dấu, văn bản 3D), ưu tiên đặt `toneMapped: false` hoặc dùng màu nền đậm sâu để tránh bị rửa trôi thành màu nhạt.
3. **Bối cảnh Nền Đêm Sâu**:
   - Nền sử dụng `radial-gradient` tối sâu (đỏ rượu vang `#2b060a -> #090204`, xanh đêm `#071326 -> #030614`, hoặc nâu gỗ ấm `#2b130d -> #090404`) làm nổi bật tối đa các hạt phát sáng 3D.

---

## 4. Chuẩn Hệ Thống Hạt, Biến Hình (Morphing) & Vệt Sáng
1. **Hệ thống hạt 3D (`THREE.Points` + `BufferGeometry`)** *(chuẩn `christmas-tree-3d`)*:
   - Phân lớp hạt theo vai trò (hạt chính, hạt điểm nhấn, bụi lấp lánh nền, tuyết/hoa rơi).
   - Mỗi `BufferGeometry` lưu sẵn nhiều mảng tọa độ đích trong `geo.userData` (ví dụ: `tree`, `explode`, `heart`, hoặc tọa độ lấy mẫu từ chữ `canvas.getImageData`) để nội suy (`lerp`) chuyển hình mượt mà.
   - Vật liệu hạt phát sáng luôn bật:
     ```js
     blending: THREE.AdditiveBlending,
     depthWrite: false,
     sizeAttenuation: true
     ```
2. **Hiệu ứng vệt sáng & tàn lửa 2D (`Dual-Canvas`)** *(chuẩn `tet-fireworks`)*:
   - Lớp `trails-canvas` dùng `globalCompositeOperation = 'source-over'` phủ lớp `rgba(0, 0, 0, 0.175 * speed)` mỗi frame để tạo đuôi sáng mờ dần tự nhiên, sau đó chuyển sang `globalCompositeOperation = 'lighten'` để vẽ tia sáng (`prevX/prevY -> x/y`) và tâm nổ `createRadialGradient`.
   - Lớp `main-canvas` vẽ các chi tiết sắc nét không cần lưu vệt.
3. **Thủy tinh & Hiệu ứng Khúc xạ (Shader)**:
   - Với vật thể kính/pha lê (quả cầu tuyết, lăng kính), ưu tiên dùng **GLSL `ShaderMaterial` 2-pass** với `WebGLRenderTarget` (`refract(-V, N, ior)`) + viền Fresnel + phản chiếu specular động từ các nguồn sáng xung quanh.

---

## 5. Chuẩn Texture & Vật Liệu Thủ Công
- **Ưu tiên Procedural Texture**: Tạo sprite ánh sáng, vân gỗ, đồng xu, con dấu, tem thư, bảng đồng... trực tiếp bằng **Offscreen `<canvas>`** hoặc **SVG DataURL** (`svgToTexture`) để tải tức thì, sắc nét ở mọi độ phân giải và không lỗi CORS.
- **Ảnh người dùng upload**:
  - Luôn nén/resize client-side trước khi lưu (`maxSide = 720–900px`, JPEG `0.8`), hỗ trợ gắn trực tiếp lên khung ảnh 3D (`PlaneGeometry` + `CanvasTexture` crop tỷ lệ `cover`) và xem trong Album kỷ niệm.

---

## 6. Chuẩn Tương Tác & Âm Thanh Đa Tầng
1. **Tương tác đa phương thức**:
   - Dùng `THREE.Raycaster` phân biệt rõ **kéo xoay/zoom 3D** (`dragDist > 4–8px`) và **chạm mở quà / kích hoạt phép thuật** (`dragDist <= 4–8px`).
   - Hỗ trợ **cảm biến lắc & nghiêng điện thoại** (`devicemotion`, `deviceorientation`, có gọi `requestPermission()` cho iOS khi người dùng chạm lần đầu).
2. **Âm thanh Web Audio API thuần**:
   - Không phụ thuộc file `.mp3` ngoài dễ lỗi link; tổng hợp âm thanh theo tầng bằng `AudioContext` (gió/nền ➔ chuông/rít ➔ tiếng "keng"/nổ ➔ giai điệu Lofi/Nhạc xuân nhẹ) và luôn có nút bật/tắt **🔊 / 🔇 Âm Thanh** ở góc trên phải.

---

## 7. Chuẩn Giao Diện HUD & Thanh Toán / QR
- **HUD Tối Giản (Glassmorphism)**:
  - Trên cùng: `← Trang chủ` (trái), các nút phụ như `🔄 Xem Lại`, `🔊 Âm Thanh` (phải).
  - Dưới cùng: `.bottom-dock` giữ các nút chính trên **1 hàng ngang** (`flex-wrap: nowrap`) ngay cả trên điện thoại nhỏ (`<= 520px`).
  - Khi mở kết quả 3D (ví dụ: thẻ quẻ, vật phẩm quay), không dùng nền tối che mất 3D; tách 2 bên trên desktop (3D trái – thẻ thông tin phải) hoặc trên/dưới trên mobile.
- **Luồng Tạo Link & Thiệp QR chuẩn**:
  - Gửi đơn qua `/api/create-order`, kiểm tra qua `/api/check-order`, lưu đơn chờ vào `localStorage`/`sessionStorage`, tải ảnh QR qua `/api/download-qr` + raster PNG, và xuất **Thiệp QR Canvas (`600x780`)** sau khi thanh toán thành công.
