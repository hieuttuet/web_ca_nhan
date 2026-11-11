/**
 * CENTRAL REGISTRY: DANH MỤC SỰ KIỆN & TEMPLATE QUÀ TẶNG CÁ NHÂN HÓA
 * Cấu trúc tách biệt theo từng Sự kiện (Category), mỗi sự kiện hỗ trợ mở rộng 6 - 10+ bộ Template độc lập.
 *
 * Cấu trúc thư mục phát triển từng bộ Template:
 * - templates/confess/<ten-bo-template>/index.html
 * - templates/anniversary/<ten-bo-template>/index.html
 * - templates/birthday/<ten-bo-template>/index.html
 * - templates/valentine/<ten-bo-template>/index.html
 * - templates/women/<ten-bo-template>/index.html
 * - templates/holiday/<ten-bo-template>/index.html
 */

const EVENT_CATEGORIES = [
  { id: 'hot', name: 'Mẫu Hot Trend', icon: '🔥', isHighlight: true },
  { id: 'all', name: 'Tất Cả Mẫu', icon: '✨' },
  { id: 'confess', name: 'Tỏ Tình', icon: '💘' },
  { id: 'anniversary', name: 'Kỷ Niệm Yêu', icon: '💑' },
  { id: 'birthday', name: 'Sinh Nhật', icon: '🎂' },
  { id: 'valentine', name: 'Valentine 14/2', icon: '🌹' },
  { id: 'women', name: '8/3 & 20/10', icon: '🌸' },
  { id: 'holiday', name: 'Lễ Tết & Noel', icon: '🧧' }
];

// ============================================================================
// 1. SỰ KIỆN TỎ TÌNH (CONFESS) -> Thư mục: templates/confess/
// ============================================================================
const CONFESS_TEMPLATES = [
  {
    id: 'galaxy_love_3d',
    category: 'confess',
    isHot: true,
    salesCount: '1.8k+ đã tạo',
    title: 'Dải Ngân Hà Kỷ Niệm 3D',
    subtitle: '16.000 vì sao xoắn ốc 3D bay quanh trái tim pha lê & khung ảnh Polaroid',
    badge: '🔥 Best Seller TikTok',
    price: 39000,
    oldPrice: 69000,
    engineUrl: 'templates/confess/galaxy-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #2e0854 0%, #9d174d 55%, #ff2a85 100%)',
    previewEmoji: '🪐',
    features: ['Ghép tới 8 ảnh 3D', 'Xoay 360° tương tác', 'Tâm thư + Nhạc nền'],
    preset: {
      occasion: 'Lời Tỏ Tình Từ Trái Tim',
      defaultShape: 'galaxy',
      theme: 'pink',
      melody: 'romance'
    }
  },
  {
    id: 'fireworks_confess',
    category: 'confess',
    isHot: true,
    salesCount: '3.4k+ đã tạo',
    title: 'Pháo Hoa Chốt Hạ: Làm Người Yêu Anh Nhé?',
    subtitle: 'Tên lửa bắn lên trời đêm nổ tung hàng ngàn hạt sáng và hội tụ thành câu tỏ tình "Làm người yêu anh nhé [Tên]?"',
    badge: '⚡ Pháo Hoa Chốt Hạ',
    price: 19000,
    oldPrice: 39000,
    engineUrl: 'templates/confess/fireworks/index.html',
    previewGradient: 'linear-gradient(135deg, #090418 0%, #4c1d95 55%, #ec4899 100%)',
    previewEmoji: '🎆',
    features: ['Tụ hạt "Làm người yêu anh nhé"', 'Âm thanh nổ + Nhạc nền Fade-in', 'Hiệu ứng lấp lánh 60fps'],
    preset: {
      occasion: 'Lời Tỏ Tình Dưới Pháo Hoa',
      theme: 'pink'
    }
  },
  {
    id: 'heart_universe_3d',
    category: 'confess',
    isHot: true,
    salesCount: '1.5k+ đã tạo',
    title: 'Trái Tim Hạt Ánh Sáng 3D',
    subtitle: 'Hàng vạn hạt tinh vân tụ lại thành Trái Tim 3D khổng lồ đập nhịp nhàng giữa vũ trụ',
    badge: '💖 Siêu Lãng Mạn',
    price: 35000,
    oldPrice: 59000,
    engineUrl: 'templates/confess/galaxy-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #4a0424 0%, #be185d 50%, #fb7185 100%)',
    previewEmoji: '💖',
    features: ['Trái tim hạt 3D', 'Tải 8 ảnh kỷ niệm', 'Bắn pháo hoa 3D'],
    preset: {
      occasion: 'Trái Tim Này Dành Trọn Cho Em',
      defaultShape: 'heart',
      theme: 'pink',
      melody: 'canon'
    }
  }
];

