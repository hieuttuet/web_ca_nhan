/**
 * VŨ TRỤ KỶ NIỆM 3D - PAY-PER-USE PERSONALIZED MICRO WEB
 * Pure Frontend (Three.js + Web Audio API + LZString URL State + VietQR + Gift Card Generator)
 */

// ==================== 1. DEFAULT & DEMO DATA ====================
function createRomanticPlaceholderDataUrl(title, subtitle, grad1, grad2, emoji) {
  const c = document.createElement('canvas');
  c.width = 400;
  c.height = 480;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#fff9fc';
  ctx.fillRect(0, 0, 400, 480);

  const grad = ctx.createLinearGradient(24, 24, 376, 376);
  grad.addColorStop(0, grad1);
  grad.addColorStop(1, grad2);
  ctx.fillStyle = grad;
  ctx.fillRect(24, 24, 352, 352);

  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  for (let i = 0; i < 35; i++) {
    const x = 30 + ((i * 97) % 340);
    const y = 30 + ((i * 61) % 340);
    const r = (i % 3) + 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const rad = ctx.createRadialGradient(200, 175, 10, 200, 175, 110);
  rad.addColorStop(0, 'rgba(255,255,255,0.35)');
  rad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = rad;
  ctx.beginPath();
  ctx.arc(200, 175, 110, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '86px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 200, 175);

  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(title, 200, 325);

  ctx.font = 'bold 26px "Dancing Script", cursive, sans-serif';
  ctx.fillStyle = '#be185d';
  ctx.fillText(subtitle, 200, 430);

  return c.toDataURL('image/jpeg', 0.85);
}

const DEFAULT_PHOTOS = [
  {
    url: createRomanticPlaceholderDataUrl('Lần Đầu Gặp Gỡ', 'Ánh mắt đầu tiên ✨', '#ff4d94', '#6b21a8', '💑'),
    caption: 'Ngày đầu tiên trái tim rung động'
  },
  {
    url: createRomanticPlaceholderDataUrl('Những Buổi Hẹn Hò', 'Nắm tay đi khắp thế gian', '#ec4899', '#3b0764', '🌹'),
    caption: 'Mỗi giây phút bên em đều là phép màu'
  },
  {
    url: createRomanticPlaceholderDataUrl('Nụ Cười Của Em', 'Ánh nắng ấm áp nhất', '#f43f5e', '#831843', '🥰'),
    caption: 'Nụ cười làm tan chảy cả ngân hà'
  },
  {
    url: createRomanticPlaceholderDataUrl('Kỷ Niệm Ngọt Ngào', 'Chuyến đi đáng nhớ', '#a855f7', '#1e1b4b', '🎡'),
    caption: 'Cùng nhau tạo nên ngàn vạn ký ức'
  },
  {
    url: createRomanticPlaceholderDataUrl('Lời Hứa Dưới Sao', 'Mãi bên nhau nhé', '#db2777', '#4c1d95', '🌠'),
    caption: 'Dù vạn năm sau vẫn giữ vẹn nguyên'
  },
  {
    url: createRomanticPlaceholderDataUrl('Tương Lai Hạnh Phúc', 'Ngôi nhà & những giấc mơ', '#e11d48', '#581c87', '💍'),
    caption: 'Yêu thương từ hiện tại đến mãi mãi'
  }
];

const THEME_PALETTES = {
  pink: { inside: '#ff5ca8', outside: '#7e22ce', heart: '#ff2a85' },
  purple: { inside: '#c084fc', outside: '#3b82f6', heart: '#a855f7' },
  blue: { inside: '#38bdf8', outside: '#4338ca', heart: '#0ea5e9' },
  gold: { inside: '#fbbf24', outside: '#db2777', heart: '#f59e0b' }
};

const AI_WISH_TEMPLATES = [
  "Giữa hàng tỷ vì sao trong vũ trụ bao la, thật kỳ diệu khi chúng mình lại tìm thấy nhau. Cảm ơn người thương đã luôn là ánh sáng dịu dàng nhất trong cuộc đời anh. Chúc cho hành trình của chúng mình mãi rực rỡ như dải ngân hà này nhé! ❤️",
  "Người ta nói vũ trụ rộng lớn không có điểm dừng, cũng giống như tình cảm anh dành cho em vậy. Mỗi bức ảnh bay lượn nơi đây đều là một mảnh ghép hạnh phúc mà anh trân quý nhất. Yêu em thật nhiều! ✨",
  "Chúc mừng ngày đặc biệt của người con gái tuyệt vời nhất! Mong em luôn mỉm cười thật tươi, mọi điều ước đều hóa thành hiện thực. Dù ở bất cứ đâu, trái tim anh vẫn luôn xoay quanh em như các hành tinh xoay quanh mặt trời! 🪐💖",
  "Có những khoảnh khắc thoáng qua nhưng lại ở trong tim suốt đời. Anh đã gom tất cả những kỷ niệm đẹp nhất của hai đứa đặt vào dải ngân hà 3D này để bất cứ khi nào mở ra, em cũng thấy mình được yêu thương trọn vẹn! 🌹"
];

const SHAPE_MODES = ['galaxy', 'heart', 'ring', 'sphere'];
const SHAPE_LABELS = {
  galaxy: { icon: '🪐', text: 'Ngân Hà 3D' },
  heart: { icon: '💖', text: 'Trái Tim 3D' },
  ring: { icon: '💍', text: 'Nhẫn Tinh Vân' },
  sphere: { icon: '🔮', text: 'Cầu Pha Lê' }
};

let appState = {
  templateId: 'galaxy_love_3d',
  price: 39000,
  sender: 'Bảo Nam',
  receiver: 'Minh Anh',
  occasion: 'Lời Tỏ Tình Từ Trái Tim',
  theme: 'pink',
  defaultShape: 'galaxy',
  anniversaryDate: '',
  melody: 'romance',
  message: AI_WISH_TEMPLATES[0],
  photos: JSON.parse(JSON.stringify(DEFAULT_PHOTOS))
};

let currentOrderCode = null;
let orderPollInterval = null;

// Áp dụng cấu hình từ ?tpl=... khi khách chọn mẫu từ Trang Chủ Kho Mẫu
function applyTemplateFromUrlParam() {
  try {
    const params = new URLSearchParams(window.location.search);
    const tplId = params.get('tpl');
    if (tplId && window.TEMPLATES_CATALOG) {
      const found = window.TEMPLATES_CATALOG.find((t) => t.id === tplId);
      if (found) {
        appState.templateId = found.id;
        appState.price = found.price;
        if (found.preset) {
          appState.occasion = found.preset.occasion || appState.occasion;
          appState.defaultShape = found.preset.defaultShape || appState.defaultShape;
          appState.theme = found.preset.theme || appState.theme;
          appState.melody = found.preset.melody || appState.melody;
        }
      }
    }
  } catch (e) {}
}

let isRecipientGiftMode = false;

// Tải dữ liệu món quà từ Supabase nếu trên URL có ?id=LOVE123456
async function loadStateFromServer() {
  try {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');
    if (!orderId) return false;

    const res = await fetch(`/api/check-order?code=${encodeURIComponent(orderId)}`);
    const data = await res.json();
    if (res.ok && data.status === 'PAID' && data.order) {
      isRecipientGiftMode = true;
      const order = data.order;
      const p = order.payload || {};
      appState = {
        ...appState,
        sender: order.sender_name || appState.sender,
        receiver: order.receiver_name || appState.receiver,
        occasion: order.occasion || appState.occasion,
        message: order.message || appState.message,
        theme: p.theme || appState.theme,
        defaultShape: p.defaultShape || appState.defaultShape,
        anniversaryDate: p.anniversaryDate || '',
        melody: p.melody || 'romance',
        photos: Array.isArray(p.photos) && p.photos.length > 0 ? p.photos : appState.photos
      };
      return true;
    }
  } catch (err) {
    console.warn('Could not load order from server:', err);
  }
  return false;
}

// ==================== 2. WEB AUDIO ROMANTIC MUSIC BOX ====================
const MELODIES = {
  romance: [
    523.25, 659.25, 783.99, 1046.50, 987.77, 783.99, 659.25, 783.99,
    440.00, 523.25, 659.25, 880.00, 783.99, 659.25, 523.25, 659.25,
    349.23, 440.00, 523.25, 698.46, 659.25, 523.25, 440.00, 523.25,
    392.00, 493.88, 587.33, 783.99, 659.25, 587.33, 493.88, 392.00
  ],
  birthday: [
    392.00, 392.00, 440.00, 392.00, 523.25, 493.88, 392.00, 392.00,
    440.00, 392.00, 587.33, 523.25, 392.00, 392.00, 783.99, 659.25,
    523.25, 493.88, 440.00, 698.46, 698.46, 659.25, 523.25, 587.33, 523.25
  ],
  canon: [
    659.25, 587.33, 523.25, 493.88, 440.00, 392.00, 440.00, 493.88,
    523.25, 783.99, 659.25, 587.33, 523.25, 659.25, 587.33, 493.88
  ]
};

class RomanticMusicBox {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.noteIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNote(freq) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    const harmonicGain = this.ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.03, now);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 2.4);

    osc.connect(gain);
    osc2.connect(harmonicGain);
    harmonicGain.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 2.5);
    osc2.stop(now + 2.5);
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    document.getElementById('btn-music').classList.add('active');

    const step = () => {
      if (!this.isPlaying) return;
      const list = MELODIES[appState.melody] || MELODIES.romance;
      const freq = list[this.noteIndex % list.length];
      this.playNote(freq);
      this.noteIndex++;
      this.timer = setTimeout(step, 460);
    };
    step();
  }

  stop() {
    this.isPlaying = false;
    document.getElementById('btn-music').classList.remove('active');
    if (this.timer) clearTimeout(this.timer);
  }

  toggle() {
    if (this.isPlaying) this.stop();
    else this.start();
  }
}

