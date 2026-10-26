# EcoPilah (Pilah / Sampah) — Seni Memilah untuk Masa Depan

Situs web edukasi pemilahan sampah interaktif dengan selera desain editorial murni (*Swiss / Grotesk Editorial*), interaksi taktil drag & drop berbasis Pointer Events, visual tong sampah 2-lapisan menggantung (*analog nampan CD-ROM*), tumpukan foto sampah asli (*analog tumpukan CD*), serta mesin audio Web Audio API tanpa dependensi eksternal.

---

## 1. Konsep & Struktur Analogis

| Elemen Referensi CD-ROM | Implementasi EcoPilah | Penjelasan Teknis |
| :--- | :--- | :--- |
| **Nampan CD-ROM** | **Tong Sampah Menggantung** | Menggantung di tengah atas layar, terpotong di tepi atas viewport. Dibagi menjadi dua lapisan (`bin-back` & `bin-front`) agar sampah masuk ke rongga dalam tong secara meyakinkan. |
| **Tumpukan CD Fisik** | **Tumpukan Foto Sampah Asli** | 7 foto objek nyata (*cutout* transparan dengan bayangan lembut): botol plastik, kaleng soda, kulit pisang, baterai bekas, gelas kopi, kardus, dan kertas kusut. Terpotong di tepi bawah layar. |
| **Memasukkan Disc** | **Menyeret Sampah ke Tong** | Pointer Events (`setPointerCapture`) dengan *touch-action: none*. Saat didekatkan, tong bereaksi dan tooltip berubah menjadi *"Lepaskan di sini"*. Saat dilepas, sampah menyusut dan meluncur di antara lapisan tong, memicu getaran elastis (*spring jiggle*) pada tong. |
| **Loading CD Player** | **Loading Editorial Minimalis** | Latar hitam pekat, persentase monospaced 0–100%, garis laser tipis, teks status berputar, dan dentang harmonik (*chime*) saat selesai menuju beranda. |
| **Album / Track Info** | **Homepage Edukasi Lengkap** | 4 pilar pemilahan, direktori sampah interaktif dengan fitur pencarian kilat, garis waktu dekomposisi alam, dan kalkulator dampak limbah keluarga. |

---

## 2. Struktur Berkas Proyek

```
Prototype - T2c 3.0/
├── index.html                 # Struktur semantik HTML5, meta SEO, & font Inter/Syne
├── package.json               # Konfigurasi npm & Vite 6
├── vite.config.js             # Pengaturan server lokal & publicDir
├── public/
│   └── assets/
│       ├── bin/
│       │   ├── bin-back.png   # Lapisan belakang rongga gelap tong
│       │   └── bin-front.png  # Lapisan bibir & badan silinder logam tong
│       └── trash/
│           ├── banana-peel.png    # Sampah organik (kulit pisang)
│           ├── battery.png        # B3 berbahaya (baterai AA)
│           ├── cardboard.png      # Kertas/karton (kardus bergelombang)
│           ├── coffee-cup.png     # Residu/cup (gelas kopi karton)
│           ├── crumpled-paper.png # Kertas daur ulang (kertas kusut)
│           ├── plastic-bottle.png # Plastik PET (botol mineral)
│           └── soda-can.png       # Logam aluminium (kaleng soda)
├── src/
│   ├── main.js                # Orkestrator aplikasi & sinkronisasi audio
│   ├── intro.js               # Kontroler drag & drop, fisika pegas, & aksesibilitas keyboard
│   ├── loading.js             # Kontroler animasi loading & pergantian pesan status
│   ├── home.js                # Kontroler direktori sampah, filter, modal, & kalkulator
│   ├── trash-data.js          # Dataset sampah, kategori, waktu urai, & tips pemilahan
│   ├── sound.js               # Sintesis suara prosedural via Web Audio API (tanpa file mp3)
│   └── style.css              # Tata letak editorial, CSS variables, & animasi keyframes
└── scripts/
    └── process_assets.py      # Skrip pengolah cutout & de-fringing latar belakang
```