// ============================================================================
// 2. SỰ KIỆN KỶ NIỆM YÊU (ANNIVERSARY) -> Thư mục: templates/anniversary/
// ============================================================================
const ANNIVERSARY_TEMPLATES = [
  {
    id: 'ring_anniversary_3d',
    category: 'anniversary',
    isHot: true,
    salesCount: '920+ đã tạo',
    title: 'Vòng Nhẫn Tinh Vân Đôi & Đếm Ngày Yêu',
    subtitle: 'Hai vòng nhẫn ánh sao đan vào nhau kèm bộ đếm số ngày bên nhau & album ảnh bay 3D',
    badge: '💍 Kỷ Niệm Ngày Yêu',
    price: 39000,
    oldPrice: 65000,
    engineUrl: 'templates/confess/galaxy-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #1e1b4b 0%, #6d28d9 55%, #c084fc 100%)',
    previewEmoji: '💍',
    features: ['Đếm số ngày yêu', '8 ảnh Polaroid 3D', 'Thiệp QR lưu máy'],
    preset: {
      occasion: 'Kỷ Niệm Tình Yêu • Mãi Bên Nhau',
      defaultShape: 'ring',
      theme: 'purple',
      melody: 'canon'
    }
  },
  {
    id: 'crystal_memory_3d',
    category: 'anniversary',
    salesCount: '640+ đã tạo',
    title: 'Quả Cầu Pha Lê Kỷ Niệm 3D',
    subtitle: 'Quả cầu ánh sáng lấp lánh bao bọc những bức ảnh kỷ niệm đẹp nhất của hai đứa',
    badge: '🔮 Độc Đáo',
    price: 35000,
    oldPrice: 55000,
    engineUrl: 'templates/confess/galaxy-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #082f49 0%, #0284c7 55%, #38bdf8 100%)',
    previewEmoji: '🔮',
    features: ['Quả cầu sao 3D', 'Bay điện ảnh tự động', 'Tâm thư bí mật'],
    preset: {
      occasion: 'Hành Trình Hạnh Phúc Của Chúng Mình',
      defaultShape: 'sphere',
      theme: 'blue',
      melody: 'romance'
    }
  }
];

// ============================================================================
// 3. SỰ KIỆN SINH NHẬT (BIRTHDAY) -> Thư mục: templates/birthday/
// ============================================================================
const BIRTHDAY_TEMPLATES = [
  {
    id: 'birthday_cake_interactive',
    category: 'birthday',
    isHot: true,
    salesCount: '2.1k+ đã tạo',
    title: 'Bánh Sinh Nhật Thổi Nến & Pháo Hoa',
    subtitle: 'Thổi vào micro hoặc chạm để tắt nến ước nguyện, bầu trời lập tức bắn pháo hoa ghép tên!',
    badge: '🎂 Hot Sinh Nhật',
    price: 29000,
    oldPrice: 49000,
    engineUrl: 'templates/birthday/birthday-cake/index.html',
    previewGradient: 'linear-gradient(135deg, #3b0764 0%, #db2777 55%, #fbbf24 100%)',
    previewEmoji: '🎂',
    features: ['Thổi nến qua Micro/Chạm', 'Nổ pháo hoa ghép tên', 'Nhạc Happy Birthday'],
    preset: {
      occasion: 'Happy Birthday • Chúc Mừng Sinh Nhật'
    }
  },
  {
    id: 'birthday_galaxy_3d',
    category: 'birthday',
    salesCount: '780+ đã tạo',
    title: 'Vũ Trụ Tuổi Mới Hoàng Kim 3D',
    subtitle: 'Dải ngân hà ánh vàng hoàng kim lưu giữ những bức ảnh rực rỡ nhất mừng tuổi mới',
    badge: '✨ Sang Trọng',
    price: 39000,
    oldPrice: 65000,
    engineUrl: 'templates/confess/galaxy-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #422006 0%, #b45309 55%, #fde047 100%)',
    previewEmoji: '👑',
    features: ['Tinh vân Vàng Gold', 'Giai điệu Sinh Nhật', '8 khung ảnh 3D'],
    preset: {
      occasion: 'Happy Birthday • Tuổi Mới Rực Rỡ',
      defaultShape: 'galaxy',
      theme: 'gold',
      melody: 'birthday'
    }
  }
];

// ============================================================================
// 4. SỰ KIỆN VALENTINE 14/2 (VALENTINE) -> Thư mục: templates/valentine/
// ============================================================================
const VALENTINE_TEMPLATES = [
  {
    id: 'valentine_heart_3d',
    category: 'valentine',
    salesCount: '1.1k+ đã tạo',
    title: 'Vũ Trụ Valentine Ngọt Ngào 3D',
    subtitle: 'Không gian 3D sắc hồng tình nhân kết hợp trái tim pha lê và bộ sưu tập ảnh đôi',
    badge: '🌹 14/2 Đặc Biệt',
    price: 39000,
    oldPrice: 69000,
    engineUrl: 'templates/confess/galaxy-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #500724 0%, #be123c 55%, #fb7185 100%)',
    previewEmoji: '🌹',
    features: ['Trái tim 3D phát sáng', 'Tải 8 ảnh cặp đôi', 'AI gợi ý thư tình'],
    preset: {
      occasion: 'Happy Valentine’s Day 14/2',
      defaultShape: 'heart',
      theme: 'pink',
      melody: 'romance'
    }
  }
];

