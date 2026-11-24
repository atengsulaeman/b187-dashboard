# 🚛 B-187 Dashboard

Panel status live **Unit B-187 · Shacman F3000** untuk GitHub profile Atsu.
Status shift dihitung otomatis dari siklus 3 hari (Pagi → Malam → Off), berlaku selamanya.

## Struktur

```
config.js        ← data unit, tanggal patokan, cuti (ubah di sini)
lib/shift.js     ← rumus siklus shift (WIT)
lib/render.js    ← desain panel SVG
api/status.js    ← endpoint Vercel → /api/status
```

## Deploy ke Vercel (dari HP)

1. Buat repo baru di GitHub bernama `b187-dashboard`, lalu upload semua file ini (struktur foldernya harus sama).
2. Buka **vercel.com**, pilih *Continue with GitHub*, lalu **Add New → Project**, pilih `b187-dashboard`, lalu **Deploy**.
3. Buka `https://NAMA-PROJECT.vercel.app/api/status`. Kalau panel muncul, berarti berhasil.

## Pasang di README profil

```html
<div align="center">
  <img src="https://NAMA-PROJECT.vercel.app/api/status" width="100%" alt="Unit B-187 Status"/>
</div>
```

## Uji jam tertentu

`/api/status?t=2026-11-26T10:00:00%2B09:00`

## Cuti / tukar shift

Tambahkan di `config.js` → `overrides`:

```js
overrides: { "2026-12-24": "CUTI" }
```

Kalau rotasi berubah total, cukup ganti `anchor` ke jam 07:00 shift pagi terbaru.