const musicBox = new RomanticMusicBox();

// ==================== 3. THREE.JS 3D SCENE (4 SHAPES + FIREWORKS) ====================
let scene, camera, renderer, controls, raycaster, mouse;
let galaxyPoints, galaxyGeometry, galaxyMaterial;
let photoMeshes = [];
let photoGroup;
let centerHeartGroup, centerHeartMesh;
let fireworkSystems = [];
let currentShape = 'galaxy';
let isCinematicTour = false;
let tourAngle = 0;

const PARTICLE_COUNT = 16000;
let shapePositions = {
  galaxy: null,
  heart: null,
  ring: null,
  sphere: null
};
let currentPositions;

function createGlowTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255, 255, 255, 1)');
  g.addColorStop(0.25, 'rgba(255, 210, 240, 0.85)');
  g.addColorStop(0.6, 'rgba(255, 100, 180, 0.25)');
  g.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function initThreeScene() {
  const container = document.getElementById('canvas-container');
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05020a, 0.015);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 8, 22);

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 48;
  controls.minDistance = 4;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.7;

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  buildMorphingGalaxy();
  buildCenterHeartCore();

  photoGroup = new THREE.Group();
  scene.add(photoGroup);
  rebuildPhotoCards();

  window.addEventListener('resize', onWindowResize);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);

  animate();
}