// ============================================================================
// 5. SỰ KIỆN NGÀY PHỤ NỮ 8/3 & 20/10 (WOMEN) -> Thư mục: templates/women/
// ============================================================================
const WOMEN_TEMPLATES = [
  {
    id: 'women_day_galaxy_3d',
    category: 'women',
    salesCount: '890+ đã tạo',
    title: 'Tinh Vân Hoa Hồng 8/3 & 20/10 3D',
    subtitle: 'Món quà công nghệ 3D bất ngờ dành tặng Mẹ, Vợ, Người yêu nhân ngày 8/3 và 20/10',
    badge: '🌸 Quà Phái Đẹp',
    price: 35000,
    oldPrice: 59000,
    engineUrl: 'templates/confess/galaxy-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #4a044e 0%, #a21caf 55%, #f472b6 100%)',
    previewEmoji: '🌸',
    features: ['Tặng Người yêu / Vợ / Mẹ', 'Tải 8 ảnh kỷ niệm', 'Xuất Thiệp QR in ấn'],
    preset: {
      occasion: 'Chúc Mừng Ngày Phụ Nữ 8/3 & 20/10',
      defaultShape: 'galaxy',
      theme: 'pink',
      melody: 'canon'
    }
  }
];

// ============================================================================
// 6. SỰ KIỆN LỄ TẾT & GIÁNG SINH (HOLIDAY) -> Thư mục: templates/holiday/
// ============================================================================
const HOLIDAY_TEMPLATES = [
  {
    id: 'christmas_tree_3d',
    category: 'holiday',
    isHot: true,
    salesCount: '2.8k+ đã tạo',
    title: 'Cây Thông Noel 3D Hoàng Gia & Cử Chỉ Tay',
    subtitle: 'Cây thông 3D đính album ảnh, tuyết rơi lãng mạn, biến hình Trái Tim và hỗ trợ điều khiển cử chỉ tay AI',
    badge: '🎄 Hot Giáng Sinh',
    price: 39000,
    oldPrice: 69000,
    engineUrl: 'templates/holiday/christmas-tree-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #051923 0%, #003554 50%, #d4af37 100%)',
    previewEmoji: '🎄',
    features: ['Cây thông tuyết rơi 3D', 'Điều khiển cử chỉ tay AI', 'Tải 8 ảnh + Thiệp QR Noel'],
    preset: {
      occasion: 'Merry Christmas & Happy New Year'
    }
  },
  {
    id: 'holiday_fireworks',
    category: 'holiday',
    salesCount: '1.4k+ đã tạo',
    title: 'Pháo Hoa Giao Thừa & Lời Chúc Lễ Tết',
    subtitle: 'Bắn pháo hoa rực rỡ ghép tên người nhận và lời chúc Giáng Sinh / Năm Mới An Khang',
    badge: '🧧 Lễ Tết / Noel',
    price: 25000,
    oldPrice: 45000,
    engineUrl: 'templates/confess/fireworks/index.html',
    previewGradient: 'linear-gradient(135deg, #450a0a 0%, #b91c1c 55%, #f59e0b 100%)',
    previewEmoji: '🧧',
    features: ['Pháo hoa ghép chữ', 'Hạt sáng Hoàng Kim', 'Giá siêu hạt dẻ'],
    preset: {
      occasion: 'Chúc Mừng Năm Mới & Giáng Sinh An Lành',
      theme: 'gold'
    }
  }
];

// Gộp tất cả bộ Template từ 6 Sự kiện vào Danh mục Tổng (TEMPLATES_CATALOG)
const TEMPLATES_CATALOG = [
  ...CONFESS_TEMPLATES,
  ...ANNIVERSARY_TEMPLATES,
  ...BIRTHDAY_TEMPLATES,
  ...VALENTINE_TEMPLATES,
  ...WOMEN_TEMPLATES,
  ...HOLIDAY_TEMPLATES
];

const TEMPLATES_BY_CATEGORY = {
  confess: CONFESS_TEMPLATES,
  anniversary: ANNIVERSARY_TEMPLATES,
  birthday: BIRTHDAY_TEMPLATES,
  valentine: VALENTINE_TEMPLATES,
  women: WOMEN_TEMPLATES,
  holiday: HOLIDAY_TEMPLATES
};

if (typeof window !== 'undefined') {
  window.EVENT_CATEGORIES = EVENT_CATEGORIES;
  window.TEMPLATES_CATALOG = TEMPLATES_CATALOG;
  window.TEMPLATES_BY_CATEGORY = TEMPLATES_BY_CATEGORY;
}
if (typeof globalThis !== 'undefined') {
  globalThis.EVENT_CATEGORIES = EVENT_CATEGORIES;
  globalThis.TEMPLATES_CATALOG = TEMPLATES_CATALOG;
  globalThis.TEMPLATES_BY_CATEGORY = TEMPLATES_BY_CATEGORY;
}
