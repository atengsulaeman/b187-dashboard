// Generator peta perjalanan Atsu -> lib/journey-svg.js
// Jalankan sekali di komputer/Termux bila rute diubah:
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
const W = 900, MH = 380;            // area peta
const TOP = 52, BOT = 56;           // header & caption
const H = TOP + MH + BOT;
const T = 35;                       // durasi satu putaran (detik)
const r1 = (n) => Math.round(n * 10) / 10;

const countries = topo.feature(world, world.objects.countries).features;
const idn = countries.find((f) => f.id === "360");
const proj = geoMercator().fitExtent([[48, 14], [W - 14, MH - 14]], idn);
const gp = geoPath(proj);
const roundPath = (d) => d.replace(/-?\d+\.\d+/g, (m) => r1(+m));
const P = (c) => proj(c).map(r1);

// tetangga untuk konteks (Malaysia, Brunei, Timor Leste, PNG, Singapura, Filipina)
const NEIGH = ["458", "096", "626", "598", "702", "608"];
const neighD = countries.filter((f) => NEIGH.includes(f.id)).map((f) => roundPath(gp(f) || "")).join("");
const idnD = roundPath(gp(idn));

// ---------- titik-titik ----------
const C = {
  sukabumi: [106.93, -6.92], merak: [106.0, -5.93], bakauheni: [105.75, -5.87],
  lampung: [105.26, -5.43], palembang: [104.75, -2.98], jambi: [103.61, -1.61],
  pekanbaru: [101.45, 0.51], medan: [98.67, 3.59], lhokseumawe: [97.15, 5.18],
  uleelheue: [95.29, 5.56], balohan: [95.36, 5.84], km0: [95.21, 5.905],
  meulaboh: [96.13, 4.14], sibolga: [98.78, 1.74], padang: [100.35, -0.95],
  bengkulu: [102.26, -3.79], jakarta: [106.85, -6.2], cgk: [106.65, -6.13],
  ternate: [127.38, 0.79], sofifi: [127.57, 0.73], weda: [127.87, 0.33], lelilef: [127.94, 0.46],
};
const curve = (pts) => roundPath(line().curve(curveCatmullRom.alpha(0.5))(pts.map((k) => P(C[k] || k))));
const straight = (a, b) => { const A = P(C[a]), B = P(C[b]); return `M${A[0]},${A[1]}L${B[0]},${B[1]}`; };
const arc = (a, b, lift) => { const A = P(C[a]), B = P(C[b]); return `M${A[0]},${A[1]}Q${r1((A[0] + B[0]) / 2)},${r1(Math.min(A[1], B[1]) - lift)} ${B[0]},${B[1]}`; };

// ---------- warna ----------
const COL = { motor: "#FFB020", ferry: "#00F5FF", plane: "#F8FAFC", car: "#3ECF8E", truck: "#8B5CF6", pink: "#FF007F" };

// ---------- ikon (tampak atas, menghadap +x, simetris atas-bawah) ----------
const ICON = {
  motor: `<ellipse rx="5.5" ry="1.6" fill="${COL.motor}"/><rect x="3.5" y="-2.6" width="1.2" height="5.2" rx=".5" fill="${COL.motor}"/><circle r="1.6" fill="#F8FAFC"/>`,
  ferry: `<path d="M-8,-3.2H5L8.5,0L5,3.2H-8Z" fill="#E5F9FF"/><rect x="-6" y="-2" width="7" height="4" rx=".6" fill="${COL.ferry}"/><ellipse cx="-2.5" rx="2.6" ry=".9" fill="${COL.motor}"/>`,
  ferryNoBike: `<path d="M-8,-3.2H5L8.5,0L5,3.2H-8Z" fill="#E5F9FF"/><rect x="-6" y="-2" width="7" height="4" rx=".6" fill="${COL.ferry}"/>`,
  plane: `<path d="M8,0L5,-1H1.5L-2,-7H-3.6L-1.6,-1H-5L-6.6,-3H-7.6L-6.8,0L-7.6,3H-6.6L-5,1H-1.6L-3.6,7H-2L1.5,1H5Z" fill="${COL.plane}"/>`,
  car: `<rect x="-5" y="-2.6" width="10" height="5.2" rx="1.6" fill="${COL.car}"/><rect x="0.5" y="-2" width="2.6" height="4" rx=".6" fill="#0D1117"/>`,
  truck: `<rect x="-7" y="-3.2" width="10" height="6.4" rx=".6" fill="${COL.truck}"/><rect x="3.6" y="-3" width="4.4" height="6" rx=".8" fill="#F8FAFC"/><rect x="-6" y="-2.4" width="8" height="4.8" fill="#B5651D"/>`,
};