---

## 3. Fitur Utama

### A. Fisika Drag & Drop Taktil (Intro)
- **Pointer Events**: Mendukung mouse, layar sentuh (tablet/smartphone), dan stylus tanpa konflik *page scrolling*.
- **Elevasi & Rotasi**: Saat diangkat, z-index otomatis naik ke 999, objek membesar 1.08x, rotasi mengarah tegak lurus secara halus, dan bayangan kontak berubah menjadi bayangan melayang.
- **Deteksi Kedekatan (*Proximity*)**: Saat objek mendekati bukaan tong, tong membesar lembut, bercahaya tipis, teks latar *"Mulai Pilah Sampah"* menyala lebih terang, dan tooltip berubah menjadi *"Lepaskan di sini"*.
- **Pelepasan Sukses**: Objek menyusut (skala 0.3x) dan meluncur ke dalam bukaan tong di antara `bin-back` dan `bin-front`. Tong berguncang dengan animasi recoil beban, memicu efek suara bantingan logam dan memulai layar pemuatan.
- **Pelepasan Gagal**: Objek kembali ke posisi tumpukan semula dengan kurva pegas elastis (*spring bounce*).
- **Aksesibilitas Papan Ketik**: Pengguna dapat menggunakan tombol `Tab` untuk memilih sampah, `Enter` atau `Spasi` untuk mengambil, lalu `Tab` ke tong dan tekan `Enter` untuk memasukkan sampah.

### B. Mesin Audio Sintetis (Web Audio API)
100% mandiri tanpa memerlukan unduhan berkas audio eksternal:
- **Suara Ambil**: Ketukan mikro-taktil saat objek disentuh/diangkat.
- **Suara Dekat Tong**: Dengung harmonik halus saat berada di zona bukaan tong.
- **Suara Jatuh**: Dentuman rongga logam beresonansi rendah berpadu dengan desisan udara saat sampah masuk ke dalam tong.
- **Suara Batal**: Ayunan pegas lembut saat sampah kembali ke tumpukan.
- **Suara Ticking**: Denting minimalis selama pemuatan persentase.
- **Suara Selesai**: Tiga nada akord harmonik saat loading mencapai 100%.
- **Toggle Suara**: Pengaturan suara tersimpan otomatis di `localStorage`.

### C. Homepage Editorial Edukasi
1. **Navigasi & Header**: Judul situs *"Pilah / Sampah"*, pintasan menu, status suara, dan tombol *"Coba Intro Lagi"* untuk kembali ke intro interaktif kapan saja.
2. **Statistik Nasional**: Data timbulan sampah 68,5 juta ton/tahun di Indonesia dan potensi ekonomi sirkular.
3. **4 Pilar Pemilahan**: Kartu editorial Organik (hijau), Daur Ulang (biru), B3 Berbahaya (merah), dan Residu (abu-abu).
4. **Direktori Sampah Interaktif**: Pencarian real-time untuk 13+ jenis barang rumah tangga dengan filter pill kategori dan modal pop-up instruksi pemilahan mendalam.
5. **Garis Waktu Dekomposisi**: Perbandingan waktu urai sampah di alam (2 minggu kulit pisang vs 450 tahun botol plastik vs 1.000.000+ tahun kaca).
6. **Kalkulator Jejak Sampah Keluarga**: Simulasi timbulan sampah bulanan, potensi kompos, pengurangan emisi CO₂, dan estimasi nilai Bank Sampah berdasarkan jumlah anggota keluarga.

---

## 4. Cara Menjalankan Proyek

1. **Jalankan server pengembangan**:
   ```bash
   npm run dev
   ```
2. Buka peramban pada alamat lokal:
   ```
   http://localhost:5174/
   ```
3. **Membangun bundle produksi**:
   ```bash
   npm run build
   ```
