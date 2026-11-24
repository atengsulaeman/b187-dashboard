const cfg = require("../config");
const { PHASES, TZ } = require("./shift");

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function fmtRemaining(ms) {
  const m = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(m / 60);
  return `${h}j ${String(m % 60).padStart(2, "0")}m`;
}

function renderStatus(st, now = new Date()) {
  const W = 900, Hh = 320;
  const c = st.color;

  const clock = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(now).replace(".", ":");
  const date = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(now);

  // Gauge progres fase
  const R = 58, CX = 760, CY = 136;
  const circ = 2 * Math.PI * R;
  const arc = 0.75 * circ;                 // gauge 270°
  const fill = arc * Math.min(1, Math.max(0, st.progress));
  const pct = Math.round(st.progress * 100);

  // Lampu indikator bawah
  const lamps = PHASES.map((p, i) => {
    const x = 60 + i * 200;
    const on = i === st.index;
    return `
    <g transform="translate(${x},268)">
      <circle cx="0" cy="0" r="7" fill="${on ? p.color : "#1F2937"}" ${on ? 'filter="url(#glow)"' : ""}>
        ${on ? `<animate attributeName="opacity" values="1;0.35;1" dur="1.6s" repeatCount="indefinite"/>` : ""}
      </circle>
      <text x="16" y="5" class="lamp" fill="${on ? p.color : "#4B5563"}">${esc(p.label.replace("ON SHIFT · ", "SHIFT "))}</text>
    </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Unit ${esc(cfg.unit)}: ${esc(st.label)}">
  <defs>
    <linearGradient id="bd" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8B5CF6"/><stop offset="1" stop-color="#FF007F"/>
    </linearGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#111827"/><stop offset="1" stop-color="#0D1117"/>
    </linearGradient>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" fill="none" stroke="#ffffff" stroke-opacity="0.03"/>
    </pattern>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <style>
      text{font-family:'JetBrains Mono','Fira Code',Consolas,'Courier New',monospace}
      .cap{font-size:12px;letter-spacing:3px;fill:#6B7280}
      .top{font-size:14px;font-weight:700;letter-spacing:2px}
      .lamp{font-size:12px;font-weight:700;letter-spacing:1.5px}
    </style>
  </defs>

  <rect x="1.5" y="1.5" width="${W - 3}" height="${Hh - 3}" rx="18" fill="url(#bg)" stroke="url(#bd)" stroke-width="2"/>
  <rect x="1.5" y="1.5" width="${W - 3}" height="${Hh - 3}" rx="18" fill="url(#grid)"/>

  <!-- Bar atas -->
  <rect x="2.5" y="2.5" width="${W - 5}" height="44" rx="16" fill="#0B0F17"/>
  <rect x="2.5" y="30" width="${W - 5}" height="16.5" fill="#0B0F17"/>
  <line x1="2" y1="46.5" x2="${W - 2}" y2="46.5" stroke="#8B5CF6" stroke-opacity="0.4"/>
  <text x="28" y="30" class="top" fill="#F8FAFC">UNIT <tspan fill="#FFB020">${esc(cfg.unit)}</tspan>  <tspan fill="#4B5563">│</tspan>  ${esc(cfg.model)}</text>
  <text x="${W - 28}" y="30" class="top" fill="#9CA3AF" text-anchor="end">${esc(cfg.company)} · ${esc(cfg.site)}</text>

  <!-- Status -->
  <text x="40" y="88" class="cap">STATUS OPERATOR</text>
  <circle cx="58" cy="128" r="14" fill="${c}" filter="url(#glow)">
    <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite"/>
  </circle>
  <circle cx="58" cy="128" r="22" fill="none" stroke="${c}" stroke-opacity="0.35" stroke-width="2"/>
  <text x="96" y="140" font-size="34" font-weight="800" fill="${c}" letter-spacing="1">${esc(st.label)}</text>
  <text x="96" y="168" font-size="15" fill="#9CA3AF">${esc(st.sub)}</text>

  <!-- Jam -->
  <text x="40" y="212" class="cap">WAKTU WEDA BAY (WIT)</text>
  <text x="40" y="236" font-size="22" font-weight="700" fill="#F8FAFC">${esc(clock)} <tspan font-size="15" fill="#9CA3AF" font-weight="400">· ${esc(date)}</tspan></text>

  <!-- Gauge -->
  <g transform="rotate(135 ${CX} ${CY})">
    <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#1F2937" stroke-width="12"
      stroke-dasharray="${arc} ${circ}" stroke-linecap="round"/>
    <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${c}" stroke-width="12"
      stroke-dasharray="${fill} ${circ}" stroke-linecap="round" filter="url(#glow)"/>
  </g>
  <text x="${CX}" y="${CY + 4}" text-anchor="middle" font-size="30" font-weight="800" fill="#F8FAFC">${st.index < 0 ? "—" : pct + "%"}</text>
  <text x="${CX}" y="${CY + 24}" text-anchor="middle" font-size="11" fill="#6B7280" letter-spacing="2">PROGRES</text>
  ${st.index < 0 ? "" : `
  <text x="${CX}" y="${CY + 74}" text-anchor="middle" font-size="12" fill="#9CA3AF">sisa <tspan fill="#F8FAFC" font-weight="700">${fmtRemaining(st.remainingMs)}</tspan></text>
  <text x="${CX}" y="${CY + 92}" text-anchor="middle" font-size="12" fill="#9CA3AF">lalu → <tspan fill="${st.next.color}" font-weight="700">${esc(st.next.label.replace("ON SHIFT · ", "SHIFT "))}</tspan></text>`}

  <line x1="620" y1="72" x2="620" y2="244" stroke="#1F2937"/>
  <line x1="28" y1="250" x2="${W - 28}" y2="250" stroke="#1F2937"/>

  <!-- Lampu indikator -->
  ${lamps}
  <text x="${W - 28}" y="303" text-anchor="end" font-size="10" fill="#4B5563" letter-spacing="2">OPERATOR: ${esc(cfg.operator)} · ${esc(cfg.tagline)}</text>
</svg>`;
}

module.exports = { renderStatus };
