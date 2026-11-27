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
  { id: 'confess', name: 'Tỏ Tình', icon: '💘' },
  { id: 'anniversary', name: 'Kỷ Niệm Yêu', icon: '💑' },
  { id: 'birthday', name: 'Sinh Nhật', icon: '🎂' },
  { id: 'valentine', name: 'Valentine', icon: '🌹' },
  { id: 'women', name: '8/3 & 20/10', icon: '🌸' },
  { id: 'holiday', name: 'Lễ Tết & Noel', icon: '🧧' }
];

// ============================================================================
// 1. SỰ KIỆN TỎ TÌNH (CONFESS) -> Thư mục: templates/confess/
// ============================================================================
const CONFESS_TEMPLATES = [
  {
    id: 'fireworks_confess',
    category: 'confess',
    isHot: true,
    salesCount: '3.4k+ đã tạo',
    title: 'Pháo Hoa Chốt Hạ: Làm Người Yêu Anh Nhé?',
    subtitle: 'Bắn 5 lượt pháo hoa liên tiếp kể câu chuyện tình yêu, kết thúc bằng cú nổ chốt hạ siêu đại bác "Làm người yêu anh nhé [Tên]?"',
    badge: '⚡ 5 Hồi Pháo Hoa',
    price: 19000,
    oldPrice: 39000,
    engineUrl: 'templates/confess/fireworks/index.html',
    previewGradient: 'linear-gradient(135deg, #090418 0%, #4c1d95 55%, #ec4899 100%)',
    previewEmoji: '🎆',
    features: ['5 hồi pháo hoa liên tiếp', 'Cú nổ chốt hạ siêu đại bác', 'Chống lóa & 60fps mượt mà'],
    preset: {
      occasion: 'Lời Tỏ Tình Dưới Pháo Hoa',
      theme: 'pink'
    }
  }
];