// ---------- kamera ----------
const box = (pts, pad) => {
  const xy = pts.map((k) => P(C[k]));
  const xs = xy.map((p) => p[0]), ys = xy.map((p) => p[1]);
  let x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
  let w = x1 - x0, h = y1 - y0; const ar = W / MH;
  if (w / h < ar) { const nw = h * ar; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / ar; y0 -= (nh - h) / 2; h = nh; }
  return [r1(x0), r1(y0), r1(w), r1(h)];
};
const FULL = [0, 0, W, MH];
const SUNDA = box(["merak", "bakauheni", "lampung"], 16);
const ACEH = box(["uleelheue", "balohan", "km0"], 12);
const HALMA = box(["ternate", "sofifi", "lelilef"], 8);
const CAM = [
  [0, FULL], [1.7, FULL], [2.3, SUNDA], [3.8, SUNDA], [4.4, FULL],
  [9.6, FULL], [10.2, ACEH], [16.6, ACEH], [17.2, FULL],
  [22.4, FULL], [23.0, SUNDA], [24.2, SUNDA], [24.9, FULL],
  [28.0, FULL], [28.7, HALMA], [34.3, HALMA], [35, FULL],
];
const kt = (arr) => arr.map((t) => +(t / T).toFixed(4)).join(";");
const camKT = kt(CAM.map((c) => c[0]));
const camVals = CAM.map((c) => c[1].join(" ")).join(";");
const scaleVals = (base) => CAM.map((c) => r1((c[1][2] / W) * base * 100) / 100).join(";");
const SV = (base) => CAM.map((c) => +((c[1][2] / W) * base).toFixed(3)).join(";");
const SI = (base) => CAM.map((c) => +(Math.pow(c[1][2] / W, 0.78) * base).toFixed(3)).join(";");
const zoomOnly = CAM.map((c) => (c[1][2] < W ? 1 : 0)).join(";");
const anim = (attr, vals) => `<animate attributeName="${attr}" dur="${T}s" repeatCount="indefinite" keyTimes="${camKT}" values="${vals}"/>`;

// ---------- etape perjalanan ----------
const LEGS = [
  { d: curve(["sukabumi", "merak"]), m: "motor", t: [0.5, 2.0] },
  { d: straight("merak", "bakauheni"), m: "ferry", t: [2.0, 4.0] },
  { d: curve(["bakauheni", "lampung", "palembang", "jambi", "pekanbaru", "medan", "lhokseumawe", "uleelheue"]), m: "motor", t: [4.0, 10.0] },
  { d: straight("uleelheue", "balohan"), m: "ferry", t: [10.0, 12.0] },
  { d: curve(["balohan", [95.28, 5.89], "km0"]), m: "motor", t: [12.0, 12.8] },
  { d: curve(["km0", [95.28, 5.89], "balohan"]), m: "motor", t: [14.8, 15.4], trail: false },
  { d: straight("balohan", "uleelheue"), m: "ferry", t: [15.4, 16.8], trail: false },
  { d: curve(["uleelheue", "meulaboh", "sibolga", "padang", "bengkulu", "lampung", "bakauheni"]), m: "motor", t: [16.8, 22.8], c: "#FF9F1C" },
  { d: straight("bakauheni", "merak"), m: "ferry", t: [22.8, 24.4], trail: false },
  { d: curve(["merak", "jakarta"]), m: "motor", t: [24.4, 25.2] },
  { d: arc("cgk", "ternate", 70), m: "plane", t: [25.2, 28.4] },
  { d: straight("ternate", "sofifi"), m: "ferryNoBike", t: [28.4, 30.0] },
  { d: curve(["sofifi", [127.72, 0.62], [127.84, 0.52], "lelilef"]), m: "car", t: [30.0, 31.6] },
];
const trailColor = (L) => L.c || ({ motor: COL.motor, ferry: COL.ferry, ferryNoBike: COL.ferry, plane: COL.plane, car: COL.car })[L.m];

const legSVG = LEGS.map((L) => {
  const len = r1(new svgPathProperties(L.d).getTotalLength());
  const [a, b] = L.t.map((s) => +(s / T).toFixed(4));
  const trail = L.trail === false ? "" :
    `<path d="${L.d}" fill="none" stroke="${trailColor(L)}" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="${len} ${len}" opacity=".85">${anim("stroke-width", SV(1.8))}` +
    `<animate attributeName="stroke-dashoffset" dur="${T}s" repeatCount="indefinite" keyTimes="0;${a};${b};1" values="${len};${len};0;0"/></path>`;
  const icon =
    `<g opacity="0"><animate attributeName="opacity" dur="${T}s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;${a};${b}" values="0;1;0"/>` +
    `<animateMotion dur="${T}s" repeatCount="indefinite" rotate="auto" calcMode="linear" keyTimes="0;${a};${b};1" keyPoints="0;0;1;1" path="${L.d}"/>` +
    `<g><animateTransform attributeName="transform" type="scale" dur="${T}s" repeatCount="indefinite" keyTimes="${camKT}" values="${SI(1.2)}"/>${ICON[L.m]}</g></g>`;
  return { trail, icon };
});