function buildMorphingGalaxy() {
  if (galaxyPoints) {
    scene.remove(galaxyPoints);
    galaxyGeometry.dispose();
    galaxyMaterial.dispose();
  }

  galaxyGeometry = new THREE.BufferGeometry();
  shapePositions.galaxy = new Float32Array(PARTICLE_COUNT * 3);
  shapePositions.heart = new Float32Array(PARTICLE_COUNT * 3);
  shapePositions.ring = new Float32Array(PARTICLE_COUNT * 3);
  shapePositions.sphere = new Float32Array(PARTICLE_COUNT * 3);
  currentPositions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  const palette = THEME_PALETTES[appState.theme] || THEME_PALETTES.pink;
  const colorInside = new THREE.Color(palette.inside);
  const colorOutside = new THREE.Color(palette.outside);

  const branches = 5;
  const maxRadius = 20;
  const spin = 1.35;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;

    // 1. Spiral Galaxy
    const r = Math.pow(Math.random(), 1.6) * maxRadius;
    const branchAngle = ((i % branches) / branches) * Math.PI * 2;
    const spinAngle = r * spin;
    const randomSpread = 0.45 * (1 + r * 0.12);
    const rx = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomSpread;
    const ry = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (randomSpread * 0.55);
    const rz = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomSpread;

    shapePositions.galaxy[i3] = Math.cos(branchAngle + spinAngle) * r + rx;
    shapePositions.galaxy[i3 + 1] = ry;
    shapePositions.galaxy[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + rz;

    // 2. 3D Volumetric Heart
    const t = Math.random() * Math.PI * 2;
    const u = Math.random() * Math.PI - Math.PI / 2;
    const shell = 0.55 + 0.45 * Math.cbrt(Math.random());
    const scale = 0.48 * shell;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const hz = (Math.random() - 0.5) * 8 * Math.sin(t) * Math.cos(u);

    shapePositions.heart[i3] = hx * scale;
    shapePositions.heart[i3 + 1] = hy * scale + 1.2;
    shapePositions.heart[i3 + 2] = hz * scale;

    // 3. Double Interlocking Nebula Rings
    const ringIdx = i % 2;
    const ringAngle = Math.random() * Math.PI * 2;
    const ringRadius = 11.5 + (Math.random() - 0.5) * 2.2;
    const ringThick = (Math.random() - 0.5) * 1.1;
    let rxPos = Math.cos(ringAngle) * ringRadius;
    let ryPos = ringThick;
    let rzPos = Math.sin(ringAngle) * ringRadius;
    const tilt = ringIdx === 0 ? 0.45 : -0.45;
    shapePositions.ring[i3] = rxPos;
    shapePositions.ring[i3 + 1] = ryPos * Math.cos(tilt) - rzPos * Math.sin(tilt);
    shapePositions.ring[i3 + 2] = ryPos * Math.sin(tilt) + rzPos * Math.cos(tilt);

    // 4. Crystal Star Sphere
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const sr = 9.5 * (0.82 + 0.18 * Math.random());
    shapePositions.sphere[i3] = sr * Math.sin(phi) * Math.cos(theta);
    shapePositions.sphere[i3 + 1] = sr * Math.sin(phi) * Math.sin(theta);
    shapePositions.sphere[i3 + 2] = sr * Math.cos(phi);

    // Initial active shape
    const activeArr = shapePositions[currentShape] || shapePositions.galaxy;
    currentPositions[i3] = activeArr[i3];
    currentPositions[i3 + 1] = activeArr[i3 + 1];
    currentPositions[i3 + 2] = activeArr[i3 + 2];

    const mixedColor = colorInside.clone().lerp(colorOutside, r / maxRadius);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
  galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  galaxyMaterial = new THREE.PointsMaterial({
    size: 0.24,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    map: createGlowTexture(),
    transparent: true,
    opacity: 0.92
  });

  galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
  scene.add(galaxyPoints);
}

// 3D Firework Burst Generator
function spawnFireworkBurst() {
  const count = 420;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const vel = [];
  const colors = new Float32Array(count * 3);

  const originX = (Math.random() - 0.5) * 14;
  const originY = 2 + Math.random() * 7;
  const originZ = (Math.random() - 0.5) * 14;

  const palette = ['#ff4d94', '#fde047', '#38bdf8', '#c084fc', '#4ade80'];
  const baseColor = new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    pos[i3] = originX;
    pos[i3 + 1] = originY;
    pos[i3 + 2] = originZ;

    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const speed = 0.08 + Math.random() * 0.22;
    vel.push({
      vx: speed * Math.sin(phi) * Math.cos(theta),
      vy: speed * Math.sin(phi) * Math.sin(theta),
      vz: speed * Math.cos(phi)
    });

    colors[i3] = baseColor.r;
    colors[i3 + 1] = baseColor.g;
    colors[i3 + 2] = baseColor.b;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.38,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    map: createGlowTexture(),
    transparent: true,
    opacity: 1,
    depthWrite: false
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);
  fireworkSystems.push({ points, geo, mat, vel, life: 1.0 });
}