// ============================================================================
// 2. SỰ KIỆN KỶ NIỆM YÊU (ANNIVERSARY) -> Thư mục: templates/anniversary/
// ============================================================================
const ANNIVERSARY_TEMPLATES = [
  {
    id: 'anniversary_star_hourglass_3d',
    category: 'anniversary',
    isHot: true,
    salesCount: 'Mới ra mắt',
    title: 'Đồng Hồ Cát Ánh Sáng 3D • Dòng Chảy Thời Gian',
    subtitle: 'Lật đồng hồ cát pha lê 3D dưới bầu trời sao & mặt hồ ánh trăng, đánh thức 4 quả cầu ký ức trước khi bụi sao xếp thành ngày kỷ niệm & khung ảnh 3D của hai bạn',
    badge: '⏳ Mẫu 3D Mới',
    price: 39000,
    oldPrice: 69000,
    engineUrl: 'templates/anniversary/star-hourglass-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #090418 0%, #9d174d 50%, #fbbf24 100%)',
    previewEmoji: '⏳',
    features: ['Đồng hồ cát pha lê GLSL Fresnel & Bụi sao 3D', '4 Quả cầu ký ức + Âm thanh cát chảy & Ballad 68 BPM', 'Morph 3.800 hạt thành Ngày Yêu & Khung ảnh 3D'],
    preset: {
      occasion: 'Kỷ Niệm Yêu • Đồng Hồ Cát Ánh Sáng 3D',
      theme: 'rose_gold'
    }
  },
  {
    id: 'anniversary_love_tree_3d',
    category: 'anniversary',
    isHot: true,
    salesCount: 'Mới ra mắt',
    title: 'Cây Tình Yêu 3D • Đâm Chồi Nảy Lộc',
    subtitle: 'Mầm cây ánh sáng 3D sinh trưởng đâm chồi nở hoa anh đào, treo 6 chiếc đèn lồng kỷ niệm phát sáng lung linh dưới ánh trăng cùng tiếng Piano êm ái',
    badge: '🏮 Mẫu 3D Mới',
    price: 39000,
    oldPrice: 69000,
    engineUrl: 'templates/anniversary/love-tree-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #090414 0%, #f43f5e 50%, #fde047 100%)',
    previewEmoji: '🏮',
    features: ['Cây hoa anh đào 3D nở hoa dưới ánh trăng', '6 Đèn lồng phát sáng lưu giữ kỷ niệm', 'Nhạc đệm Piano êm ái & Bảng tên đôi lứa 3D'],
    preset: {
      occasion: 'Kỷ Niệm Yêu • Cây Tình Yêu 3D',
      theme: 'emerald_gold'
    }
  },
  {
    id: 'anniversary_galaxy_flight',
    category: 'anniversary',
    isHot: true,
    salesCount: 'Mới ra mắt',
    title: 'Chuyến Bay Ngân Hà',
    subtitle: 'Dải Ngân Hà Kỷ Niệm • Khung ảnh Polaroid cặp đôi trôi lơ lửng, camera zoom chậm từng kỷ niệm & nhạc Lofi/Chillout',
    badge: '💑 Hot Kỷ Niệm Yêu',
    price: 39000,
    oldPrice: 69000,
    engineUrl: 'templates/anniversary/galaxy-flight-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #16082e 0%, #5b1462 50%, #f472b6 100%)',
    previewEmoji: '🌌',
    features: ['Khung ảnh Polaroid 3D zoom chậm', 'Nhạc Lofi / Chillout Web Audio', 'Bảng tên & Đếm ngày yêu 3D + QR'],
    preset: {
      occasion: 'Kỷ Niệm Yêu • Chuyến Bay Ngân Hà',
      theme: 'galaxy_rose',
      melody: 'lofi_stars'
    }
  },
  {
    id: 'galaxy_love_3d',
    category: 'anniversary',
    isHot: true,
    salesCount: '1.8k+ đã tạo',
    title: 'Dải Ngân Hà Kỷ Niệm 3D',
    subtitle: '16.000 vì sao xoắn ốc 3D bay quanh trái tim pha lê & khung ảnh Polaroid',
    badge: '🔥 Best Seller TikTok',
    price: 39000,
    oldPrice: 69000,
    engineUrl: 'templates/anniversary/galaxy-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #2e0854 0%, #9d174d 55%, #ff2a85 100%)',
    previewEmoji: '🪐',
    features: ['Ghép tới 8 ảnh 3D', 'Xoay 360° tương tác', 'Tâm thư + Nhạc nền'],
    preset: {
      occasion: 'Kỷ Niệm Yêu • Dải Ngân Hà Kỷ Niệm',
      defaultShape: 'galaxy',
      theme: 'pink',
      melody: 'romance'
    }
  }
];

// ============================================================================
// 3. SỰ KIỆN SINH NHẬT (BIRTHDAY) -> Thư mục: templates/birthday/
// ============================================================================
const BIRTHDAY_TEMPLATES = [
  {
    id: 'birthday_summer_balloons_3d',
    category: 'birthday',
    isHot: true,
    salesCount: 'Mới ra mắt',
    title: 'Bong Bóng Mùa Hè 3D • Kỷ Niệm Tuổi Mới',
    subtitle: 'Hàng chục quả bóng bay 3D phát sáng bay theo làn gió hè, chạm nổ giòn tan hé lộ album ảnh & quả bóng hoàng kim khổng lồ!',
    badge: '🎈 Mẫu 3D Mới',
    price: 29000,
    oldPrice: 49000,
    engineUrl: 'templates/birthday/summer-balloons-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 45%, #4a154b 100%)',
    previewEmoji: '🎈',
    features: ['Three.js 3D toàn diện', 'Chạm nổ bóng âm thanh POP!', 'Hé lộ 6 ảnh & bóng hoàng kim'],
    preset: {
      occasion: 'Happy Birthday • Bong Bóng Mùa Hè',
      theme: 'summer_glow'
    }
  },
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
  }
];

