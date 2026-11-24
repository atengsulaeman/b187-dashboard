// Generator peta kisah hidup Atsu -> lib/journey-svg.js
// Jalankan bila rute/adegan diubah:
//   npm i --no-save world-atlas@2 topojson-client d3-geo d3-shape svg-path-properties
//   node scripts/build-journey.mjs
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import * as topo from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import { line, curveCatmullRom } from "d3-shape";
import { svgPathProperties } from "svg-path-properties";

const require = createRequire(import.meta.url);
const world = require("world-atlas/countries-50m.json");

// ---------- kanvas ----------
const W = 900, MH = 380, TOP = 52, BOT = 56, H = TOP + MH + BOT;
const r1 = (n) => Math.round(n * 10) / 10;
const f4 = (n) => +n.toFixed(4);
const esc = (x) => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const countries = topo.feature(world, world.objects.countries).features;
const idn = countries.find((f) => f.id === "360");
const proj = geoMercator().fitExtent([[48, 14], [W - 14, MH - 14]], idn);
const gp = geoPath(proj);
const roundPath = (d) => d.replace(/-?\d+\.\d+/g, (m) => r1(+m));
const P = (c) => proj(c).map(r1);
const NEIGH = ["458", "096", "626", "598", "702", "608"];
const neighD = countries.filter((f) => NEIGH.includes(f.id)).map((f) => roundPath(gp(f) || "")).join("");
const idnD = roundPath(gp(idn));

// ---------- tempat ----------
const C = {
  tasik: [108.22, -7.33], serang: [106.15, -6.12], sukabumi: [106.93, -6.92],
  jaksel: [106.81, -6.27], bekasi: [107.0, -6.24], jakarta: [106.85, -6.2], cgk: [106.65, -6.13],
  tangerang: [106.63, -6.18], pamulang: [106.72, -6.34], depok: [106.82, -6.4], bogor: [106.8, -6.6],
  merak: [106.0, -5.93], bakauheni: [105.75, -5.87], lampung: [105.26, -5.43], palembang: [104.75, -2.98],
  jambi: [103.61, -1.61], sgelam: [103.78, -1.66], pekanbaru: [101.45, 0.51], medan: [98.67, 3.59],
  takengon: [96.85, 4.62], idi: [97.75, 4.95], lhokseumawe: [97.15, 5.18],
  uleelheue: [95.29, 5.56], balohan: [95.36, 5.84], km0: [95.21, 5.905],
  karimun: [103.43, 1.0], priok: [106.88, -6.1],
  pkb: [111.67, -2.7], lamandau: [111.13, -2.13], palangka: [113.92, -2.21], kapuas: [114.38, -3.0], bdj: [114.59, -3.32],
  ternate: [127.38, 0.79], sofifi: [127.57, 0.73], lelilef: [127.94, 0.46],
};
const pt = (k) => (Array.isArray(k) ? P(k) : P(C[k]));
const curve = (ks) => roundPath(line().curve(curveCatmullRom.alpha(0.5))(ks.map(pt)));
const straight = (a, b) => { const A = pt(a), B = pt(b); return `M${A[0]},${A[1]}L${B[0]},${B[1]}`; };
const arc = (a, b, lift) => { const A = pt(a), B = pt(b); return `M${A[0]},${A[1]}Q${r1((A[0] + B[0]) / 2)},${r1(Math.min(A[1], B[1]) - lift)} ${B[0]},${B[1]}`; };