// ---------- titik kota (pendidikan, kerja, komunitas) ----------
const DOTS = [
  ...[[108.22, -7.33], [106.15, -6.12], [106.93, -6.92], [106.72, -6.34]].map((c) => ({ c, k: "e" })),
  ...[[106.82, -6.26], [107.0, -6.24], [106.8, -6.6], [106.63, -6.18], [97.75, 4.95], [103.61, -1.61], [104.03, 1.13], [96.85, 4.62], [117.15, -0.5], [114.59, -3.32]].map((c) => ({ c, k: "w" })),
  ...[[97.6, 4.78], [106.9, -6.12]].map((c) => ({ c, k: "k" })),
];
const DOTCOL = { e: COL.ferry, w: COL.motor, k: COL.truck };
const dotsSVG = DOTS.map(({ c, k }) => {
  const [x, y] = P(c);
  return `<circle cx="${x}" cy="${y}" r="2.6" fill="${DOTCOL[k]}" opacity=".9">${anim("r", SV(2.6))}</circle>`;
}).join("");

// label peta (ukuran ikut zoom agar tetap terbaca)
const LBL = [
  ["Sabang", "km0", -9, "start", 1], ["Jakarta", "jakarta", 15, "middle", 1], ["Weda Bay", "lelilef", 4, "start", 1, 9],
  ["Banda Aceh", "uleelheue", 13, "middle", 0], ["Merak", "merak", 13, "start", 0], ["Bakauheni", "bakauheni", -8, "end", 0],
  ["Ternate", "ternate", -8, "end", 0], ["Sofifi", "sofifi", -8, "start", 0],
];
const lblSVG = LBL.map(([t, k, dy, a, always, dx = 0]) => {
  const [x, y] = P(C[k]);
  const fin = t === "Weda Bay" ? `<animate attributeName="opacity" dur="${T}s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;${(31.6 / T).toFixed(4)};${(34.6 / T).toFixed(4)}" values="1;0;1"/>` : "";
  const vis = always ? fin : `<animate attributeName="opacity" dur="${T}s" repeatCount="indefinite" calcMode="discrete" keyTimes="${camKT}" values="${zoomOnly}"/>`;
  return `<text x="${x}" y="${y}" text-anchor="${a}" font-size="11" fill="#E5E7EB" font-family="monospace" ${always ? "" : 'opacity="0"'}>${vis}${anim("font-size", SV(11))}${anim("dy", SV(dy))}${dx ? anim("dx", SV(dx)) : ""}${t}</text>`;
}).join("");

// tugu KM 0 & titik akhir
const [kx, ky] = P(C.km0);
const km0 = `<g transform="translate(${kx},${ky})"><g><animateTransform attributeName="transform" type="scale" dur="${T}s" repeatCount="indefinite" keyTimes="${camKT}" values="${SV(1)}"/><path d="M-1.4,0L-.7,-7H.7L1.4,0Z" fill="#F8FAFC"/><rect x="-2.6" y="0" width="5.2" height="1.4" fill="#F8FAFC"/></g></g>`;
const [lx, ly] = P(C.lelilef);
const [fa, fb] = [31.6 / T, 34.6 / T].map((v) => +v.toFixed(4));
const finale = `<g transform="translate(${lx},${ly})" opacity="0"><animate attributeName="opacity" dur="${T}s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;${fa};${fb}" values="0;1;0"/>` +
  `<g><animateTransform attributeName="transform" type="scale" dur="${T}s" repeatCount="indefinite" keyTimes="${camKT}" values="${SI(1.3)}"/>` +
  `<circle r="9" fill="none" stroke="${COL.pink}" stroke-width="1"><animate attributeName="r" values="5;14" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.2s" repeatCount="indefinite"/></circle>${ICON.truck}</g></g>`;
const wedaDot = `<circle cx="${lx}" cy="${ly}" r="3.2" fill="${COL.pink}">${anim("r", SV(3.2))}</circle>`;

