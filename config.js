// ============================================
//  KONFIGURASI UNIT B-187 — ubah di sini saja
// ============================================
module.exports = {
  unit: "B-187",
  model: "SHACMAN F3000",
  company: "PT TLH",
  site: "WEDA BAY · HALMAHERA TENGAH",
  operator: "ATENG SULAEMAN",
  tagline: "FROM MINING TO CODING",

  // Awal SHIFT PAGI dari salah satu siklus (jam WIT).
  // Siklus 3 hari: Pagi 07-19 -> jeda -> Malam 19-07 -> Off -> ulang.
  // Kalau rotasi berubah, cukup ganti tanggal ini ke shift pagi terbaru.
  anchor: "2026-11-23T07:00:00+09:00",

  // Pengecualian (cuti, tukar shift, dll). Format "YYYY-MM-DD": "TEKS"
  // Contoh: "2026-12-24": "CUTI"
  overrides: {
  },
};