function buildCenterHeartCore() {
  if (centerHeartGroup) scene.remove(centerHeartGroup);
  centerHeartGroup = new THREE.Group();

  const x = 0, y = 0;
  const heartShape = new THREE.Shape();
  heartShape.moveTo(x + 0.5, y + 0.5);
  heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
  heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
  heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
  heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
  heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
  heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

  const geo = new THREE.ExtrudeGeometry(heartShape, {
    depth: 0.4,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.15,
    bevelThickness: 0.15
  });
  geo.center();
  geo.rotateZ(Math.PI);

  const palette = THEME_PALETTES[appState.theme] || THEME_PALETTES.pink;
  centerHeartMesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: palette.heart }));
  centerHeartMesh.scale.set(1.1, 1.1, 1.1);
  centerHeartGroup.add(centerHeartMesh);

  const haloSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createGlowTexture(),
      color: palette.inside,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.75
    })
  );
  haloSprite.scale.set(6.5, 6.5, 1);
  centerHeartGroup.add(haloSprite);

  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 512;
  labelCanvas.height = 128;
  const lctx = labelCanvas.getContext('2d');
  lctx.fillStyle = 'rgba(20, 8, 38, 0.78)';
  lctx.strokeStyle = 'rgba(255, 158, 198, 0.75)';
  lctx.lineWidth = 4;
  lctx.beginPath();
  lctx.roundRect(36, 24, 440, 80, 40);
  lctx.fill();
  lctx.stroke();

  lctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
  lctx.fillStyle = '#ffffff';
  lctx.textAlign = 'center';
  lctx.textBaseline = 'middle';
  lctx.fillText('💌 Chạm Mở Tâm Thư', 256, 64);

  const labelSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(labelCanvas), transparent: true })
  );
  labelSprite.position.set(0, -2.2, 0);
  labelSprite.scale.set(4.2, 1.05, 1);
  centerHeartGroup.add(labelSprite);

  scene.add(centerHeartGroup);
}

function createPolaroidTexture(photoItem, callback) {
  const c = document.createElement('canvas');
  c.width = 400;
  c.height = 480;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#fff8fc';
  ctx.beginPath();
  ctx.roundRect(8, 8, 384, 464, 22);
  ctx.fill();

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(26, 26, 348, 348, 14);
    ctx.clip();

    const scale = Math.max(348 / img.width, 348 / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, 26 + (348 - w) / 2, 26 + (348 - h) / 2, w, h);
    ctx.restore();

    ctx.font = 'bold 26px "Dancing Script", cursive, sans-serif';
    ctx.fillStyle = '#9d174d';
    ctx.textAlign = 'center';
    ctx.fillText(photoItem.caption || 'Kỷ niệm ngọt ngào ✨', 200, 426);

    callback(new THREE.CanvasTexture(c));
  };
  img.onerror = () => callback(new THREE.CanvasTexture(c));
  img.src = photoItem.url;
}

function rebuildPhotoCards() {
  if (!photoGroup) return;
  while (photoGroup.children.length > 0) {
    photoGroup.remove(photoGroup.children[0]);
  }
  photoMeshes = [];

  const photos = appState.photos || [];
  const count = photos.length;
  const orbitRadius = 9.2;

  photos.forEach((item, idx) => {
    const angle = (idx / count) * Math.PI * 2;
    const cardGeo = new THREE.PlaneGeometry(2.6, 3.12);
    const cardMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true
    });

    const mesh = new THREE.Mesh(cardGeo, cardMat);
    const yOffset = Math.sin(idx * 1.7) * 1.6;
    mesh.position.set(Math.cos(angle) * orbitRadius, yOffset, Math.sin(angle) * orbitRadius);

    mesh.userData = {
      isPhotoCard: true,
      photoIndex: idx,
      baseAngle: angle,
      baseY: yOffset,
      orbitRadius: orbitRadius,
      photoData: item
    };

    createPolaroidTexture(item, (tex) => {
      cardMat.map = tex;
      cardMat.needsUpdate = true;
    });

    photoGroup.add(mesh);
    photoMeshes.push(mesh);
  });
}

let pointerDownPos = { x: 0, y: 0 };
function onPointerDown(e) {
  pointerDownPos = { x: e.clientX, y: e.clientY };
  const onPointerUp = (upEvent) => {
    window.removeEventListener('pointerup', onPointerUp);
    const dx = upEvent.clientX - pointerDownPos.x;
    const dy = upEvent.clientY - pointerDownPos.y;
    if (Math.hypot(dx, dy) < 6) {
      handleCanvasClick(upEvent);
    }
  };
  window.addEventListener('pointerup', onPointerUp);
}

function handleCanvasClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const hitPhotos = raycaster.intersectObjects(photoMeshes);
  if (hitPhotos.length > 0) {
    openPhotoLightbox(hitPhotos[0].object.userData.photoData);
    return;
  }

  if (centerHeartMesh) {
    const hitHeart = raycaster.intersectObject(centerHeartMesh);
    if (hitHeart.length > 0) {
      openLoveLetterModal();
    }
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  const time = performance.now() * 0.001;

  // Smooth Morphing toward active shapePositions[currentShape]
  const targetArr = shapePositions[currentShape] || shapePositions.galaxy;
  if (targetArr && galaxyGeometry) {
    const posAttr = galaxyGeometry.attributes.position;
    let changed = false;
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      const diff = targetArr[i] - posAttr.array[i];
      if (Math.abs(diff) > 0.002) {
        posAttr.array[i] += diff * 0.055;
        changed = true;
      }
    }
    if (changed) posAttr.needsUpdate = true;
  }

  if (galaxyPoints) {
    galaxyPoints.rotation.y = time * 0.07;
  }

  if (centerHeartMesh) {
    const beat = 1.05 + Math.sin(time * 4.2) * 0.08 + Math.sin(time * 8.4) * 0.04;
    centerHeartMesh.scale.set(beat, beat, beat);
    centerHeartMesh.rotation.y = time * 0.8;
  }

  photoMeshes.forEach((mesh, idx) => {
    const a = mesh.userData.baseAngle + time * 0.14;
    const r = mesh.userData.orbitRadius;
    mesh.position.x = Math.cos(a) * r;
    mesh.position.z = Math.sin(a) * r;
    mesh.position.y = mesh.userData.baseY + Math.sin(time * 1.8 + idx) * 0.45;
    mesh.lookAt(camera.position);
  });

  // Update 3D Fireworks
  for (let i = fireworkSystems.length - 1; i >= 0; i--) {
    const fw = fireworkSystems[i];
    fw.life -= 0.016;
    if (fw.life <= 0) {
      scene.remove(fw.points);
      fw.geo.dispose();
      fw.mat.dispose();
      fireworkSystems.splice(i, 1);
      continue;
    }
    fw.mat.opacity = fw.life;
    const arr = fw.geo.attributes.position.array;
    for (let j = 0; j < fw.vel.length; j++) {
      const j3 = j * 3;
      arr[j3] += fw.vel[j].vx;
      arr[j3 + 1] += fw.vel[j].vy;
      arr[j3 + 2] += fw.vel[j].vz;
      fw.vel[j].vy -= 0.0022; // gravity
    }
    fw.geo.attributes.position.needsUpdate = true;
  }

  if (isCinematicTour) {
    tourAngle += 0.0065;
    const camR = 13.5 + Math.sin(tourAngle * 1.5) * 4.5;
    const camY = 3.2 + Math.cos(tourAngle * 2.0) * 3.8;
    camera.position.set(Math.cos(tourAngle) * camR, camY, Math.sin(tourAngle) * camR);
    camera.lookAt(0, 0.5, 0);
  } else {
    controls.update();
  }

  renderer.render(scene, camera);
}

// ==================== 4. UI, GIFT CARD & CREATOR STUDIO ====================
function syncUIFromState() {
  const coupleTitle = `${appState.receiver} ❤️ ${appState.sender}`;
  document.getElementById('intro-title').textContent = coupleTitle;
  document.getElementById('hud-couple-names').textContent = coupleTitle;
  document.getElementById('hud-occasion').textContent = appState.occasion;
  document.getElementById('intro-badge').textContent = `✨ ${appState.occasion} ✨`;

  // Anniversary Days Counter
  const daysPill = document.getElementById('hud-days-counter');
  if (appState.anniversaryDate) {
    const start = new Date(appState.anniversaryDate);
    const diffDays = Math.max(1, Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24)));
    document.getElementById('days-count-num').textContent = diffDays.toLocaleString('vi-VN');
    daysPill.style.display = 'inline-block';
  } else {
    daysPill.style.display = 'none';
  }

  currentShape = appState.defaultShape || 'galaxy';
  updateMorphButtonLabel();

  document.getElementById('letter-modal-title').textContent = `Gửi ${appState.receiver} Thương Yêu 💖`;
  document.getElementById('letter-modal-body').textContent = appState.message;
  document.getElementById('letter-modal-sign').textContent = `— Người thương: ${appState.sender} —`;

  document.getElementById('input-sender').value = appState.sender;
  document.getElementById('input-receiver').value = appState.receiver;
  document.getElementById('input-occasion').value = appState.occasion;
  document.getElementById('input-default-shape').value = appState.defaultShape;
  document.getElementById('input-anniversary-date').value = appState.anniversaryDate || '';
  document.getElementById('input-melody').value = appState.melody || 'romance';
  document.getElementById('input-message').value = appState.message;

  document.querySelectorAll('#theme-picker .theme-chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.theme === appState.theme);
  });

  const priceBadge = document.getElementById('cta-price-badge');
  if (priceBadge && appState.price) {
    priceBadge.textContent = Number(appState.price).toLocaleString('vi-VN') + 'đ';
  }
  const btnProceed = document.getElementById('btn-proceed-payment');
  if (btnProceed && appState.price) {
    btnProceed.innerHTML = `💳 Tạo Link & Thiệp QR (${Number(appState.price).toLocaleString('vi-VN')}đ)`;
  }

  // Chế độ dành cho Người Nhận Quà (khi mở link có ?id=LOVE...)
  if (isRecipientGiftMode) {
    const btnCreator = document.getElementById('btn-open-creator');
    if (btnCreator) btnCreator.style.display = 'none';

    const backBtn = document.getElementById('btn-bottom-back') || document.querySelector('.hud-bottom-bar a');
    if (backBtn) backBtn.style.display = 'none';

    const topHomeBtn = document.getElementById('btn-top-home');
    if (topHomeBtn) topHomeBtn.style.display = 'none';

    if (!document.getElementById('btn-recipient-create-viral')) {
      const viralBtn = document.createElement('a');
      viralBtn.id = 'btn-recipient-create-viral';
      viralBtn.href = '../../../index.html';
      viralBtn.className = 'pill-btn';
      viralBtn.style.textDecoration = 'none';
      viralBtn.style.opacity = '0.85';
      viralBtn.innerHTML = `<span>🎁</span><span>Tạo Món Quà Tương Tự</span>`;
      const bottomBar = document.querySelector('.hud-bottom-bar');
      if (bottomBar) bottomBar.appendChild(viralBtn);
    }

    const introBadge = document.getElementById('intro-badge');
    if (introBadge) introBadge.textContent = `✨ Món Quà Vũ Trụ Dành Riêng Cho ${appState.receiver} ✨`;

    const introSubtitle = document.getElementById('intro-subtitle');
    if (introSubtitle) {
      introSubtitle.innerHTML = `💌 <b>${appState.sender}</b> đã dành trọn yêu thương gửi tặng bạn một vũ trụ 3D kỳ diệu. Chạm để bước vào dải ngân hà kỷ niệm nhé!`;
    }

    const btnEnter = document.getElementById('btn-enter-galaxy');
    if (btnEnter) {
      btnEnter.innerHTML = `<span>🪐 Mở Món Quà Của ${appState.sender}</span>`;
    }
  }

  renderPhotoUploaderGrid();
}