// ---------- warna & ikon (tampak atas, menghadap +x) ----------
const COL = { bus: "#9CA3AF", motor: "#FFB020", ferry: "#00F5FF", plane: "#F8FAFC", car: "#3ECF8E", ojol: "#3ECF8E", taxi: "#F5B700", tronton: "#FF6B3D", truck: "#8B5CF6", pink: "#FF007F", edu: "#00F5FF" };
const motorIcon = (c) => `<ellipse rx="5.5" ry="1.6" fill="${c}"/><rect x="3.5" y="-2.6" width="1.2" height="5.2" rx=".5" fill="${c}"/><circle r="1.6" fill="#F8FAFC"/>`;
const carIcon = (c) => `<rect x="-5" y="-2.6" width="10" height="5.2" rx="1.6" fill="${c}"/><rect x="0.5" y="-2" width="2.6" height="4" rx=".6" fill="#0D1117"/>`;
const ICON = {
  bus: `<rect x="-7" y="-2.8" width="14" height="5.6" rx="1.2" fill="${COL.bus}"/><rect x="-5.5" y="-1.8" width="9" height="3.6" fill="#374151"/><rect x="4.5" y="-2" width="1.6" height="4" fill="#00F5FF"/>`,
  motor: motorIcon(COL.motor), ojol: motorIcon(COL.ojol),
  ferry: `<path d="M-8,-3.2H5L8.5,0L5,3.2H-8Z" fill="#E5F9FF"/><rect x="-6" y="-2" width="7" height="4" rx=".6" fill="${COL.ferry}"/><ellipse cx="-2.5" rx="2.6" ry=".9" fill="${COL.motor}"/>`,
  ferryNoBike: `<path d="M-8,-3.2H5L8.5,0L5,3.2H-8Z" fill="#E5F9FF"/><rect x="-6" y="-2" width="7" height="4" rx=".6" fill="${COL.ferry}"/>`,
  plane: `<path d="M8,0L5,-1H1.5L-2,-7H-3.6L-1.6,-1H-5L-6.6,-3H-7.6L-6.8,0L-7.6,3H-6.6L-5,1H-1.6L-3.6,7H-2L1.5,1H5Z" fill="${COL.plane}"/>`,
  car: carIcon(COL.car), taxi: carIcon(COL.taxi),
  tronton: `<rect x="-9" y="-2.8" width="13" height="5.6" rx=".5" fill="${COL.tronton}"/><rect x="4.4" y="-2.6" width="4" height="5.2" rx=".8" fill="#F8FAFC"/>`,
  truck: `<rect x="-7" y="-3.2" width="10" height="6.4" rx=".6" fill="${COL.truck}"/><rect x="3.6" y="-3" width="4.4" height="6" rx=".8" fill="#F8FAFC"/><rect x="-6" y="-2.4" width="8" height="4.8" fill="#B5651D"/>`,
};
const TRAIL = { bus: COL.bus, motor: COL.motor, ferry: COL.ferry, ferryNoBike: COL.ferry, plane: COL.plane, car: COL.car, ojol: COL.ojol, taxi: COL.taxi, tronton: COL.tronton };
const MODE = { bus: "BUS", motor: "MOTOR", ferry: "MOTOR + FERI", ferryNoBike: "FERI", plane: "PESAWAT", car: "MOBIL", ojol: "OJOL", taxi: "TAKSI ONLINE", tronton: "TRONTON" };

// ---------- kamera ----------
const box = (ks, pad) => {
  const xy = ks.map(pt); const xs = xy.map((p) => p[0]), ys = xy.map((p) => p[1]);
  let x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
  let w = x1 - x0, h = y1 - y0; const ar = W / MH;
  if (w / h < ar) { const nw = h * ar; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / ar; y0 -= (nh - h) / 2; h = nh; }
  return [r1(x0), r1(y0), r1(w), r1(h)];
};
const CAMS = {
  FULL: [0, 0, W, MH],
  WJAVA: box(["tasik", "serang", "sukabumi", "bekasi"], 10),
  SUNDA: box(["merak", "bakauheni", "lampung"], 16),
  ACEH: box(["takengon", "idi", "km0"], 10),
  JAVASEA: box(["cgk", "pkb", "bdj", "kapuas"], 14),
  KALI: box(["pkb", "lamandau", "kapuas", "bdj"], 14),
  JABO: box(["tangerang", "bekasi", "bogor", "jakarta"], 5),
  HALMA: box(["ternate", "sofifi", "lelilef"], 8),
};

