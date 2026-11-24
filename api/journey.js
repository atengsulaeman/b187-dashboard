const svg = require("../lib/journey-svg");

module.exports = (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  // Peta statis: boleh di-cache 1 hari
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.status(200).send(svg);
};