function updateMorphButtonLabel() {
  const info = SHAPE_LABELS[currentShape] || SHAPE_LABELS.galaxy;
  document.getElementById('icon-morph-shape').textContent = info.icon;
  document.getElementById('label-morph-shape').textContent = info.text;
}

function renderPhotoUploaderGrid() {
  const grid = document.getElementById('photo-upload-grid');
  grid.innerHTML = '';

  appState.photos.forEach((photo, idx) => {
    const div = document.createElement('div');
    div.className = 'photo-thumb';
    div.title = 'Nhấn vào ảnh để đổi lời chú thích';
    div.innerHTML = `
      <img src="${photo.url}" alt="Ảnh ${idx + 1}" />
      <button type="button" class="photo-remove" title="Xóa ảnh">✕</button>
    `;
    div.querySelector('img').addEventListener('click', () => {
      const newCap = prompt('Nhập lời chú thích cho bức ảnh kỷ niệm này:', photo.caption || '');
      if (newCap !== null) {
        photo.caption = newCap.trim() || 'Kỷ niệm ngọt ngào ✨';
        showToast('✨ Đã cập nhật chú thích ảnh!');
      }
    });
    div.querySelector('.photo-remove').addEventListener('click', (e) => {
      e.stopPropagation();
      if (appState.photos.length <= 1) {
        showToast('Cần giữ lại ít nhất 1 bức ảnh kỷ niệm nhé!');
        return;
      }
      appState.photos.splice(idx, 1);
      renderPhotoUploaderGrid();
    });
    grid.appendChild(div);
  });

  if (appState.photos.length < 8) {
    const addBtn = document.createElement('div');
    addBtn.className = 'photo-add-label';
    addBtn.innerHTML = `<span style="font-size:1.3rem;">➕</span><span>Thêm ảnh</span>`;
    addBtn.addEventListener('click', () => {
      document.getElementById('input-photo-file').click();
    });
    grid.appendChild(addBtn);
  }

  document.getElementById('photo-count-label').textContent = `${appState.photos.length}/8 ảnh`;
}

function compressUploadedImage(file, maxSize = 320, quality = 0.72) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function openLoveLetterModal() {
  document.getElementById('modal-letter').classList.remove('hidden');
}

function openPhotoLightbox(photoData) {
  document.getElementById('lightbox-img').src = photoData.url;
  document.getElementById('lightbox-caption').textContent = photoData.caption || 'Khoảnh khắc ngọt ngào ✨';
  document.getElementById('modal-lightbox').classList.remove('hidden');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

function readCreatorFormIntoState() {
  appState.sender = document.getElementById('input-sender').value.trim() || 'Người thương';
  appState.receiver = document.getElementById('input-receiver').value.trim() || 'Em yêu';
  appState.occasion = document.getElementById('input-occasion').value;
  appState.defaultShape = document.getElementById('input-default-shape').value;
  appState.anniversaryDate = document.getElementById('input-anniversary-date').value;
  appState.melody = document.getElementById('input-melody').value;
  appState.message = document.getElementById('input-message').value.trim() || AI_WISH_TEMPLATES[0];
}

function applyCreatorChangesTo3D() {
  readCreatorFormIntoState();
  syncUIFromState();
  buildMorphingGalaxy();
  buildCenterHeartCore();
  rebuildPhotoCards();
}

function generateShareableUrl() {
  const payload = {
    sender: appState.sender,
    receiver: appState.receiver,
    occasion: appState.occasion,
    theme: appState.theme,
    defaultShape: appState.defaultShape,
    anniversaryDate: appState.anniversaryDate,
    melody: appState.melody,
    message: appState.message,
    photos: appState.photos.slice(0, 6)
  };

  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload));
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#gift=${compressed}`;
}