// ---------- adegan (berurutan) ----------
// m: moda (null = jeda), d: rute, cam: kamera, act/sub: caption
const A1 = "BABAK 1 · SEKOLAH", A2 = "BABAK 2 · MERANTAU", A3 = "BABAK 3 · VENDOR PLN", A4 = "BABAK 4 · JALANAN JABODETABEK", A5 = "BABAK 5 · KE TIMUR";
const S = [
  { dur: 1.6, m: null, at: "tasik", cam: "WJAVA", act: A1, sub: "SD & SMP · Tasikmalaya", col: COL.edu },
  { dur: 1.6, m: "bus", d: curve(["tasik", [107.4, -6.9], "serang"]), cam: "WJAVA", act: A1, sub: "MTs · Serang", col: COL.edu },
  { dur: 1.4, m: "bus", d: curve(["serang", [106.5, -6.6], "sukabumi"]), cam: "WJAVA", act: A1, sub: "SMA · Sukabumi", col: COL.edu },
  { dur: 1.4, m: "bus", d: curve(["sukabumi", "bogor", "jaksel"]), cam: "WJAVA", act: A2, sub: "Cleaning service · Jakarta Selatan", col: COL.bus },
  { dur: 1.1, m: "bus", d: straight("jaksel", "bekasi"), cam: "WJAVA", act: A2, sub: "Pekerja konstruksi · Bekasi", col: COL.bus },
  { dur: 1.0, m: "bus", d: curve(["bekasi", [107.0, -6.6], "sukabumi"]), cam: "WJAVA", act: A2, sub: "Pulang ke Sukabumi, ambil motor", col: COL.bus, trail: false },
  { dur: 1.3, m: "motor", d: curve(["sukabumi", "serang", "merak"]), cam: "SUNDA", act: A3, sub: "Bawa motor dari Sukabumi ke Aceh", col: COL.motor },
  { dur: 1.5, m: "ferry", d: straight("merak", "bakauheni"), cam: "SUNDA", act: A3, sub: "Menyeberang Merak → Bakauheni", col: COL.ferry },
  { dur: 4.4, m: "motor", d: curve(["bakauheni", "lampung", "palembang", "jambi", "pekanbaru", "medan", "takengon"]), cam: "FULL", act: A3, sub: "Menyusuri Sumatra · PLN Takengon, Aceh Tengah", col: COL.motor },
  { dur: 1.3, m: "motor", d: curve(["takengon", [97.35, 4.85], "idi"]), cam: "ACEH", act: A3, sub: "PLN Idi, Aceh Timur · dirikan MXRC & SMATC", col: COL.motor },
  { dur: 1.5, m: "motor", d: curve(["idi", "lhokseumawe", "uleelheue"]), cam: "ACEH", act: A3, sub: "Menuju ujung barat Indonesia", col: COL.motor },
  { dur: 1.3, m: "ferry", d: straight("uleelheue", "balohan"), cam: "ACEH", act: A3, sub: "Menyeberang ke Pulau Weh", col: COL.ferry },
  { dur: 0.7, m: "motor", d: curve(["balohan", [95.28, 5.89], "km0"]), cam: "ACEH", act: A3, sub: "Tugu Kilometer Nol", col: COL.motor },
  { dur: 2.2, m: null, at: "km0", cam: "ACEH", act: "KM 0 · SABANG", sub: "Sertifikat bikers Kilometer Nol Indonesia ✓", col: COL.pink, badge: true },
  { dur: 0.6, m: "motor", d: curve(["km0", [95.28, 5.89], "balohan"]), cam: "ACEH", act: A3, sub: "Kembali bertugas", col: COL.motor, trail: false },
  { dur: 1.0, m: "ferry", d: straight("balohan", "uleelheue"), cam: "ACEH", act: A3, sub: "Kembali bertugas", col: COL.ferry, trail: false },
  { dur: 3.6, m: "motor", d: curve(["uleelheue", "medan", "pekanbaru", "sgelam"]), cam: "FULL", act: A3, sub: "PLN Sungai Gelam · Jambi", col: COL.motor },
  { dur: 1.6, m: "ferry", d: curve(["sgelam", [104.5, -0.9], [104.1, 0.3], "karimun"]), cam: "FULL", act: A3, sub: "PLN Tanjung Balai Karimun", col: COL.ferry },
  { dur: 2.2, m: "ferry", d: curve(["karimun", [104.4, 0.3], [105.0, -1.2], [105.7, -2.6], [106.4, -4.6], "priok"]), cam: "FULL", act: A3, sub: "Pulang, motor disimpan di Sukabumi", col: COL.ferry },
  { dur: 1.0, m: "motor", d: curve(["priok", "bogor", "sukabumi"]), cam: "WJAVA", act: A3, sub: "Pulang, motor disimpan di Sukabumi", col: COL.motor, trail: false },
  { dur: 2.2, m: "plane", d: arc("cgk", "pkb", 40), cam: "JAVASEA", act: A3, sub: "Terbang ke Kalimantan", col: COL.plane },
  { dur: 1.1, m: "car", d: straight("pkb", "lamandau"), cam: "KALI", act: A3, sub: "PLN Lamandau · Kalimantan Tengah", col: COL.car },
  { dur: 1.8, m: "car", d: curve(["lamandau", "palangka", "kapuas"]), cam: "KALI", act: A3, sub: "PLN Kuala Kapuas · kontrak selesai", col: COL.car },
  { dur: 2.0, m: "plane", d: arc("kapuas", "cgk", 40), cam: "JAVASEA", act: A3, sub: "Resign, kembali ke Jakarta", col: COL.plane },
  { dur: 3.4, m: "ojol", d: curve(["jakarta", "tangerang", "pamulang", "depok", "bogor", "bekasi", "jakarta"]), cam: "JABO", act: A4, sub: "Ojol sambil kuliah · Universitas Pamulang", col: COL.ojol },
  { dur: 3.0, m: "tronton", d: curve(["jakarta", "merak", "lampung", "palembang", "pekanbaru", "medan"]), cam: "FULL", act: A4, sub: "Supir tronton lintas Jawa–Sumatra", col: COL.tronton },
  { dur: 1.8, m: "tronton", d: curve(["medan", "pekanbaru", "palembang", "lampung", "merak", "jakarta"]), cam: "FULL", act: A4, sub: "Supir tronton lintas Jawa–Sumatra", col: COL.tronton, trail: false },
  { dur: 3.2, m: "taxi", d: curve(["jakarta", "bekasi", "bogor", "depok", "jaksel", "tangerang", "jakarta"]), cam: "JABO", act: A4, sub: "Taksi online sambil kuliah · Universitas Siber Asia", col: COL.taxi },
  { dur: 3.4, m: "plane", d: arc("cgk", "ternate", 70), cam: "FULL", act: A5, sub: "Jakarta → Ternate", col: COL.plane },
  { dur: 1.4, m: "ferryNoBike", d: straight("ternate", "sofifi"), cam: "HALMA", act: A5, sub: "Feri Ternate → Sofifi", col: COL.ferry },
  { dur: 1.5, m: "car", d: curve(["sofifi", [127.72, 0.62], [127.84, 0.52], "lelilef"]), cam: "HALMA", act: A5, sub: "Menuju Weda Bay", col: COL.car },
  { dur: 4.0, m: null, at: "lelilef", cam: "HALMA", act: "UNIT B-187 · WEDA BAY", sub: "Dump truck operator · kuliah RPL Universitas Darunnajah", col: COL.pink, finale: true },
];
let t = 0.4;
for (const s of S) { s.t0 = t; s.t1 = t + s.dur; t = s.t1; }
const T = r1(t + 0.6);
const k = (s) => f4(s / T);

