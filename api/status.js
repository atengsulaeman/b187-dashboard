const { getStatus } = require("../lib/shift");
const { renderStatus } = require("../lib/render");

module.exports = (req, res) => {
  // ?t=2026-11-25T03:00:00+09:00 untuk uji coba jam tertentu
  const t = req.query && req.query.t ? new Date(req.query.t) : new Date();
  const now = isNaN(t) ? new Date() : t;

  const svg = renderStatus(getStatus(now), now);

  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  // Anti-cache supaya proxy gambar GitHub cepat ambil versi terbaru
  res.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
  res.setHeader("Expires", "0");
  res.status(200).send(svg);
};