// ============================================================================
// 4. SỰ KIỆN VALENTINE 14/2 (VALENTINE) -> Thư mục: templates/valentine/
// ============================================================================
const VALENTINE_TEMPLATES = [
  {
    id: 'valentine_cupid_arrow_3d',
    category: 'valentine',
    isHot: true,
    salesCount: 'Mới ra mắt',
    title: 'Mũi Tên Cupid 3D • Nhịp Đập Trái Tim',
    subtitle: 'Kéo cung ánh sáng bắn mũi tên xé gió "Vút" ghim vào trái tim pha lê đập dồn dập, nứt ánh sáng vàng kim nở rộ tên đôi lứa & vòng cung ảnh 3D',
    badge: '💘 Hot Valentine 14/2',
    price: 39000,
    oldPrice: 69000,
    engineUrl: 'templates/valentine/cupid-arrow-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #2b0614 0%, #be123c 52%, #f43f5e 100%)',
    previewEmoji: '💘',
    features: ['Kéo cung & Bắn mũi tên 3D', 'Trái tim đập & nứt ánh sáng', 'Âm thanh Vút + Nhạc 14/2 + QR'],
    preset: {
      occasion: 'Happy Valentine’s Day 14/2',
      theme: 'ruby_valentine',
      melody: 'romance'
    }
  },
  {
    id: 'valentine_heart_3d',
    category: 'valentine',
    salesCount: '1.1k+ đã tạo',
    title: 'Vũ Trụ Valentine Ngọt Ngào 3D',
    subtitle: 'Không gian 3D sắc hồng tình nhân kết hợp trái tim pha lê và bộ sưu tập ảnh đôi',
    badge: '🌹 14/2 Đặc Biệt',
    price: 39000,
    oldPrice: 69000,
    engineUrl: 'templates/valentine/sweet-universe-3d/index.html',
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
    id: 'women_crystal_rose_3d',
    category: 'women',
    isHot: true,
    salesCount: 'Mới ra mắt',
    title: 'Bông Hồng Thủy Tinh 3D • Nụ Hồng Pha Lê Hé Nở',
    subtitle: 'Đóa hồng pha lê trong suốt từ từ hé nở từng lớp cánh trong lồng kính hoàng gia, phát sáng caustics lung linh kèm tiếng đàn Piano thanh khiết & khung ảnh kỷ niệm 3D',
    badge: '🌹 Pha Lê Hoàng Gia',
    price: 39000,
    oldPrice: 69000,
    engineUrl: 'templates/women/crystal-rose-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #1a051d 0%, #831843 50%, #f472b6 100%)',
    previewEmoji: '🌹',
    features: ['Đóa hồng pha lê 3D hé nở đa tầng', 'Ánh sáng Caustics & Khung ảnh 3D', 'Nhạc Grand Piano Web Audio + Thiệp QR'],
    preset: {
      occasion: 'Chúc mừng 8/3',
      occasionType: '8/3',
      theme: 'ruby_rose'
    }
  },
  {
    id: 'women_thousand_wishes',
    category: 'women',
    isHot: true,
    salesCount: 'Mới ra mắt',
    title: 'Ngàn Lời Chúc • Pháo Hoa Morphing Text',
    subtitle: 'Pháo hoa nở bung thành các cụm chữ "Xinh đẹp", "Giỏi giang", "Hạnh phúc" bay lượn rồi hút tụ lại thành "Chúc mừng 8/3" hoặc "20/10" cùng tên người nhận',
    badge: '🎆 Hot 8/3 & 20/10',
    price: 39000,
    oldPrice: 69000,
    engineUrl: 'templates/women/thousand-wishes-fireworks/index.html',
    previewGradient: 'linear-gradient(135deg, #2b0618 0%, #9d174d 52%, #f472b6 100%)',
    previewEmoji: '🎆',
    features: ['Pháo hoa Morphing Text 3D', 'Chọn dịp 8/3 hoặc 20/10 + Album ảnh', 'Nhạc Lofi Pop Web Audio + Thiệp QR'],
    preset: {
      occasion: 'Chúc mừng 8/3',
      occasionType: '8/3',
      theme: 'rose_gold'
    }
  },
  {
    id: 'women_glowing_flower_garden',
    category: 'women',
    isHot: true,
    salesCount: 'Mới ra mắt',
    title: 'Vườn Hoa Ánh Sáng 3D • Trăm Hoa Đua Nở',
    subtitle: 'Cánh đồng cỏ 3D đung đưa trong đêm huyền diệu, làn sóng ánh sáng đánh thức hàng trăm đóa hoa phát sáng bung nở dọc màn hình kèm tiếng chim xuân & giai điệu êm dịu',
    badge: '🌸 Khu Vườn Phép Thuật',
    price: 39000,
    oldPrice: 69000,
    engineUrl: 'templates/women/glowing-flower-garden/index.html',
    previewGradient: 'linear-gradient(135deg, #07191e 0%, #0f5156 48%, #f472b6 100%)',
    previewEmoji: '🌷',
    features: ['Thảm cỏ & Hoa 3D bung nở liên hoàn', 'Chạm gieo hoa sáng & Khung ảnh 3D', 'Tiếng chim xuân + Nhạc dạo Web Audio'],
    preset: {
      occasion: 'Chúc mừng 8/3',
      occasionType: '8/3',
      theme: 'rose_emerald'
    }
  },
  {
    id: 'women_flowing_silk_3d',
    category: 'women',
    isHot: true,
    salesCount: 'Mới ra mắt',
    title: 'Dải Lụa Bay 3D • Vén Màn Kỷ Niệm',
    subtitle: 'Dải lụa satin 3D mềm mại bay uốn lượn trong gió, vuốt vén màn lụa hé lộ vòng cung ảnh kỷ niệm & bảng tên khắc vàng kèm nhạc Chillout êm dịu',
    badge: '🎀 Lụa Satin 3D',
    price: 39000,
    oldPrice: 69000,
    engineUrl: 'templates/women/flowing-silk-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #24071c 0%, #9d174d 50%, #f9a8d4 100%)',
    previewEmoji: '🎀',
    features: ['Vén lụa satin 3D tương tác', 'Bảng tên khắc vàng & Vòng cung ảnh 3D', 'Nhạc Chillout + Tiếng gió Web Audio'],
    preset: {
      occasion: 'Chúc mừng 8/3',
      occasionType: '8/3',
      theme: 'rose_silk'
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
    isHot: true,
    salesCount: '1.4k+ đã tạo',
    title: 'Pháo Hoa Giao Thừa & Countdown Tết 2027',
    subtitle: 'Mô phỏng pháo hoa đa tầng chân thực (11 loại pháo hoa), âm thanh nổ sống động, màn chúc Tết thiêng liêng',
    badge: '🧧 Tết Đinh Mùi 2027',
    price: 25000,
    oldPrice: 45000,
    engineUrl: 'templates/holiday/tet-fireworks/index.html',
    previewGradient: 'linear-gradient(135deg, #450a0a 0%, #b91c1c 55%, #f59e0b 100%)',
    previewEmoji: '🎆',
    features: ['11 loại pháo hoa chân thực', 'Âm thanh nổ đa tầng Web Audio', 'Đại tiệc pháo hoa Finale'],
    preset: {
      occasion: 'Chúc Mừng Năm Mới 2027 • Tết Đinh Mùi',
      theme: 'gold'
    }
  },
  {
    id: 'reindeer_sleigh_magic',
    category: 'holiday',
    isHot: true,
    salesCount: 'Mới ra mắt',
    title: 'Tuần Lộc Chạy Qua • Bụi Tiên Tụ Chữ',
    subtitle: 'Cỗ xe tuần lộc lướt ngang mặt trăng khổng lồ, rải bụi tiên tụ thành lời chúc & đánh rơi hộp quà kỷ niệm',
    badge: '🦌 Noel Điện Ảnh',
    price: 35000,
    oldPrice: 59000,
    engineUrl: 'templates/holiday/reindeer-ride/index.html',
    previewGradient: 'linear-gradient(135deg, #040814 0%, #172554 55%, #312e81 100%)',
    previewEmoji: '🛷',
    features: ['Bóng xe tuần lộc qua mặt trăng', 'Bụi tiên tụ chữ & Tuyết rơi 2 lớp', 'Chạm hộp quà rơi bung ảnh kỷ niệm'],
    preset: {
      occasion: 'Merry Christmas • Giáng Sinh An Lành',
      theme: 'gold'
    }
  },
  {
    id: 'spring_blossom_3d',
    category: 'holiday',
    isHot: true,
    salesCount: 'Mới ra mắt',
    title: 'Hoa Đào / Hoa Mai Rơi 3D • Hái Lộc Đầu Xuân',
    subtitle: 'Camera bay xuyên màn mưa cánh hoa 3D hiệu ứng Bokeh, chạm Nụ Hoa Vàng mở cuốn thư pháp đỏ & tùy chọn Bắc/Nam',
    badge: '🌸 VIP Tết 2027',
    price: 50000,
    oldPrice: 89000,
    engineUrl: 'templates/holiday/spring-blossom-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #3b0722 0%, #991b1b 52%, #f59e0b 100%)',
    previewEmoji: '🌸',
    features: ['Three.js 3D + Bokeh điện ảnh', 'Chạm Nụ Hoa Vàng mở Thư Pháp Đỏ', 'Chuyển đổi Bắc (Sáo) / Nam (Đàn tranh)'],
    preset: {
      occasion: 'Chúc Mừng Năm Mới 2027',
      theme: 'gold'
    }
  },
  {
    id: 'red_envelope_3d',
    category: 'holiday',
    isHot: true,
    salesCount: 'Mới ra mắt',
    title: 'Lì Xì Đỏ 3D • Gieo Quẻ Đầu Năm',
    subtitle: 'Vuốt mở bao lì xì 3D (3 skin tùy chọn), hàng trăm đồng xu vàng phun trào xếp chữ "Tài Lộc - Bình An" & chạm Gieo Quẻ Đầu Năm / Voucher',
    badge: '🧧 Hot Trend Tết',
    price: 39000,
    oldPrice: 79000,
    engineUrl: 'templates/holiday/red-envelope-3d/index.html',
    previewGradient: 'linear-gradient(135deg, #450a0a 0%, #b91c1c 55%, #f59e0b 100%)',
    previewEmoji: '🧧',
    features: ['Vuốt mở bao lì xì 3D + 3 Skin', 'Xu vàng phun trào xếp chữ Tài Lộc', 'Gieo Quẻ Đầu Năm'],
    preset: {
      occasion: 'Chúc Mừng Năm Mới • Tài Lộc Bình An',
      theme: 'gold'
    }
  },
  {
    id: 'snow_globe_magic',
    category: 'holiday',
    isHot: true,
    salesCount: 'Mới ra mắt',
    title: 'Quả Cầu Tuyết Ma Thuật • Tuyết Tụ Chữ 3D',
    subtitle: 'Quả cầu thủy tinh 3D trên bệ gỗ sồi ấm áp, lắc hoặc chạm để bão tuyết cuộn trào tụ thành lời chúc & mở quà kỷ niệm 3D',
    badge: '🔮 Noel Ma Thuật',
    price: 39000,
    oldPrice: 69000,
    engineUrl: 'templates/holiday/snow-globe-magic/index.html',
    previewGradient: 'linear-gradient(135deg, #1b0f0a 0%, #3b1c12 48%, #0f2942 100%)',
    previewEmoji: '🔮',
    features: ['Quả cầu tuyết 3D + Nhà gỗ khói bay', 'Tuyết cuộn trào tụ chữ + Lắc điện thoại', 'Mở quà 3D xem thư & ảnh + Nhạc Lofi'],
    preset: {
      occasion: 'Merry Christmas',
      theme: 'warm_gold'
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