// keyframe kamera
const CAMK = [[0, S[0].cam]];
let prev = S[0].cam;
for (const s of S) {
  if (s.cam !== prev) { const tr = Math.min(0.6, s.dur / 2); CAMK.push([s.t0, prev], [s.t0 + tr, s.cam]); }
  CAMK.push([s.t1, s.cam]); prev = s.cam;
}
CAMK.push([T, prev]);
for (let i = 1; i < CAMK.length; i++) if (CAMK[i][0] <= CAMK[i - 1][0]) CAMK[i][0] = CAMK[i - 1][0] + 0.001;
const camKT = CAMK.map((c) => f4(c[0] / T)).join(";");
const camVals = CAMK.map((c) => CAMS[c[1]].join(" ")).join(";");
const SV = (b) => CAMK.map((c) => +((CAMS[c[1]][2] / W) * b).toFixed(4)).join(";");
const SI = (b) => CAMK.map((c) => +(Math.pow(CAMS[c[1]][2] / W, 0.78) * b).toFixed(4)).join(";");
const camAnim = (attr, vals) => `<animate attributeName="${attr}" dur="${T}s" repeatCount="indefinite" keyTimes="${camKT}" values="${vals}"/>`;
const showBetween = (a, b, base = 0) => `<animate attributeName="opacity" dur="${T}s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;${k(a)};${k(b)}" values="${base};${base ? 0 : 1};${base}"/>`;

