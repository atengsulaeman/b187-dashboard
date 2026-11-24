const cfg = require("../config");

const H = 3600 * 1000;
const TZ = "Asia/Jayapura";

// Satu siklus = 72 jam, dimulai dari shift pagi jam 07:00 WIT
const PHASES = [
  { key: "PAGI",  label: "ON SHIFT · PAGI",  sub: "Shift pagi 07:00–19:00 WIT",  hours: 12, color: "#FFB020" },
  { key: "CODE",  label: "CODING TIME",      sub: "Di luar jam kerja · ngoding", hours: 24, color: "#00F5FF" },
  { key: "MALAM", label: "ON SHIFT · MALAM", sub: "Shift malam 19:00–07:00 WIT", hours: 12, color: "#8B5CF6" },
  { key: "OFF",   label: "OFF DAY",          sub: "Hari libur · belajar & build", hours: 24, color: "#3ECF8E" },
];

function localDateKey(d) {
  // YYYY-MM-DD di zona WIT
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
}

function getStatus(now = new Date()) {
  const anchor = Date.parse(cfg.anchor);
  const cycle = 72 * H;
  const elapsed = (((now - anchor) % cycle) + cycle) % cycle;

  let start = 0, idx = 0;
  for (let i = 0; i < PHASES.length; i++) {
    const end = start + PHASES[i].hours * H;
    if (elapsed < end) { idx = i; break; }
    start = end;
  }
  const phase = PHASES[idx];
  const dur = phase.hours * H;
  const into = elapsed - start;

  const result = {
    ...phase,
    index: idx,
    progress: into / dur,
    remainingMs: dur - into,
    next: PHASES[(idx + 1) % PHASES.length],
    override: null,
  };

  const ov = cfg.overrides[localDateKey(now)];
  if (ov) {
    Object.assign(result, {
      key: "OVR", label: String(ov).toUpperCase(), sub: "Jadwal khusus hari ini",
      color: "#FF007F", index: -1, override: ov,
    });
  }
  return result;
}

module.exports = { getStatus, PHASES, TZ };
