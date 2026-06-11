/* ============================================================
   TILE MATCH 3 — game ghép 3 ô kiểu Tile Master + hệ thống Tướng
   - Chơi được trên web + mobile (touch)
   - Độ khó tăng dần theo màn
   - 3 tướng thú cưng: kỹ năng nạp bằng năng lượng từ việc ghép ô
   - Lưu người chơi + bảng xếp hạng bằng localStorage
   ============================================================ */

(() => {
"use strict";

// ---------- HẰNG SỐ ----------
// icon phẳng (flat) có "tính cách" để não dễ ghi nhớ — không gradient,
// màu gốc trầm; chỉ hình màu trắng mới có viền đen
const C = {
  red: "#c4231b", yellow: "#eaa800", blue: "#2456b8", green: "#2e7d32",
  orange: "#e65c00", purple: "#7b2fbf", pink: "#e0408a",
  black: "#2e2e2e", white: "#f8f8f8", bg: "#fffdf7",
};
const INK = "#4a3328"; // nâu sẫm ấm cho mắt/miệng — thân thiện hơn đen tuyền
const O = "#6b4a2f";   // viền nâu ấm quanh mọi hình (học từ nét vẽ Doggo Go)

// mỗi icon = 1 nhân vật nhỏ, vẽ "mũm mĩm" phủ gần kín ô, theo nét Doggo Go:
// viền nâu ấm quanh mọi hình, mọi góc bo tròn, không đỉnh nhọn;
// xếp theo độ dễ phân biệt (màn thấp dùng nhóm đầu)
const TYPES = [
  { name: "dưa hấu cắn dở", tone: "w", svg: `
    <path d="M3 30 A47 47 0 0 0 97 30 Z" fill="${C.green}" stroke="${O}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M12 30 A38 38 0 0 0 88 30 Z" fill="${C.red}"/>
    <circle cx="66" cy="30" r="13" fill="${C.bg}" stroke="${O}" stroke-width="4"/>
    <ellipse cx="32" cy="46" rx="4" ry="5.5" fill="${INK}"/>
    <ellipse cx="50" cy="56" rx="4" ry="5.5" fill="${INK}"/>
    <ellipse cx="62" cy="46" rx="3.5" ry="5" fill="${INK}"/>` },
  { name: "cá sấu khóc", tone: "c", svg: `
    <circle cx="28" cy="26" r="12" fill="${C.green}" stroke="${O}" stroke-width="5"/>
    <circle cx="60" cy="26" r="12" fill="${C.green}" stroke="${O}" stroke-width="5"/>
    <rect x="5" y="30" width="88" height="46" rx="18" fill="${C.green}" stroke="${O}" stroke-width="5"/>
    <circle cx="28" cy="25" r="5" fill="${INK}"/>
    <circle cx="60" cy="25" r="5" fill="${INK}"/>
    <path d="M16 60 a8 8 0 0 0 16 0 a8 8 0 0 0 16 0 a8 8 0 0 0 16 0 a8 8 0 0 0 16 0 Z" fill="${C.white}"/>
    <path d="M90 32 c5 8 9 12 9 17 a9 9 0 1 1 -18 0 c0 -5 4 -9 9 -17" fill="${C.blue}" stroke="${O}" stroke-width="3.5" stroke-linejoin="round"/>` },
  { name: "sao mũm mĩm", tone: "w", svg: `
    <polygon points="50,7 65,30 93,38 75,59 77,87 50,76 23,87 25,59 7,38 35,30"
      fill="${C.yellow}" stroke="${O}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M34 52 q5 5 10 0" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M56 52 q5 5 10 0" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="65" r="4.5" fill="${INK}"/>` },
  { name: "giọt nước cười", tone: "c", svg: `
    <path d="M50 6 C70 30 90 46 90 64 A40 40 0 0 1 10 64 C10 46 30 30 50 6 Z"
      fill="${C.blue}" stroke="${O}" stroke-width="5.5" stroke-linejoin="round"/>
    <circle cx="36" cy="62" r="6.5" fill="${C.white}"/><circle cx="36" cy="62" r="3.2" fill="${INK}"/>
    <circle cx="64" cy="62" r="6.5" fill="${C.white}"/><circle cx="64" cy="62" r="3.2" fill="${INK}"/>
    <path d="M38 76 q12 9 24 0" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>` },
  { name: "tim dán băng", tone: "w", svg: `
    <path d="M50 92 C16 67 4 44 14 28 C24 13 44 16 50 30 C56 16 76 13 86 28 C96 44 84 67 50 92 Z"
      fill="${C.pink}" stroke="${O}" stroke-width="5.5" stroke-linejoin="round"/>
    <g transform="rotate(-30 50 48)">
      <rect x="24" y="40" width="52" height="17" rx="8.5" fill="#f1d8ae" stroke="${O}" stroke-width="3.5"/>
      <rect x="41" y="42" width="18" height="13" rx="4" fill="#e0bd8a"/>
    </g>` },
  { name: "quái vật một mắt", tone: "c", svg: `
    <path d="M50 20 V10" stroke="${C.purple}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="50" cy="8" r="5.5" fill="${C.purple}" stroke="${O}" stroke-width="3"/>
    <circle cx="50" cy="56" r="38" fill="${C.purple}" stroke="${O}" stroke-width="5.5"/>
    <circle cx="50" cy="50" r="15" fill="${C.white}" stroke="${O}" stroke-width="3.5"/>
    <circle cx="50" cy="50" r="7" fill="${INK}"/>
    <path d="M38 76 q12 8 24 0" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>` },
  { name: "trứng ốp la", tone: "n", svg: `
    <path d="M28 24 C40 6 72 8 78 28 C92 36 94 62 80 74 C70 90 30 90 20 72 C8 58 14 36 28 24 Z"
      fill="${C.white}" stroke="${O}" stroke-width="5.5" stroke-linejoin="round"/>
    <circle cx="50" cy="50" r="18" fill="${C.yellow}" stroke="${O}" stroke-width="3.5"/>
    <circle cx="44" cy="44" r="5" fill="${C.white}"/>` },
  { name: "bom xì khói", tone: "n", svg: `
    <path d="M60 30 Q70 16 82 20" stroke="${O}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M84 4 q3 9 12 12 q-9 3 -12 12 q-3 -9 -12 -12 q9 -3 12 -12 Z"
      fill="${C.orange}" stroke="${O}" stroke-width="3.5" stroke-linejoin="round"/>
    <circle cx="44" cy="60" r="34" fill="${C.black}" stroke="${O}" stroke-width="5"/>
    <rect x="50" y="24" width="18" height="11" rx="5.5" fill="${C.black}" transform="rotate(25 59 30)"/>
    <circle cx="32" cy="48" r="6" fill="${C.white}"/>` },
  { name: "cá thổi bóng", tone: "w", svg: `
    <path d="M70 54 C88 38 96 42 92 54 C96 66 88 70 70 54 Z"
      fill="${C.orange}" stroke="${O}" stroke-width="4.5" stroke-linejoin="round"/>
    <ellipse cx="44" cy="54" rx="30" ry="22" fill="${C.orange}" stroke="${O}" stroke-width="5"/>
    <circle cx="30" cy="46" r="6" fill="${C.white}"/><circle cx="30" cy="46" r="3" fill="${INK}"/>
    <path d="M14 60 q5 4 10 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="12" cy="30" r="5" fill="${C.blue}" stroke="${O}" stroke-width="3"/>
    <circle cx="8" cy="18" r="3.5" fill="${C.blue}"/>` },
  { name: "nấm chấm bi", tone: "w", svg: `
    <path d="M8 54 A42 36 0 0 1 92 54 Z" fill="${C.red}" stroke="${O}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="30" cy="40" r="6" fill="${C.white}"/>
    <circle cx="54" cy="30" r="7" fill="${C.white}"/>
    <circle cx="70" cy="46" r="5" fill="${C.white}"/>
    <rect x="36" y="54" width="28" height="32" rx="11" fill="${C.white}" stroke="${O}" stroke-width="5"/>` },
  { name: "pizza khuyết miếng", tone: "w", svg: `
    <circle cx="50" cy="52" r="40" fill="${C.yellow}" stroke="${O}" stroke-width="5"/>
    <path d="M50 52 L64 14 A40 40 0 0 1 88 38 Z" fill="${C.bg}" stroke="${O}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="34" cy="40" r="6.5" fill="${C.red}"/>
    <circle cx="58" cy="68" r="6.5" fill="${C.red}"/>
    <circle cx="30" cy="64" r="5.5" fill="${C.red}"/>
    <path d="M48 36 l7 3 M64 56 l7 -3 M40 78 l7 -2" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/>` },
  { name: "ma trắng boo", tone: "n", svg: `
    <path d="M20 50 C20 24 34 12 50 12 C66 12 80 24 80 50 L80 76 Q74 70 68 76 Q62 84 56 77 Q50 70 44 77 Q38 84 32 76 Q26 70 20 76 Z"
      fill="${C.white}" stroke="${C.black}" stroke-width="5" stroke-linejoin="round"/>
    <ellipse cx="38" cy="44" rx="4.5" ry="6.5" fill="${C.black}"/>
    <ellipse cx="62" cy="44" rx="4.5" ry="6.5" fill="${C.black}"/>
    <ellipse cx="50" cy="60" rx="5.5" ry="7" fill="${C.black}"/>
    <circle cx="29" cy="54" r="4" fill="#f3b8cf"/>
    <circle cx="71" cy="54" r="4" fill="#f3b8cf"/>` },
  { name: "trăng khuyết ngủ", tone: "c", svg: `
    <circle cx="50" cy="50" r="40" fill="#7ba7e8" stroke="${O}" stroke-width="5"/>
    <circle cx="72" cy="30" r="29" fill="${C.bg}" stroke="${O}" stroke-width="4"/>
    <circle cx="28" cy="46" r="5.5" fill="${C.white}"/>
    <circle cx="44" cy="76" r="6" fill="${C.white}"/>
    <circle cx="62" cy="68" r="4.5" fill="${C.white}"/>
    <path d="M26 60 q4 4 8 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M40 62 q4 4 8 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="36" cy="72" r="3.5" fill="${INK}"/>` },
  { name: "banh xanh lá", tone: "c", svg: `
    <circle cx="50" cy="50" r="38" fill="${C.green}" stroke="${O}" stroke-width="5"/>
    <path d="M14 40 Q50 60 86 40" stroke="${C.white}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M32 16 Q46 50 32 84" stroke="${C.white}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M68 16 Q54 50 68 84" stroke="${C.white}" stroke-width="5" fill="none" stroke-linecap="round"/>` },
  { name: "máy cassette", tone: "w", svg: `
    <rect x="8" y="24" width="84" height="54" rx="10" fill="#8a5a2b" stroke="${O}" stroke-width="5"/>
    <rect x="18" y="33" width="64" height="24" rx="8" fill="${C.bg}"/>
    <circle cx="33" cy="45" r="6.5" fill="#8a5a2b"/>
    <circle cx="67" cy="45" r="6.5" fill="#8a5a2b"/>
    <rect x="40" y="42" width="20" height="6" rx="3" fill="#d8b888"/>
    <rect x="24" y="64" width="52" height="8" rx="4" fill="#5f3d1d"/>` },
  { name: "sách xanh đậm", tone: "c", svg: `
    <rect x="20" y="12" width="60" height="76" rx="7" fill="#1e3f8f" stroke="${O}" stroke-width="5"/>
    <rect x="26" y="12" width="8" height="76" fill="#16306e"/>
    <polygon points="60,12 74,12 74,38 67,30 60,38" fill="${C.red}"/>
    <path d="M42 56 h26" stroke="${C.white}" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M42 68 h18" stroke="${C.white}" stroke-width="4.5" stroke-linecap="round"/>` },
  { name: "cúp vô địch", tone: "w", svg: `
    <path d="M30 20 Q12 22 20 38 Q24 44 32 44" fill="none" stroke="${C.yellow}" stroke-width="6" stroke-linecap="round"/>
    <path d="M70 20 Q88 22 80 38 Q76 44 68 44" fill="none" stroke="${C.yellow}" stroke-width="6" stroke-linecap="round"/>
    <path d="M30 14 H70 V40 A20 20 0 0 1 30 40 Z" fill="${C.yellow}" stroke="${O}" stroke-width="5" stroke-linejoin="round"/>
    <rect x="44" y="58" width="12" height="12" fill="${C.yellow}"/>
    <rect x="30" y="70" width="40" height="14" rx="5" fill="#b07f00" stroke="${O}" stroke-width="4"/>
    <circle cx="50" cy="32" r="6" fill="${C.white}"/>` },
  { name: "cá voi xanh", tone: "c", svg: `
    <path d="M40 18 q2 -8 0 -12 M46 18 q4 -7 8 -9" stroke="#21918c" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M78 56 Q92 52 94 64 Q84 66 76 62" fill="#21918c" stroke="${O}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M10 56 Q10 28 44 28 Q82 28 84 52 Q84 64 70 68 Q40 76 18 66 Q10 62 10 56 Z"
      fill="#21918c" stroke="${O}" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="30" cy="44" r="5.5" fill="${C.white}"/><circle cx="30" cy="44" r="2.8" fill="${INK}"/>
    <path d="M16 54 q6 5 12 1" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M44 56 q4 4 8 0" stroke="${C.white}" stroke-width="3.5" fill="none" stroke-linecap="round"/>` },
];

function faceSVG(type) {
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${TYPES[type].svg}</svg>`;
}
let gridW = 10, gridH = 8; // kích thước lưới, đặt theo bố cục từng màn
const TILE_RATIO = 1.15;   // cao / rộng của ô
const STORE_KEY = "tileMatch3.players";
const SESSION_KEY = "tileMatch3.session";
const HERO_KEY = "tileMatch3.hero";

// ---------- TƯỚNG (thú cưng đồng hành) ----------
const HEROES = {
  meo: {
    icon: "🐱", name: "Mèo Mun", cost: 10,
    skill: "Chộp Gọn", skillHint: "Chạm vào một ô bất kỳ — cả bộ 3 của nó sẽ biến mất!",
    desc: "<b>Kỹ năng — Chộp Gọn:</b> chạm 1 ô bất kỳ (kể cả bị che), cả bộ 3 của nó biến mất và được điểm.<br><b>Nội tại:</b> ghép ô năng lượng ⚡ được nhân đôi điểm.",
  },
  cu: {
    icon: "🦉", name: "Cú Thông Thái", cost: 10,
    skill: "Mắt Sáng", skillHint: "Chạm vào một ô đang bị che — Cú sẽ lấy nó xuống khay!",
    desc: "<b>Kỹ năng — Mắt Sáng:</b> lấy 1 ô đang bị che xuống khay (nhìn xuyên mọi tầng).<br><b>Nội tại:</b> bắt đầu mỗi màn với sẵn 2 năng lượng.",
  },
  cun: {
    icon: "🐶", name: "Cún Vàng", cost: 10,
    skill: "Tha Về", skillHint: "",
    desc: "<b>Kỹ năng — Tha Về:</b> trả toàn bộ ô trong khay về bàn cờ, cứu bàn thua trông thấy.<br><b>Nội tại:</b> khay rộng 8 ô thay vì 7.",
  },
};

// ---------- DOM ----------
const $ = (id) => document.getElementById(id);
const screens = { home: $("screen-home"), game: $("screen-game") };
const boardEl = $("board");
const boardWrap = $("board-wrap");
const trayEl = $("tray");

// ---------- TRẠNG THÁI ----------
let players = loadPlayers();        // { name: {bestScore, maxLevel, games} }
let session = null;                 // { name, level, score, hero }
let tiles = [];                     // tile = {id, type, x, y, z, state, el}
let tray = [];                      // các tile đang nằm trong khay
let pickHistory = [];               // id các ô đã bốc (để hoàn tác)
let boosters = { undo: 0, shuffle: 0, popout: 0 };
let heroId = localStorage.getItem(HERO_KEY) || "meo";
let charges = 0;                    // năng lượng kỹ năng hiện có (vạch)
let chargeProg = 0;                 // tiến độ gom vạch: ghép đủ 3 bộ = 1 vạch
let manaType = -1;                  // loại ô năng lượng của màn này
let targeting = false;              // đang chờ chọn mục tiêu kỹ năng
let tileW = 50, tileH = 58, liftPx = 4;
let busy = false;                   // chặn thao tác khi đang xử lý animation
let gameOver = false;

const hero = () => HEROES[heroId];
// chế độ nhà phát triển: mở game với ?dev=1
const DEV = new URLSearchParams(location.search).has("dev");
let devTrayInf = false; // khay vô hạn (chỉ dev)
// ô thứ 8 đã mở chưa (lưu theo hồ sơ người chơi; sau này sẽ gắn quảng cáo)
const tray8Open = () => !!(session && players[session.name] && players[session.name].tray8);
const traySize = () =>
  devTrayInf ? Math.max(8, tray.length + 1)
             : (heroId === "cun" || tray8Open() ? 8 : 7); // nội tại Cún Vàng

// ============================================================
// LƯU TRỮ
// ============================================================
function loadPlayers() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch { return {}; }
}
function savePlayers() {
  localStorage.setItem(STORE_KEY, JSON.stringify(players));
}
function saveSession() {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

function ensurePlayer(name) {
  if (!players[name]) {
    players[name] = { bestScore: 0, maxLevel: 1, games: 0, lastPlayed: Date.now() };
  }
  players[name].lastPlayed = Date.now();
  savePlayers();
}

// ============================================================
// ÂM THANH (WebAudio, không cần file)
// ============================================================
let audioCtx = null;
function beep(freq, dur = 0.08, type = "sine", vol = 0.15) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur);
  } catch { /* trình duyệt chặn âm thanh thì bỏ qua */ }
}
const sndPick = () => beep(520, .07, "triangle");
const sndMatch = () => { beep(660, .09, "triangle"); setTimeout(() => beep(880, .12, "triangle"), 70); };
const sndSkill = () => { beep(440, .1, "square", .1); setTimeout(() => beep(740, .15, "square", .1), 90); };
const sndWin = () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .15, "triangle", .2), i * 120));
const sndLose = () => [392, 330, 262].forEach((f, i) => setTimeout(() => beep(f, .2, "sawtooth", .08), i * 160));

// ============================================================
// BỐ CỤC MÀN CHƠI — bản đồ độ cao thiết kế tay, bố cục thoáng:
// lõi dày ở giữa, vành ô rời bao quanh, tháp góc, khoảng trống có chủ đích.
// Mỗi ký tự = số tầng ô chồng tại vị trí đó ('.' = trống).
// ============================================================
// màn 1 — bản đồ riêng siêu nhỏ (~18 ô, 6 bộ), học luật nhanh nhưng vẫn thua được
const TUTORIAL = { name: "Khởi Động 🌱", map: [
  ".22.",
  "1331",
  "1331",
  ".22.",
]};

// từ màn 2 — LÕI THEO ĐẶC TẢ: 3 lõi 3-ô + 1 lõi 4-ô đan so le kiểu xây gạch
// (1 ô đè khe 2 ô, đảo chiều mỗi tầng) + 2 trụ đơn úp kín không thấy đáy.
// Support (viền + lớp phủ + xấp bài) sẽ cân chỉnh sau khi test lõi.
const PATTERNS = [
  { name: "Nhật Thực 🌘", map: [
    "..11111111..",
    "............",
    "...999......",
    "......999...",
    "...999......",
    "....bbbb....",
    "..e......e..",
    "............",
    "............",
    "..11111111..",
  ]},
  { name: "Trái Tim 💗", map: [
    "..11111111..",
    "............",
    "...999..e...",
    "......999...",
    "....bbbb....",
    "...999......",
    "........e...",
    "............",
    "............",
    "..11111111..",
  ]},
  { name: "Pháo Đài 🏰", map: [
    "..11111111..",
    "............",
    "..e......e..",
    "...999.999..",
    "....bbbb....",
    ".....999....",
    "............",
    "............",
    "............",
    "..11111111..",
  ]},
  { name: "Bươm Bướm 🦋", map: [
    "..11111111..",
    "............",
    "...999......",
    "..e.bbbb.e..",
    "......999...",
    "...999......",
    "............",
    "............",
    "............",
    "..11111111..",
  ]},
  { name: "Chiếc Nhẫn 💍", map: [
    "..11111111..",
    "............",
    "....999.....",
    "..999..999..",
    "....bbbb....",
    "...e....e...",
    "............",
    "............",
    "............",
    "..11111111..",
  ]},
  { name: "La Bàn 🧭", map: [
    "..11111111..",
    "............",
    "....999.....",
    "..e.bbbb.e..",
    "....999.....",
    "....999.....",
    "............",
    "............",
    "............",
    "..11111111..",
  ]},
];

// ============================================================
// CẤU HÌNH MÀN CHƠI — ít màn, mỗi màn dày dặn (~60-110 ô, vài phút/màn).
// Màn 1 là màn học chơi; từ màn 2 độ khó tăng mạnh:
// nhiều loại ô hơn hẳn (nặng trí nhớ) + lõi dày thêm tầng (nặng chiến thuật)
// ============================================================
function levelConfig(level) {
  // màn 1: sân tập học luật — 4 loại, 6 bộ, bộ 3 nằm gần nhau (vẫn thua được nếu bốc ẩu)
  if (level === 1) return { types: 4, tier: 0, spread: false };
  // từ màn 2: siêu khó ngay (khó 1 -> khó 90) — đủ 12 loại ô, bố cục đa cụm
  // đã cao sẵn trong bản đồ, bộ 3 RẢI XA khắp các cụm; màn sau chỉ nhích nhẹ
  return {
    types: 12, // 12/20 loại — cân với tổng ~165 ô (mỗi loại ~4.5 bộ)
    tier:  Math.min(3 + Math.floor((level - 2) / 4), 5),
    spread: true,
  };
}

// ============================================================
// SINH MÀN CHƠI
// ============================================================
function shuffleArr(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let patternName = "";

function generateLevel(level) {
  const cfg = levelConfig(level);
  const pattern = level === 1 ? TUTORIAL : PATTERNS[(level - 2) % PATTERNS.length];
  patternName = pattern.name;
  gridW = pattern.map[0].length;
  gridH = pattern.map.length;

  // dựng vị trí từ bản đồ độ cao; màn vòng sau lõi (chỗ cao >=2 tầng) dày thêm.
  // Xếp tầng kiểu "gạch lệch nửa ô": tầng lẻ lệch 0.5 nên ô dưới vẫn lộ một nửa
  // (có thông tin để tính chiến thuật); tầng chẵn cao co vào trong 1 vòng để lộ
  // mép tầng dưới. Chỉ cụm tháp hẹp mới chồng thẳng che kín — hiếm, tạo bất ngờ.
  const hMap = [];
  let maxH = 0;
  for (let y = 0; y < gridH; y++) {
    hMap.push([]);
    for (let x = 0; x < gridW; x++) {
      const ch = pattern.map[y][x];
      // độ cao ghi bằng ký tự base36: '1'-'9', 'a'=10, 'c'=12, 'e'=14...
      let h = ch === "." ? 0 : parseInt(ch, 36);
      // chỉ khối HẸP-SÂU (h>=4) mới dày thêm theo màn; phiến rộng luôn mỏng
      if (h >= 4) h = Math.min(h + cfg.tier, 16);
      // màn càng cao support càng mỏng/thưa dần (~2%/màn, tối đa -24%)
      // -> tỉ trọng lõi sâu tăng từ từ, màn 2 giữ nguyên độ khó hiện tại
      else if (h > 0 && Math.random() < Math.min(Math.max(level - 2, 0) * 0.02, 0.24)) h--;
      hMap[y].push(h);
      maxH = Math.max(maxH, h);
    }
  }
  const hAt = (x, y) => (x >= 0 && y >= 0 && x < gridW && y < gridH) ? hMap[y][x] : 0;

  // LÕI ĐAN SO LE KIỂU XÂY GẠCH: tầng chẵn nằm đúng lưới; tầng lẻ BẮT CẶP NGANG
  // — 1 ô đè lên khe của 2 ô dưới, hướng bắt cặp đảo chiều mỗi tầng lẻ
  // → cài răng lược "2 đè 1, 1 đè 2". Ô đơn không có bạn cặp thì chồng thẳng
  // (trụ úp kín — vùng mù của màn).
  let positions = [];
  for (let y = 0; y < gridH; y++) for (let x = 0; x < gridW; x++)
    if (hAt(x, y) > 0) positions.push({ x, y, z: 0 });

  for (let z = 1; z < maxH; z++) {
    if (z % 2 === 1) {
      const start = Math.floor(z / 2) % 2; // đảo chiều bắt cặp mỗi tầng lẻ
      const used = new Set();
      for (let y = 0; y < gridH; y++) {
        for (let x = start; x < gridW - 1; x++) {
          if (hAt(x, y) > z && hAt(x + 1, y) > z &&
              !used.has(x + "," + y) && !used.has((x + 1) + "," + y)) {
            positions.push({ x: x + 0.5, y, z });
            used.add(x + "," + y).add((x + 1) + "," + y);
            x++;
          }
        }
      }
      for (let y = 0; y < gridH; y++) for (let x = 0; x < gridW; x++)
        if (hAt(x, y) > z && !used.has(x + "," + y)) positions.push({ x, y, z });
    } else {
      // tầng chẵn: nằm đúng lưới trên mọi ô còn cao hơn z
      for (let y = 0; y < gridH; y++) for (let x = 0; x < gridW; x++)
        if (hAt(x, y) > z) positions.push({ x, y, z });
    }
  }

  // LỚP PHỦ "TƯỞNG BỞ": 1-2 lớp mỏng so le phủ lên vùng lõi lúc mở màn —
  // nhìn tưởng dễ ăn, bóc ra mới lộ tháp chùa đan cài và trụ mù bên dưới
  if (level >= 2) {
    let bx0 = 99, bx1 = -1, by0 = 99, by1 = -1;
    for (let y = 0; y < gridH; y++) for (let x = 0; x < gridW; x++)
      if (hMap[y][x] >= 6 && hMap[y][x] <= 14) {
        bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x);
        by0 = Math.min(by0, y); by1 = Math.max(by1, y);
      }
    if (bx1 >= 0) {
      bx0 = Math.max(0, bx0 - 1); bx1 = Math.min(gridW - 1, bx1 + 1);
      by0 = Math.max(0, by0 - 1); by1 = Math.min(gridH - 1, by1 + 1);
      for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++)
        positions.push({ x, y, z: maxH });
      for (let y = by0; y < by1; y++) for (let x = bx0; x < bx1; x++)
        positions.push({ x: x + 0.5, y: y + 0.5, z: maxH + 1 });
    }
  }
  // từ màn 2: thêm 2 "XẤP BÀI" nằm ngang dưới bàn cờ (như Doggo) —
  // cả xấp chồng lệch ngang, chỉ thấy và bốc được lá ngoài cùng
  if (level >= 2) {
    const len = 6 + cfg.tier;
    for (let k = 0; k < len; k++) {
      positions.push({ x: 0.3 + k * 0.4, y: gridH + 0.3, z: k, flat: true });
      positions.push({ x: gridW - 1.3 - k * 0.4, y: gridH + 0.3, z: k, flat: true });
    }
    gridH += 1.6; // chừa chỗ hiển thị hàng xấp bài
  }

  // bỏ vài ô lẻ cho chia hết 3 — bỏ ở tầng cao nhất, xa tâm nhất để giữ dáng hình
  const extra = positions.length % 3;
  if (extra) {
    positions.sort((a, b) =>
      b.z - a.z ||
      Math.hypot(b.x - gridW / 2 + .5, b.y - gridH / 2 + .5) -
      Math.hypot(a.x - gridW / 2 + .5, a.y - gridH / 2 + .5));
    positions.splice(0, extra);
  }
  const triples = positions.length / 3;

  // ĐUÔI MÀN HIỂM: các bộ cuối cùng (nằm sâu nhất, vùng cột úp mù) là các loại
  // KHÁC NHAU, mỗi loại đúng 1 bộ — cuối màn không còn "bản thứ 3 dễ kiếm",
  // phải ghi nhớ và tính trước, đào mò là tràn khay
  // (typePool được sắp xếp lại ở dưới, sau khi rút loại)

  // chọn loại ô từ nhóm icon dễ phân biệt nhất trước,
  // rút XEN KẼ tông nóng / lạnh để màn không bị "nóng rực" một tông
  const poolSize = Math.min(cfg.types + 2, TYPES.length);
  const pool = [...Array(poolSize).keys()];
  const warm = shuffleArr(pool.filter(i => TYPES[i].tone === "w"));
  const cool = shuffleArr(pool.filter(i => TYPES[i].tone !== "w")); // lạnh + trung tính
  const typeIds = [];
  let pickWarm = Math.random() < 0.5;
  while (typeIds.length < cfg.types && (warm.length || cool.length)) {
    const src = pickWarm ? (warm.length ? warm : cool) : (cool.length ? cool : warm);
    typeIds.push(src.pop());
    pickWarm = !pickWarm;
  }
  const typePool = shuffleArr([...Array(triples).keys()].map(t => typeIds[t % cfg.types]));
  if (cfg.spread) {
    // 40% đầu: bộ trộn tự do (đầu màn dễ). 60% sau: các bộ xếp VÒNG TRÒN đủ
    // 18 loại — hai bộ cùng loại cách nhau ~54 ô, vùng mù không bao giờ có
    // "bản thứ 3 nằm gần", phải nhớ và ôm ô lẻ rất lâu mới ghép được
    const easyCount = Math.ceil(triples * 0.55);
    const head = typePool.slice(0, easyCount);
    const rest = typePool.length - easyCount;
    const rr = [];
    let order = [];
    for (let i = 0; i < rest; i++) {
      if (!order.length) order = shuffleArr(typeIds.slice());
      rr.push(order.pop());
    }
    typePool.length = 0;
    typePool.push(...head, ...rr);
  }

  // "THÁO RỜI NGƯỢC": máy tự gỡ bàn cờ từng ô đang bốc được, cứ 3 ô gỡ liền
  // nhau thì gán cùng loại. Thứ tự tháo chính là một lời giải hợp lệ,
  // nên MỌI màn đều giải được bằng logic — thua là do tính sai, không phải do đen.
  const remaining = new Set(positions.map((_, i) => i));
  const pEffY = (p) => p.y - (p.flat ? 0 : p.z * LIFT_Y); // cùng luật che với lúc chơi
  const overlap = (a, b) =>
    Math.abs(a.x - b.x) < COVER && Math.abs(pEffY(a) - pEffY(b)) < COVER;
  const isFree = (i) => {
    for (const j of remaining) {
      if (j !== i && positions[j].z > positions[i].z && overlap(positions[i], positions[j])) return false;
    }
    return true;
  };
  const typeOf = new Array(positions.length);
  const solveOrder = []; // thứ tự tháo = một lời giải hợp lệ
  const dist = (a, b) =>
    Math.hypot(positions[a].x - positions[b].x, positions[a].y - positions[b].y) +
    Math.abs(positions[a].z - positions[b].z) * 2;
  // các bộ tháo TRƯỚC = chơi được SỚM (mặt ruộng): gom GẦN cho đầu màn vào guồng;
  // từ ~35% trở đi (vào lõi) mới rải XA — khó dần đều đúng nhịp Doggo
  // ===== THÁO RỜI XEN KẼ =====
  // Màn 1 / 35% đầu màn khó: bộ 3 tháo liên tiếp (đầu màn dễ vào guồng).
  // Từ giữa màn: cho phép 3 BỘ MỞ XEN KẼ — thành viên cùng bộ cách nhau
  // hàng chục nước, lời giải vẫn chỉ cần giữ tối đa ~7 ô khay (vẫn giải được),
  // nhưng người chơi buộc phải ôm ô lẻ và nhớ vị trí — đào mò là tràn khay.
  // "Mũi khoan": ưu tiên tháo ô vừa lộ ra -> khoan sâu một mạch, lệch pha độ sâu.
  const hot = [];
  const open = []; // các bộ đang mở dở {type, count}
  let poolIdx = 0, pickCount = 0;
  const totalPicks = positions.length;
  while (remaining.size) {
    const late = cfg.spread && pickCount >= totalPicks * 0.35;
    const free = [...remaining].filter(isFree);
    let pick;
    if (late) {
      while (hot.length && pick === undefined) {
        const j = hot.pop();
        if (remaining.has(j) && isFree(j)) pick = j;
      }
    }
    if (pick === undefined) pick = free[Math.floor(Math.random() * free.length)];

    const L = late ? 3 : 1; // số bộ được mở xen kẽ
    const needed = open.reduce((a, g) => a + (3 - g.count), 0);
    const canOpen = poolIdx < typePool.length && open.length < L &&
                    remaining.size >= needed + 3;
    let g;
    if (!open.length || (canOpen && Math.random() < 0.55)) {
      g = { type: typePool[poolIdx++], count: 0 };
      open.push(g);
    } else {
      g = open[Math.floor(Math.random() * open.length)];
    }
    typeOf[pick] = g.type;
    solveOrder.push(pick);
    if (++g.count === 3) open.splice(open.indexOf(g), 1);
    remaining.delete(pick);
    pickCount++;
    for (const j of remaining) if (overlap(positions[pick], positions[j])) hot.push(j);
  }
  if (DEV) {
    window.__SOLUTION = solveOrder; // cho phép test tự động chơi theo lời giải
    window.__SNAPSHOT = () => tiles.map(t => ({ id: t.id, type: t.type, x: t.x, y: t.y, z: t.z, flat: t.flat }));
  }

  tiles = positions.map((p, i) => ({
    id: i, type: typeOf[i], x: p.x, y: p.y, z: p.z, flat: !!p.flat, state: "board", el: null,
  }));

  // chọn loại ô năng lượng ⚡ của màn này
  manaType = typeIds[Math.floor(Math.random() * typeIds.length)];
}

// ============================================================
// RENDER BÀN CỜ
// ============================================================
function computeSizes() {
  const w = boardWrap.clientWidth - 16;
  const h = boardWrap.clientHeight - 16;
  const unitsW = gridW + 0.2;
  const unitsH = gridH + 1.6; // chừa chỗ cho độ nâng tầng (mái ngói chồng sâu ~14 tầng)
  tileW = Math.floor(Math.min(w / unitsW, h / (unitsH * TILE_RATIO)));
  tileW = Math.max(30, Math.min(tileW, 78));
  tileH = Math.round(tileW * TILE_RATIO);
  liftPx = Math.round(tileW * 0.1);

  const boardW = unitsW * tileW;
  const boardH = unitsH * tileH;
  boardEl.style.width = boardW + "px";
  boardEl.style.height = boardH + "px";
  boardEl.style.left = Math.max(0, (boardWrap.clientWidth - boardW) / 2) + "px";
  boardEl.style.top = Math.max(0, (boardWrap.clientHeight - boardH) / 2) + "px";
}

// vị trí Y "mắt nhìn thấy": ô tầng cao được vẽ trồi lên trên một chút mỗi tầng,
// nên luật che phải tính theo đúng chỗ ô hiển thị — thấy hở là bấm được.
// Chỉ tính là CHE khi đè ít nhất ~1/3 thân ô theo CẢ HAI trục;
// chạm mép vài phần trăm (góc dính sliver) thì vẫn bấm được.
const LIFT_Y = 0.1 / TILE_RATIO;
const COVER = 0.7; // |lệch| < 0.7 ô = phần đè > 30%
const effY = (t) => t.y - (t.flat ? 0 : t.z * LIFT_Y);

function tileFree(t) {
  return !tiles.some(o =>
    o.state === "board" && o.z > t.z &&
    Math.abs(o.x - t.x) < COVER && Math.abs(effY(o) - effY(t)) < COVER
  );
}

function positionTileEl(t) {
  t.el.style.width = tileW + "px";
  t.el.style.height = tileH + "px";
  t.el.style.left = (t.x * tileW + tileW * 0.1) + "px";
  // xấp bài ngang nằm phẳng, không nâng theo tầng
  t.el.style.top = (t.y * tileH - (t.flat ? 0 : t.z * liftPx) + tileH * 1.5) + "px";
  t.el.style.zIndex = t.z * 1000 + Math.round(t.y * 2) * 20 + Math.round(t.x * 2);
}

function renderBoard() {
  boardEl.innerHTML = "";
  computeSizes();
  for (const t of tiles) {
    if (t.state !== "board") continue;
    const el = document.createElement("div");
    el.className = "tile" + (t.type === manaType ? " mana" : "");
    el.dataset.type = t.type;
    el.dataset.id = t.id;
    el.innerHTML = faceSVG(t.type);
    el.addEventListener("pointerdown", () => onTileTap(t));
    t.el = el;
    positionTileEl(t);
    boardEl.appendChild(el);
  }
  refreshLocks();
}

function refreshLocks() {
  for (const t of tiles) {
    if (t.state === "board" && t.el) {
      t.el.classList.toggle("locked", !tileFree(t));
    }
  }
}

// ============================================================
// KHAY (TRAY)
// ============================================================
function trayMetrics() {
  // luôn vẽ đủ 8 ngăn để người chơi thấy rõ giới hạn (ngăn 8 khóa "+1")
  const n = Math.max(8, traySize());
  const inner = trayEl.clientWidth - 12;
  const slotW = Math.floor(inner / n) - 4;
  return { slotW: Math.min(slotW, 56), pad: 6, n };
}

function renderTray() {
  trayEl.innerHTML = "";
  const { slotW, pad, n } = trayMetrics();
  const step = slotW + 4;
  const usable = traySize();
  for (let i = 0; i < n; i++) {
    const s = document.createElement("div");
    if (i < usable) {
      s.className = "tray-slot";
    } else {
      // ngăn thứ 8 đang khóa — bấm là mở luôn (chưa có quảng cáo;
      // sau này gắn SDK ads thì gọi mở khóa trong callback xem xong quảng cáo)
      s.className = "tray-slot tray-lock";
      s.innerHTML = `<b>+1</b><span class="lock-ad">▶</span>`;
      s.addEventListener("pointerdown", () => {
        if (!session || !players[session.name]) return;
        players[session.name].tray8 = true;
        savePlayers();
        sndMatch();
        renderTray();
        toast("🎉 Đã mở ô thứ 8 cho khay!");
      });
    }
    s.style.left = (pad + i * step) + "px";
    s.style.width = slotW + "px";
    trayEl.appendChild(s);
  }
  tray.forEach((t, i) => {
    const el = document.createElement("div");
    el.className = "tray-tile";
    el.dataset.type = t.type;
    el.style.left = (pad + i * step) + "px";
    el.style.width = slotW + "px";
    el.innerHTML = faceSVG(t.type);
    trayEl.appendChild(el);
  });
}

// ============================================================
// THÔNG BÁO NỔI
// ============================================================
let toastTimer = null;
function toast(msg, sticky = false) {
  const el = $("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  if (!sticky) toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
}
function hideToast() {
  clearTimeout(toastTimer);
  $("toast").classList.remove("show");
}

// ============================================================
// LUỒNG CHƠI CHÍNH
// ============================================================
function onTileTap(t) {
  if (targeting) { handleSkillTarget(t); return; }
  pickTile(t);
}

function pickTile(t) {
  if (busy || gameOver || t.state !== "board" || !tileFree(t)) return;
  sndPick();
  moveToTray(t);
  pickHistory.push(t.id);
  refreshLocks();
  renderTray();
  resolveTray();
}

function moveToTray(t) {
  t.state = "tray";
  if (t.el) { t.el.remove(); t.el = null; }
  // chèn cạnh ô cùng loại cho dễ nhìn
  let idx = -1;
  for (let i = tray.length - 1; i >= 0; i--) {
    if (tray[i].type === t.type) { idx = i + 1; break; }
  }
  if (idx === -1) tray.push(t); else tray.splice(idx, 0, t);
}

function gainCharge(type) {
  // ghép đủ 3 bộ mới được 1 vạch năng lượng; bộ ô năng lượng ⚡ tính gấp đôi
  chargeProg += type === manaType ? 2 : 1;
  while (chargeProg >= 2) {
    chargeProg -= 2;
    charges = Math.min(charges + 1, hero().cost);
  }
  updateSkillUI();
}

function matchPoints(type) {
  let pts = 10 * session.level;
  // nội tại Mèo Mun: ô năng lượng x2 điểm
  if (heroId === "meo" && type === manaType) pts *= 2;
  return pts;
}

function resolveTray() {
  // tìm 3 ô cùng loại
  const count = {};
  for (const t of tray) count[t.type] = (count[t.type] || 0) + 1;
  const matchType = Object.keys(count).find(k => count[k] >= 3);

  if (matchType !== undefined) {
    busy = true;
    const matched = tray.filter(t => t.type === +matchType).slice(0, 3);
    // animation biến mất
    [...trayEl.querySelectorAll(".tray-tile")].forEach((el, i) => {
      if (matched.includes(tray[i])) el.classList.add("vanish");
    });
    setTimeout(() => {
      sndMatch();
      matched.forEach(t => { t.state = "gone"; });
      tray = tray.filter(t => t.state !== "gone");
      session.score += matchPoints(+matchType);
      gainCharge(+matchType);
      updateHud();
      saveSession();
      renderTray();
      busy = false;
      checkEnd();
    }, 300);
  } else {
    checkEnd();
  }
}

function checkEnd() {
  if (gameOver) return;
  const boardLeft = tiles.some(t => t.state === "board");

  if (!boardLeft && tray.length === 0) {
    // ===== THẮNG =====
    gameOver = true;
    sndWin();
    const bonus = 50 * session.level;
    session.score += bonus;
    updateHud();
    const p = players[session.name];
    if (session.level + 1 > p.maxLevel) p.maxLevel = session.level + 1;
    if (session.score > p.bestScore) p.bestScore = session.score;
    savePlayers();
    const beatLv2 = session.level === 2;
    session.level += 1;
    saveSession();
    $("win-info").innerHTML = beatLv2
      ? `<div class="win-elite">👑 BẠN CHÍNH THỨC LÀ 1%!<br>Vượt màn chỉ 1/100 người qua nổi.</div>
         Chụp màn hình khoe bạn bè đi! Thưởng +${bonus} điểm — Tổng: ${session.score}`
      : `Thưởng +${bonus} điểm! Tổng điểm: ${session.score}`;
    setTimeout(() => $("modal-win").classList.add("active"), 450);
  } else if (tray.length >= traySize()) {
    // ===== THUA =====
    gameOver = true;
    sndLose();
    const p = players[session.name];
    p.games += 1;
    if (session.level === 2) p.lv2tries = (p.lv2tries || 0) + 1;
    if (session.score > p.bestScore) p.bestScore = session.score;
    savePlayers();
    $("lose-info").innerHTML = session.level === 2
      ? `Thử thách 1% — lần thử thứ <b>${p.lv2tries}</b>.<br>
         99% bỏ cuộc ở đúng chỗ này. Còn bạn? 😏<br>Điểm: ${session.score} — Kỷ lục: ${p.bestScore}`
      : `Điểm đạt được: ${session.score} — Kỷ lục của bạn: ${p.bestScore}`;
    setTimeout(() => $("modal-lose").classList.add("active"), 450);
  }
}

// ============================================================
// KỸ NĂNG TƯỚNG
// ============================================================
function updateSkillUI() {
  const h = hero();
  $("skill-icon").textContent = h.icon;
  $("skill-name").textContent = h.skill;
  $("cnt-skill").textContent = `${charges}/${h.cost}`;
  $("charge-fill").style.width = (charges / h.cost * 100) + "%";
  const ready = charges >= h.cost && !gameOver;
  $("btn-skill").classList.toggle("ready", ready);
  $("btn-skill").classList.toggle("targeting", targeting);
  $("btn-skill").disabled = !ready && !targeting;
}

function onSkillButton() {
  if (busy || gameOver) return;
  if (targeting) { stopTargeting(); return; }
  if (charges < hero().cost) return;

  if (heroId === "cun") {
    // Tha Về: không cần chọn mục tiêu — trả toàn bộ khay về bàn
    if (tray.length === 0) { toast("Khay đang trống mà! 🐶"); return; }
    charges = 0;
    sndSkill();
    returnTilesToBoard(tray.splice(0, tray.length));
    renderBoard();
    renderTray();
    updateSkillUI();
    toast("🐶 Cún Vàng đã tha hết ô về bàn cờ!");
  } else {
    // Mèo Mun / Cú Thông Thái: cần chọn mục tiêu
    targeting = true;
    boardEl.classList.add("targeting");
    toast(hero().skillHint, true);
    updateSkillUI();
  }
}

function stopTargeting() {
  targeting = false;
  boardEl.classList.remove("targeting");
  hideToast();
  updateSkillUI();
}

function handleSkillTarget(t) {
  if (t.state !== "board") return;

  if (heroId === "meo") {
    // Chộp Gọn: xóa cả bộ 3 của ô được chọn (ưu tiên ô trong khay trước)
    stopTargeting();
    charges = 0;
    sndSkill();
    const sameTray = tray.filter(x => x.type === t.type);
    const sameBoard = tiles.filter(x => x.state === "board" && x.type === t.type && x !== t);
    const victims = [t, ...sameTray, ...sameBoard].slice(0, 3);
    victims.forEach(v => {
      v.state = "gone";
      if (v.el) { v.el.classList.add("vanish"); setTimeout(() => v.el && v.el.remove(), 300); }
    });
    tray = tray.filter(x => x.state !== "gone");
    session.score += matchPoints(t.type);
    updateHud();
    saveSession();
    setTimeout(() => {
      refreshLocks();
      renderTray();
      updateSkillUI();
      checkEnd();
    }, 320);
  } else if (heroId === "cu") {
    // Mắt Sáng: chỉ có ý nghĩa với ô đang bị che
    if (tileFree(t)) { toast("Ô này bốc được luôn mà — hãy chọn ô đang bị che! 🦉"); return; }
    stopTargeting();
    charges = 0;
    sndSkill();
    moveToTray(t);
    pickHistory.push(t.id);
    refreshLocks();
    renderTray();
    updateSkillUI();
    resolveTray();
  }
}

function returnTilesToBoard(list) {
  const maxZ = Math.max(0, ...tiles.filter(t => t.state === "board").map(t => t.z)) + 1;
  const spots = [];
  for (let gx = 1; gx < gridW - 1; gx++)
    for (let gy = 1; gy < gridH - 2; gy++) // chừa hàng xấp bài phía dưới
      spots.push({ x: gx, y: gy });
  shuffleArr(spots);
  list.forEach((t, i) => {
    const s = spots[i] || { x: 2 + i, y: 2 };
    t.x = s.x; t.y = s.y; t.z = maxZ;
    t.state = "board";
  });
}

// ============================================================
// BOOSTERS
// ============================================================
function updateBoosterUI() {
  $("cnt-undo").textContent = boosters.undo;
  $("cnt-shuffle").textContent = boosters.shuffle;
  $("cnt-popout").textContent = boosters.popout;
  $("btn-undo").disabled = boosters.undo <= 0;
  $("btn-shuffle").disabled = boosters.shuffle <= 0;
  $("btn-popout").disabled = boosters.popout <= 0;
}

function useUndo() {
  if (busy || gameOver || targeting || boosters.undo <= 0) return;
  // tìm ô bốc gần nhất vẫn còn trong khay
  while (pickHistory.length) {
    const id = pickHistory.pop();
    const t = tiles.find(x => x.id === id);
    if (t && t.state === "tray") {
      boosters.undo--;
      tray = tray.filter(x => x !== t);
      t.state = "board";
      renderBoard();
      renderTray();
      updateBoosterUI();
      sndPick();
      return;
    }
  }
}

function useShuffle() {
  if (busy || gameOver || targeting || boosters.shuffle <= 0) return;
  const boardTiles = tiles.filter(t => t.state === "board");
  if (boardTiles.length < 2) return;
  boosters.shuffle--;
  const typesLeft = shuffleArr(boardTiles.map(t => t.type));
  boardTiles.forEach((t, i) => { t.type = typesLeft[i]; });
  renderBoard();
  updateBoosterUI();
  sndPick();
}

function usePopout() {
  if (busy || gameOver || targeting || boosters.popout <= 0 || tray.length === 0) return;
  boosters.popout--;
  // trả tối đa 3 ô đầu khay về bàn cờ, đặt lên tầng cao nhất
  returnTilesToBoard(tray.splice(0, 3));
  renderBoard();
  renderTray();
  updateBoosterUI();
  sndPick();
}

// ============================================================
// HUD + VÒNG ĐỜI MÀN CHƠI
// ============================================================
function updateHud() {
  $("hud-level").textContent = session.level;
  $("hud-score").textContent = session.score;
  $("hud-mana").innerHTML = manaType >= 0 ? faceSVG(manaType) : "?";
}

function startLevel() {
  gameOver = false;
  busy = false;
  targeting = false;
  boardEl.classList.remove("targeting");
  hideToast();
  tray = [];
  pickHistory = [];
  // mỗi màn được cộng thêm lượt trợ giúp (tích trữ tối đa 3 — màn khó phải dè sẻn)
  boosters.undo = Math.min(boosters.undo + 1, 3);
  boosters.shuffle = Math.min(boosters.shuffle + 1, 3);
  boosters.popout = Math.min(boosters.popout + 1, 3);
  // nội tại Cú Thông Thái: vào màn có sẵn 2 vạch năng lượng
  charges = heroId === "cu" ? 2 : 0;
  chargeProg = 0;

  generateLevel(session.level);
  updateHud();
  updateBoosterUI();
  updateSkillUI();
  renderTray();
  renderBoard();
  toast(`Màn ${session.level} — bố cục ${patternName}`);

  // HOOK "Thử thách 1%": màn 2 là bức tường — nêu thẳng thách thức
  if (session.level === 2) {
    const tries = players[session.name].lv2tries || 0;
    $("challenge-tries").innerHTML = tries > 0
      ? `Đây là lần thử thứ <b>${tries + 1}</b> của bạn. Bỏ cuộc là thành 99% đó nha…`
      : `Chưa ai trong máy này làm được. Bạn là người đầu tiên?`;
    $("modal-challenge").classList.add("active");
  }
}

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function startGame(name) {
  ensurePlayer(name);
  const prev = loadSession();
  if (prev && prev.name === name) {
    session = prev; // chơi tiếp màn đang dở
  } else {
    session = { name, level: players[name].maxLevel || 1, score: 0 };
  }
  session.hero = heroId;
  boosters = { undo: 1, shuffle: 1, popout: 1 };
  saveSession();
  showScreen("game");
  // đợi layout ổn định rồi mới đo kích thước
  requestAnimationFrame(startLevel);
}

// ============================================================
// BẢNG XẾP HẠNG
// ============================================================
function renderLeaderboard() {
  const list = $("rank-list");
  const rows = Object.entries(players)
    .map(([name, p]) => ({ name, ...p }))
    .filter(p => p.bestScore > 0 || p.maxLevel > 1)
    .sort((a, b) => b.bestScore - a.bestScore || b.maxLevel - a.maxLevel)
    .slice(0, 20);

  if (rows.length === 0) {
    list.innerHTML = `<div class="rank-empty">Chưa có ai chơi cả.<br>Hãy là người đầu tiên! 🎮</div>`;
    return;
  }
  const medals = ["🥇", "🥈", "🥉"];
  const me = session ? session.name : $("player-name").value.trim();
  list.innerHTML = rows.map((p, i) => `
    <div class="rank-row${p.name === me ? " me" : ""}">
      <div class="rank-pos">${medals[i] || (i + 1)}</div>
      <div class="rank-name">${escapeHtml(p.name)}</div>
      <div class="rank-level">Màn ${p.maxLevel}</div>
      <div class="rank-score">⭐ ${p.bestScore}</div>
    </div>`).join("");
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderPlayerChips() {
  const wrap = $("player-list");
  const names = Object.entries(players)
    .sort((a, b) => (b[1].lastPlayed || 0) - (a[1].lastPlayed || 0))
    .slice(0, 6)
    .map(([n]) => n);
  wrap.innerHTML = names.map(n =>
    `<button class="player-chip" data-name="${escapeHtml(n)}">${escapeHtml(n)}</button>`).join("");
  wrap.querySelectorAll(".player-chip").forEach(b =>
    b.addEventListener("click", () => { $("player-name").value = b.dataset.name; }));
}

// ============================================================
// CHỌN TƯỚNG (màn hình chính)
// ============================================================
function renderHeroSelect() {
  const wrap = $("hero-list");
  wrap.innerHTML = Object.entries(HEROES).map(([id, h]) => `
    <button class="hero-card${id === heroId ? " selected" : ""}" data-hero="${id}">
      ${h.icon}<b>${h.name}</b>
    </button>`).join("");
  wrap.querySelectorAll(".hero-card").forEach(b =>
    b.addEventListener("click", () => {
      heroId = b.dataset.hero;
      localStorage.setItem(HERO_KEY, heroId);
      renderHeroSelect();
    }));
  $("hero-desc").innerHTML = HEROES[heroId].desc;
}

// ============================================================
// SỰ KIỆN
// ============================================================
$("btn-play").addEventListener("click", () => {
  const name = $("player-name").value.trim();
  if (!name) {
    $("player-name").focus();
    $("player-name").placeholder = "⚠ Hãy nhập tên trước!";
    return;
  }
  startGame(name);
});

$("btn-home").addEventListener("click", () => {
  saveSession();
  renderPlayerChips();
  renderHeroSelect();
  showScreen("home");
});

$("btn-leaderboard").addEventListener("click", () => {
  renderLeaderboard();
  $("modal-rank").classList.add("active");
});
$("btn-rank-close").addEventListener("click", () => $("modal-rank").classList.remove("active"));

$("btn-next").addEventListener("click", () => {
  $("modal-win").classList.remove("active");
  startLevel();
});

$("btn-retry").addEventListener("click", () => {
  $("modal-lose").classList.remove("active");
  session.score = 0;
  saveSession();
  startLevel();
});

$("btn-lose-home").addEventListener("click", () => {
  $("modal-lose").classList.remove("active");
  session.score = 0;
  saveSession();
  renderPlayerChips();
  renderHeroSelect();
  showScreen("home");
});

$("btn-challenge-go").addEventListener("click", () => $("modal-challenge").classList.remove("active"));

$("btn-skill").addEventListener("click", onSkillButton);
$("btn-undo").addEventListener("click", useUndo);
$("btn-shuffle").addEventListener("click", useShuffle);
$("btn-popout").addEventListener("click", usePopout);

// tự động phóng to vừa khung màn hình — người chơi không cần biết zoom thủ công
function applyZoom() {
  const z = Math.max(1, Math.min(window.innerWidth / 660, window.innerHeight / 980, 2.4));
  document.body.style.zoom = z;
}

window.addEventListener("resize", () => {
  applyZoom();
  if (screens.game.classList.contains("active") && !gameOver) {
    renderBoard();
    renderTray();
  }
});

// ===== CHẾ ĐỘ NHÀ PHÁT TRIỂN =====
if (DEV) {
  document.body.classList.add("dev");

  $("dev-win").addEventListener("click", () => {
    if (!session || gameOver) return;
    tiles.forEach(t => { t.state = "gone"; });
    tray = [];
    boardEl.innerHTML = "";
    renderTray();
    checkEnd(); // bàn sạch + khay rỗng -> kích hoạt luồng thắng thật
  });

  const devJump = (d) => {
    if (!session) return;
    $("modal-win").classList.remove("active");
    $("modal-lose").classList.remove("active");
    session.level = Math.max(1, session.level + d);
    saveSession();
    startLevel();
  };
  $("dev-prev").addEventListener("click", () => devJump(-1));
  $("dev-next").addEventListener("click", () => devJump(1));

  $("dev-tray").addEventListener("click", () => {
    devTrayInf = !devTrayInf;
    $("dev-tray-state").textContent = devTrayInf ? "ON" : "OFF";
    renderTray();
  });

  $("dev-mana").addEventListener("click", () => {
    if (!session) return;
    charges = hero().cost;
    updateSkillUI();
  });

  $("dev-boost").addEventListener("click", () => {
    boosters.undo += 5; boosters.shuffle += 5; boosters.popout += 5;
    updateBoosterUI();
  });
}

// ngăn double-tap zoom trên iOS
document.addEventListener("dblclick", e => e.preventDefault(), { passive: false });

// ---------- KHỞI ĐỘNG ----------
applyZoom();
renderPlayerChips();
renderHeroSelect();
const last = loadSession();
if (last && last.name) $("player-name").value = last.name;

})();