// ---------- jejak & ikon ----------
const legs = S.filter((s) => s.m).map((s) => {
  const len = r1(new svgPathProperties(s.d).getTotalLength());
  const [a, b] = [k(s.t0), k(s.t1)];
  const trail = s.trail === false ? "" :
    `<path d="${s.d}" fill="none" stroke="${TRAIL[s.m]}" stroke-linecap="round" stroke-dasharray="${len} ${len}" opacity=".85">${camAnim("stroke-width", SV(1.8))}` +
    `<animate attributeName="stroke-dashoffset" dur="${T}s" repeatCount="indefinite" keyTimes="0;${a};${b};1" values="${len};${len};0;0"/></path>`;
  const icon = `<g opacity="0">${showBetween(s.t0, s.t1)}` +
    `<animateMotion dur="${T}s" repeatCount="indefinite" rotate="auto" calcMode="linear" keyTimes="0;${a};${b};1" keyPoints="0;0;1;1" path="${s.d}"/>` +
    `<g>${camAnim("transform", "")}</g></g>`;
  return { trail, icon: icon.replace(`<g>${camAnim("transform", "")}</g>`, `<g><animateTransform attributeName="transform" type="scale" dur="${T}s" repeatCount="indefinite" keyTimes="${camKT}" values="${SI(1.2)}"/>${ICON[s.m]}</g>`) };
});

// jeda: ikon diam (Tasik = bus parkir)
const pauses = S.filter((s) => !s.m && !s.finale && !s.badge).map((s) => {
  const [x, y] = pt(s.at);
  return `<g transform="translate(${x},${y})" opacity="0">${showBetween(s.t0, s.t1)}<g><animateTransform attributeName="transform" type="scale" dur="${T}s" repeatCount="indefinite" keyTimes="${camKT}" values="${SI(1.2)}"/><circle r="4" fill="none" stroke="${COL.edu}" stroke-width="1"><animate attributeName="r" values="3;9" dur="1s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1s" repeatCount="indefinite"/></circle><circle r="2.4" fill="${COL.edu}"/></g></g>`;
}).join("");

// ---------- titik tempat ----------
const DOTS = [
  ...["tasik", "serang", "sukabumi", "pamulang", "jaksel"].map((c) => ({ c, col: COL.edu })),
  ...["jaksel", "bekasi", "takengon", "idi", "sgelam", "karimun", "lamandau", "kapuas", "tangerang", "depok", "bogor"].map((c) => ({ c, col: COL.motor })),
  ...[[97.6, 4.78], [106.9, -6.12]].map((c) => ({ c, col: COL.truck })),
];
const dotsSVG = DOTS.map(({ c, col }) => { const [x, y] = pt(c); return `<circle cx="${x}" cy="${y}" r="2.6" fill="${col}" opacity=".9">${camAnim("r", SV(2.6))}</circle>`; }).join("");