// Draw Printable / Downloadable Romantic Gift Card Canvas with QR Code
function renderGiftCardCanvas(shareUrl) {
  const canvas = document.getElementById('gift-card-canvas');
  const ctx = canvas.getContext('2d');

  // Deep galaxy gradient background
  const grad = ctx.createLinearGradient(0, 0, 600, 780);
  grad.addColorStop(0, '#1e0936');
  grad.addColorStop(0.5, '#3b0764');
  grad.addColorStop(1, '#090314');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 780);

  // Decorative stars
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  for (let i = 0; i < 65; i++) {
    const x = (i * 89) % 580 + 10;
    const y = (i * 113) % 760 + 10;
    ctx.beginPath();
    ctx.arc(x, y, (i % 2) + 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Glowing Card Border
  ctx.strokeStyle = 'rgba(255, 158, 198, 0.55)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(24, 24, 552, 732, 28);
  ctx.stroke();

  // Header Badge
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ff9ec6';
  ctx.textAlign = 'center';
  ctx.fillText('✨ MÓN QUÀ VŨ TRỤ KỶ NIỆM 3D ✨', 300, 86);

  // Couple Names
  ctx.font = 'bold 46px "Dancing Script", cursive, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${appState.receiver} ❤️ ${appState.sender}`, 300, 150);

  // Occasion
  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#fde047';
  ctx.fillText(appState.occasion, 300, 190);

  // White QR Box
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(145, 225, 310, 310, 24);
  ctx.fill();

  const qrData = encodeURIComponent(shareUrl.length < 950 ? shareUrl : window.location.origin + window.location.pathname);
  const qrImg = new Image();
  qrImg.crossOrigin = 'anonymous';
  qrImg.onload = () => {
    ctx.drawImage(qrImg, 165, 245, 270, 270);
  };
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&color=831843&data=${qrData}`;

  // Bottom Instruction
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ff9ec6';
  ctx.fillText('📲 Quét mã QR để bước vào Ngân Hà 3D', 300, 595);

  ctx.font = 'italic 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#e2e8f0';
  const shortWish = appState.message.length > 90 ? appState.message.slice(0, 90) + '...' : appState.message;
  ctx.fillText(`"${shortWish.slice(0, 48)}"`, 300, 645);
  if (shortWish.length > 48) {
    ctx.fillText(`"${shortWish.slice(48)}"`, 300, 675);
  }
}

async function openVietQRModal() {
  applyCreatorChangesTo3D();
  const btn = document.getElementById('btn-proceed-payment');
  const origText = btn.textContent;
  btn.textContent = '⏳ Đang tạo mã QR...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: appState.templateId || 'galaxy_love_3d',
        templateType: 'galaxy',
        senderName: appState.sender,
        receiverName: appState.receiver,
        occasion: appState.occasion,
        message: appState.message,
        payload: {
          templateId: appState.templateId,
          theme: appState.theme,
          defaultShape: appState.defaultShape,
          anniversaryDate: appState.anniversaryDate,
          melody: appState.melody,
          photos: appState.photos.slice(0, 8)
        }
      })
    });

    const data = await res.json();
    btn.textContent = origText;
    btn.disabled = false;

    if (!res.ok) {
      alert(data.error || 'Chưa cấu hình Biến môi trường Supabase / Ngân hàng trên Vercel.');
      return;
    }

    currentOrderCode = data.orderCode;
    document.getElementById('modal-creator').classList.add('hidden');
    document.getElementById('vietqr-img').src = data.qrUrl;
    document.getElementById('pay-bank-name').textContent = data.bankId;
    document.getElementById('pay-account-name').textContent = data.accountName;
    document.getElementById('pay-account-no').textContent = data.accountNo;
    document.getElementById('pay-amount-text').textContent = Number(data.amount).toLocaleString('vi-VN') + 'đ';
    document.getElementById('pay-memo-text').textContent = data.orderCode;

    document.getElementById('payment-step-qr').style.display = 'block';
    document.getElementById('payment-step-success').style.display = 'none';
    document.getElementById('modal-payment').classList.remove('hidden');

    startPollingGalaxyOrder(currentOrderCode);
  } catch (err) {
    btn.textContent = origText;
    btn.disabled = false;
    alert('Hãy triển khai lên Vercel và cài đặt Biến môi trường để sử dụng thanh toán tự động.');
  }
}

function startPollingGalaxyOrder(orderCode) {
  if (orderPollInterval) clearInterval(orderPollInterval);
  orderPollInterval = setInterval(async () => {
    try {
      const res = await fetch(`/api/check-order?code=${encodeURIComponent(orderCode)}`);
      const data = await res.json();
      if (res.ok && data.status === 'PAID') {
        clearInterval(orderPollInterval);
        unlockAndShowShareResult(orderCode);
      }
    } catch (e) {}
  }, 2500);
}

function unlockAndShowShareResult(orderCode) {
  const shareUrl = `${window.location.origin}${window.location.pathname}?id=${orderCode}`;
  document.getElementById('share-url-input').value = shareUrl;
  renderGiftCardCanvas(shareUrl);

  document.getElementById('payment-step-qr').style.display = 'none';
  document.getElementById('payment-step-success').style.display = 'block';
  spawnFireworkBurst();
  setTimeout(spawnFireworkBurst, 400);
  showToast('🎉 Thanh toán thành công! Đã tạo Link Vũ Trụ 3D & Thiệp QR!');
}

// ==================== 5. INITIALIZATION & EVENT BINDINGS ====================
window.addEventListener('DOMContentLoaded', async () => {
  applyTemplateFromUrlParam();
  await loadStateFromServer();
  syncUIFromState();
  initThreeScene();

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('create') === '1') {
    document.getElementById('intro-overlay').classList.add('hidden');
    document.getElementById('modal-creator').classList.remove('hidden');
  }

  document.getElementById('btn-enter-galaxy').addEventListener('click', () => {
    document.getElementById('intro-overlay').classList.add('hidden');
    musicBox.start();
    spawnFireworkBurst();
  });

  document.getElementById('btn-music').addEventListener('click', () => {
    musicBox.toggle();
  });

  document.getElementById('btn-firework-burst').addEventListener('click', () => {
    spawnFireworkBurst();
    setTimeout(spawnFireworkBurst, 300);
  });

  document.getElementById('btn-tiktok-mode').addEventListener('click', () => {
    document.body.classList.toggle('tiktok-clean-mode');
    const isClean = document.body.classList.contains('tiktok-clean-mode');
    showToast(isClean ? '📹 Đã bật Chế độ Quay TikTok (Chạm lại góc phải để hiện nút)' : 'Đã hiện thanh điều khiển');
  });

  document.getElementById('btn-morph-shape').addEventListener('click', () => {
    const idx = SHAPE_MODES.indexOf(currentShape);
    currentShape = SHAPE_MODES[(idx + 1) % SHAPE_MODES.length];
    updateMorphButtonLabel();
  });

  document.getElementById('btn-camera-tour').addEventListener('click', () => {
    isCinematicTour = !isCinematicTour;
    const btn = document.getElementById('btn-camera-tour');
    const label = document.getElementById('label-camera-tour');
    btn.classList.toggle('active', isCinematicTour);
    label.textContent = isCinematicTour ? 'Dừng Bay' : 'Bay Điện Ảnh';
    if (isCinematicTour) {
      showToast('🎬 Đang bay điện ảnh tự động qua các kỷ niệm');
    }
  });

  document.getElementById('btn-open-letter').addEventListener('click', openLoveLetterModal);

  document.getElementById('btn-open-creator').addEventListener('click', () => {
    syncUIFromState();
    document.getElementById('modal-creator').classList.remove('hidden');
  });

  document.querySelectorAll('#theme-picker .theme-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      appState.theme = chip.dataset.theme;
      document.querySelectorAll('#theme-picker .theme-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  let wishIdx = 0;
  document.getElementById('btn-ai-wish').addEventListener('click', () => {
    wishIdx = (wishIdx + 1) % AI_WISH_TEMPLATES.length;
    const receiverName = document.getElementById('input-receiver').value.trim() || 'em';
    let tpl = AI_WISH_TEMPLATES[wishIdx];
    document.getElementById('input-message').value = tpl.replace(/người thương/g, receiverName);
    showToast('🪄 AI đã viết lời chúc ngọt ngào mới!');
  });

  document.getElementById('input-photo-file').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    showToast('⏳ Đang tối ưu ảnh lên Ngân Hà 3D...');
    for (const file of files) {
      if (appState.photos.length >= 8) break;
      const compressedDataUrl = await compressUploadedImage(file, 320, 0.72);
      appState.photos.push({
        url: compressedDataUrl,
        caption: `${appState.receiver} ❤️ ${appState.sender}`
      });
    }
    e.target.value = '';
    renderPhotoUploaderGrid();
    showToast('✅ Đã thêm ảnh vào Vũ Trụ 3D!');
  });

  document.getElementById('btn-preview-3d').addEventListener('click', () => {
    applyCreatorChangesTo3D();
    document.getElementById('modal-creator').classList.add('hidden');
    showToast('✨ Đã cập nhật Vũ Trụ 3D theo thông tin của bạn!');
  });

  document.getElementById('btn-proceed-payment').addEventListener('click', openVietQRModal);

  document.getElementById('btn-copy-share-url').addEventListener('click', () => {
    const input = document.getElementById('share-url-input');
    input.select();
    navigator.clipboard.writeText(input.value).then(() => {
      showToast('📋 Đã sao chép đường link Vũ Trụ 3D!');
    });
  });

  document.getElementById('btn-download-card').addEventListener('click', () => {
    const canvas = document.getElementById('gift-card-canvas');
    const link = document.createElement('a');
    link.download = `Thiep-Vu-Tru-3D-${appState.receiver}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('📥 Đã tải Ảnh Thiệp QR về máy!');
  });

  // Tải trực tiếp mã VietQR để người dùng mở app ngân hàng quét từ thư viện ảnh
  document.getElementById('btn-download-vietqr').addEventListener('click', async () => {
    const img = document.getElementById('vietqr-img');
    if (!img.src) return;
    showToast('⏳ Đang tải mã VietQR thanh toán...');
    await downloadBlobImage(img.src, `VietQR-ThanhToan-${currentOrderCode || 'BIDV'}.png`);
    showToast('✅ Đã lưu mã VietQR! Mở App Ngân hàng quét từ ảnh nhé');
  });

  // Lưu riêng mã QR Quà tặng
  document.getElementById('btn-download-gift-qr-only').addEventListener('click', async () => {
    const input = document.getElementById('share-url-input');
    const shareUrl = input.value;
    if (!shareUrl) return;
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&color=831843&data=${encodeURIComponent(shareUrl)}`;
    showToast('⏳ Đang lưu mã QR quà tặng...');
    await downloadBlobImage(qrSrc, `Ma-QR-Vu-Tru-${appState.receiver}.png`);
    showToast('✅ Đã lưu mã QR Quà Tặng vào máy!');
  });

  async function downloadBlobImage(url, filename) {
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
  }

  document.querySelectorAll('.modal-close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-close');
      if (targetId === 'modal-payment' && orderPollInterval) {
        clearInterval(orderPollInterval);
      }
      if (targetId) document.getElementById(targetId).classList.add('hidden');
    });
  });
});
