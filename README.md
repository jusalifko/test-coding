# Presence Hub — test-coding

Web app dashboard kehadiran untuk instruktur. Aplikasi memungkinkan instruktur melakukan login sederhana, memantau kehadiran pribadi, melihat total dan persentase kehadiran murid, serta memfilter riwayat absensi.

## Fitur

- Login client-side dengan validasi email dan password (minimal 6 karakter).
- Data murid diambil melalui REST API [DummyJSON Users](https://dummyjson.com/docs/users) menggunakan `fetch`.
- Data kehadiran lokal yang deterministik, dibuat dari daftar murid DummyJSON untuk melengkapi API tanpa memerlukan backend.
- Dashboard ringkasan: total check-in, persentase, status kehadiran, dan aktivitas terbaru.
- Halaman kehadiran personal dan murid dengan filter status, tanggal, nama/email, serta murid.
- State loading, error saat API gagal, empty state, dan validasi bentuk respons API.
- Layout responsif untuk desktop maupun mobile.

## Menjalankan aplikasi

Prasyarat: Node.js 18 atau yang lebih baru.

```bash
npm install
npm run dev
```

Buka alamat yang muncul di terminal (umumnya `http://localhost:5173`). Untuk build produksi:

```bash
npm run build
npm run preview
```

Untuk masuk, gunakan email yang valid dan password minimal 6 karakter. Nilai demo telah diisikan pada form login.

## Teknologi

- React 19 + JavaScript
- Vite sebagai build tool
- Fetch API untuk integrasi DummyJSON
- CSS vanilla, dengan desain responsif dan tanpa library UI tambahan

## Struktur kode

- `src/api/` — komunikasi API dan normalisasi/validasi data eksternal.
- `src/lib/` — generator data kehadiran serta fungsi pemrosesan/filtering yang terpisah dari UI.
- `src/components/` — komponen presentasi yang dapat dipakai ulang.
- `src/App.jsx` — komposisi halaman dan state aplikasi.

## Catatan data

DummyJSON menyediakan data pengguna tetapi tidak menyertakan data absensi. Karena itu, setiap murid dari API dipetakan ke catatan kehadiran lokal yang deterministik untuk 28 hari belajar terakhir. Pendekatan ini menjaga demonstrasi filter dan perhitungan statistik tetap konsisten setiap kali aplikasi dibuka, tanpa backend tambahan.