// ---------- label (muncul hanya di kamera tertentu) ----------
const LBL = [
  ["Tasikmalaya", "tasik", 13, "middle", ["WJAVA"]], ["Serang", "serang", -8, "end", ["WJAVA"]], ["Sukabumi", "sukabumi", 13, "middle", ["WJAVA"]],
  ["Jakarta", "jakarta", -8, "middle", ["FULL", "WJAVA", "JAVASEA", "JABO"]], ["Bekasi", "bekasi", 13, "start", ["WJAVA", "JABO"]],
  ["Merak", "merak", 13, "start", ["SUNDA"]], ["Bakauheni", "bakauheni", -8, "end", ["SUNDA"]],
  ["Takengon", "takengon", 13, "middle", ["ACEH"]], ["Idi", "idi", -8, "start", ["ACEH"]], ["Banda Aceh", "uleelheue", 13, "middle", ["ACEH"]],
  ["Sabang", "km0", -9, "start", ["ACEH", "FULL"]], ["Jambi", "sgelam", 13, "middle", ["FULL"]], ["Karimun", "karimun", -8, "middle", ["FULL"]],
  ["Lamandau", "lamandau", -8, "middle", ["KALI", "JAVASEA"]], ["Kuala Kapuas", "kapuas", 13, "middle", ["KALI", "JAVASEA"]],
  ["Tangerang", "tangerang", -8, "end", ["JABO"]], ["Pamulang", "pamulang", 13, "end", ["JABO"]], ["Depok", "depok", 4, "start", ["JABO"], 6], ["Bogor", "bogor", 13, "middle", ["JABO"]],
  ["Ternate", "ternate", -8, "end", ["HALMA"]], ["Sofifi", "sofifi", -8, "start", ["HALMA"]], ["Weda Bay", "lelilef", 4, "start", ["FULL", "HALMA"], 9],
];
const finale = S.find((s) => s.finale);
const lblSVG = LBL.map(([txt, key, dy, anchor, cams, dx = 0]) => {
  const [x, y] = pt(key);
  const vis = CAMK.map((c) => (cams.includes(c[1]) ? 1 : 0)).join(";");
  const hideFinal = txt === "Weda Bay" ? `<animate attributeName="visibility" dur="${T}s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;${k(finale.t0)};${k(finale.t1)}" values="visible;hidden;visible"/>` : "";
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="11" fill="#E5E7EB"><animate attributeName="opacity" dur="${T}s" repeatCount="indefinite" calcMode="discrete" keyTimes="${camKT}" values="${vis}"/>${hideFinal}${camAnim("font-size", SV(11))}${camAnim("dy", SV(dy))}${dx ? camAnim("dx", SV(dx)) : ""}${txt}</text>`;
}).join("");

// tugu KM 0 + lencana, finale dump truck
const [kx, ky] = pt("km0");
const km0 = `<g transform="translate(${kx},${ky})"><g><animateTransform attributeName="transform" type="scale" dur="${T}s" repeatCount="indefinite" keyTimes="${camKT}" values="${SI(1)}"/><path d="M-1.4,0L-.7,-7H.7L1.4,0Z" fill="#F8FAFC"/><rect x="-2.6" y="0" width="5.2" height="1.4" fill="#F8FAFC"/></g></g>`;
const [lx, ly] = pt("lelilef");
const finaleSVG = `<g transform="translate(${lx},${ly})" opacity="0">${showBetween(finale.t0, finale.t1)}<g><animateTransform attributeName="transform" type="scale" dur="${T}s" repeatCount="indefinite" keyTimes="${camKT}" values="${SI(1.3)}"/>` +
  `<circle r="9" fill="none" stroke="${COL.pink}" stroke-width="1"><animate attributeName="r" values="5;14" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.2s" repeatCount="indefinite"/></circle>${ICON.truck}</g></g>`;
const wedaDot = `<circle cx="${lx}" cy="${ly}" r="3.2" fill="${COL.pink}">${camAnim("r", SV(3.2))}</circle>`;

// lencana sertifikat (di luar peta, tidak ikut zoom)
const badgeS = S.find((s) => s.badge);
const badge = `<g opacity="0">${showBetween(badgeS.t0, badgeS.t1)}<g transform="translate(${W - 150},${TOP + 58})">` +
  `<circle r="40" fill="#0D1117" stroke="${COL.pink}" stroke-width="2"/><circle r="33" fill="none" stroke="#F5B700" stroke-width="1" stroke-dasharray="3 3"/>` +
  `<text y="-8" text-anchor="middle" font-size="22" font-weight="700" fill="#F5B700">0 KM</text><text y="10" text-anchor="middle" font-size="10" fill="#F8FAFC" letter-spacing="1">SABANG</text><text y="24" text-anchor="middle" font-size="9" fill="${COL.pink}" letter-spacing="1">BIKERS ✓</text></g></g>`;

// ---------- caption & mode ----------
// gabungkan adegan berurutan yang caption-nya sama
const caps = [];
for (const s of S) { const last = caps[caps.length - 1]; if (last && last.act === s.act && last.sub === s.sub) last.t1 = s.t1; else caps.push({ act: s.act, sub: s.sub, col: s.col, t0: s.t0, t1: s.t1 }); }
const capSVG = caps.map((c) => `<g opacity="0">${showBetween(c.t0, c.t1)}<text x="28" y="${TOP + MH + 24}" font-size="15" font-weight="700" fill="${c.col}" letter-spacing="2">${esc(c.act)}</text><text x="28" y="${TOP + MH + 44}" font-size="12" fill="#9CA3AF">${esc(c.sub)}</text></g>`).join("");
const modes = [];
for (const s of S) { const m = s.finale ? "DUMP TRUCK B-187" : s.m ? MODE[s.m] : "—"; const last = modes[modes.length - 1]; if (last && last.m === m) last.t1 = s.t1; else modes.push({ m, t0: s.t0, t1: s.t1 }); }
const modeSVG = modes.filter((m) => m.m !== "—").map((m) => `<text x="${W - 28}" y="${TOP + MH + 34}" text-anchor="end" font-size="12" font-weight="700" fill="#F8FAFC" letter-spacing="2" opacity="0">${showBetween(m.t0, m.t1)}MODE: ${m.m}</text>`).join("");

// fade hitam saat putaran diulang
const fade = `<rect x="0" y="${TOP}" width="${W}" height="${MH}" fill="#000"><animate attributeName="opacity" dur="${T}s" repeatCount="indefinite" keyTimes="0;${k(0.4)};${k(T - 0.5)};1" values="1;0;0;1"/></rect>`;

// ---------- rakit ----------
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Peta kisah hidup Ateng Sulaeman: dari sekolah di Tasikmalaya sampai dump truck di Weda Bay">
<style>text{font-family:'JetBrains Mono','Fira Code',Consolas,'Courier New',monospace}</style>
<defs><linearGradient id="bd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8B5CF6"/><stop offset="1" stop-color="#FF007F"/></linearGradient></defs>
<rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" rx="18" fill="#0D1117" stroke="url(#bd)" stroke-width="2"/>
<text x="28" y="32" font-size="14" font-weight="700" fill="#F8FAFC" letter-spacing="2">LIFE JOURNEY <tspan fill="#4B5563">│</tspan> <tspan fill="#FFB020">TASIKMALAYA → WEDA BAY</tspan></text>
<text x="${W - 28}" y="32" font-size="12" fill="#9CA3AF" text-anchor="end" letter-spacing="2">ATENG SULAEMAN</text>
<line x1="2" y1="${TOP - 6}" x2="${W - 2}" y2="${TOP - 6}" stroke="#8B5CF6" stroke-opacity=".4"/>
<svg x="0" y="${TOP}" width="${W}" height="${MH}" viewBox="${CAMS[S[0].cam].join(" ")}" preserveAspectRatio="xMidYMid slice">
<animate attributeName="viewBox" dur="${T}s" repeatCount="indefinite" keyTimes="${camKT}" values="${camVals}"/>
<rect x="-2000" y="-2000" width="5000" height="5000" fill="#0B1220"/>
<path d="${neighD}" fill="#141B26" stroke="#1F2937" stroke-width=".6" vector-effect="non-scaling-stroke"/>
<path d="${idnD}" fill="#1F2937" stroke="#3B4556" stroke-width=".7" vector-effect="non-scaling-stroke"/>
${dotsSVG}
${legs.map((l) => l.trail).join("")}
${km0}${wedaDot}
${lblSVG}
${pauses}
${legs.map((l) => l.icon).join("")}
${finaleSVG}
</svg>
${fade}${badge}
<line x1="28" y1="${TOP + MH + 6}" x2="${W - 28}" y2="${TOP + MH + 6}" stroke="#1F2937"/>
${capSVG}${modeSVG}
</svg>`;

const out = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "lib", "journey-svg.js");
fs.writeFileSync(out, `// AUTO-GENERATED oleh scripts/build-journey.mjs — jangan diedit manual\nmodule.exports = ${JSON.stringify(svg)};\n`);
console.log("OK", (svg.length / 1024).toFixed(1) + " KB", "durasi", T + "s");
console.log(S.map((s) => `${s.t0.toFixed(1)} ${s.sub}`).join("\n"));