// ---------- caption (di luar peta, tidak ikut zoom) ----------
const CAPS = [
  [0.3, 10.0, "BABAK 1 · TURING SUMATRA", "Sukabumi → Merak → Bakauheni → Banda Aceh", COL.motor],
  [10.0, 12.8, "BABAK 1 · TURING SUMATRA", "Menyeberang ke Pulau Weh", COL.ferry],
  [12.8, 14.8, "KM 0 · SABANG", "Titik paling barat Indonesia", COL.pink],
  [14.8, 25.2, "BABAK 2 · PULANG KE JAWA", "Sabang → Lintas Barat Sumatra → Jakarta", "#FF9F1C"],
  [25.2, 28.4, "BABAK 3 · TERBANG KE TIMUR", "Jakarta → Ternate", COL.plane],
  [28.4, 31.6, "BABAK 3 · TERBANG KE TIMUR", "Ternate → Sofifi → Weda", COL.ferry],
  [31.6, 34.6, "UNIT B-187 · WEDA BAY", "From Mining to Coding", COL.pink],
];
const capSVG = CAPS.map(([s, e, h, sub, col]) => {
  const [a, b] = [s / T, e / T].map((v) => +v.toFixed(4));
  return `<g opacity="0"><animate attributeName="opacity" dur="${T}s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;${a};${b}" values="0;1;0"/>` +
    `<text x="28" y="${TOP + MH + 24}" font-size="15" font-weight="700" fill="${col}" letter-spacing="2">${h}</text>` +
    `<text x="28" y="${TOP + MH + 44}" font-size="12" fill="#9CA3AF">${sub}</text></g>`;
}).join("");

const MODES = [[0.5, 2.0, "MOTOR"], [2.0, 4.0, "MOTOR + FERI"], [4.0, 10.0, "MOTOR"], [10.0, 12.0, "MOTOR + FERI"], [12.0, 15.4, "MOTOR"], [15.4, 16.8, "MOTOR + FERI"], [16.8, 22.8, "MOTOR"], [22.8, 24.4, "MOTOR + FERI"], [24.4, 25.2, "MOTOR"], [25.2, 28.4, "PESAWAT"], [28.4, 30.0, "FERI"], [30.0, 31.6, "MOBIL"], [31.6, 34.6, "DUMP TRUCK"]];
const modeSVG = MODES.map(([s, e, m]) => {
  const [a, b] = [s / T, e / T].map((v) => +v.toFixed(4));
  return `<text x="${W - 28}" y="${TOP + MH + 34}" text-anchor="end" font-size="12" font-weight="700" fill="#F8FAFC" letter-spacing="2" opacity="0"><animate attributeName="opacity" dur="${T}s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;${a};${b}" values="0;1;0"/>MODE: ${m}</text>`;
}).join("");

// ---------- rakit ----------
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Peta perjalanan Ateng Sulaeman dari Sabang sampai Weda Bay">
<style>text{font-family:'JetBrains Mono','Fira Code',Consolas,'Courier New',monospace}</style>
<defs><linearGradient id="bd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8B5CF6"/><stop offset="1" stop-color="#FF007F"/></linearGradient></defs>
<rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" rx="18" fill="#0D1117" stroke="url(#bd)" stroke-width="2"/>
<text x="28" y="32" font-size="14" font-weight="700" fill="#F8FAFC" letter-spacing="2">JOURNEY MAP <tspan fill="#4B5563">│</tspan> <tspan fill="#FFB020">SABANG → WEDA BAY</tspan></text>
<text x="${W - 28}" y="32" font-size="12" fill="#9CA3AF" text-anchor="end" letter-spacing="2">ATENG SULAEMAN</text>
<line x1="2" y1="${TOP - 6}" x2="${W - 2}" y2="${TOP - 6}" stroke="#8B5CF6" stroke-opacity=".4"/>
<svg x="0" y="${TOP}" width="${W}" height="${MH}" viewBox="${FULL.join(" ")}" preserveAspectRatio="xMidYMid slice">
<animate attributeName="viewBox" dur="${T}s" repeatCount="indefinite" keyTimes="${camKT}" values="${camVals}"/>
<rect x="-2000" y="-2000" width="5000" height="5000" fill="#0B1220"/>
<path d="${neighD}" fill="#141B26" stroke="#1F2937" stroke-width=".6" vector-effect="non-scaling-stroke"/>
<path d="${idnD}" fill="#1F2937" stroke="#3B4556" stroke-width=".7" vector-effect="non-scaling-stroke"/>
${dotsSVG}
${legSVG.map((l) => l.trail).join("")}
${km0}${wedaDot}
${lblSVG}
${legSVG.map((l) => l.icon).join("")}
${finale}
</svg>
<line x1="28" y1="${TOP + MH + 6}" x2="${W - 28}" y2="${TOP + MH + 6}" stroke="#1F2937"/>
${capSVG}${modeSVG}
</svg>`;

const out = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "lib", "journey-svg.js");
fs.writeFileSync(out, `// AUTO-GENERATED oleh scripts/build-journey.mjs — jangan diedit manual\nmodule.exports = ${JSON.stringify(svg)};\n`);
console.log("OK", (svg.length / 1024).toFixed(1) + " KB", { SUNDA, ACEH, HALMA });
