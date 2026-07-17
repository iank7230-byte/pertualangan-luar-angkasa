# 🚀 Eduspace — Mengenal Tata Surya

> **Media Pembelajaran Interaktif IPA Kelas VII — Kurikulum Merdeka**

Platform edukasi berbasis web yang menggabungkan ensiklopedia tata surya, permainan interaktif, dan kuis pengetahuan dalam satu pengalaman belajar yang menyenangkan.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 📚 **Ensiklopedia** | Materi lengkap 8 planet + Matahari, dilengkapi foto, data tabel, fakta, dan ringkasan |
| 🎮 **Level 1 – Urutan Orbit** | Klik planet yang mengorbit secara animasi sesuai urutan dari Matahari |
| 🧩 **Level 2 – Cocokkan Planet** | Cocokkan nama planet dengan gambar visualnya |
| ✅ **Level 3 – Benar atau Salah** | 15 pernyataan sains yang harus dinilai benar/salah |
| 🧠 **Level 4 – Quiz Adventure** | 10 soal pilihan ganda bergambar tentang tata surya |
| 🛸 **Level 5 – Mission Space** | Game pesawat: tangkap bintang jatuh untuk memicu kuis |
| 🏆 **Papan Prestasi** | Rekap skor XP, misi selesai, dan lencana pencapaian |
| 🔊 **Sistem Audio** | BGM retro + efek suara interaktif (benar, salah, klik, menang) |

---

## 🗂️ Struktur Proyek

```
tata-surya/
├── index.html              # Entry point — SPA shell & modal
├── css/
│   └── style.css           # Custom CSS + animasi orbit + media queries
├── js/
│   ├── core/
│   │   ├── storage.js      # GameState — skor, progres, localStorage
│   │   ├── sound.js        # SoundManager — BGM (mp3) + SFX (Web Audio API)
│   │   ├── dialog.js       # Dialog.alert / Dialog.confirm
│   │   └── router.js       # SPA Router — navigasi halaman tanpa reload
│   ├── data/
│   │   ├── assets.js       # Konstanta URL gambar (ASSETS)
│   │   ├── materi.js       # DATABASE_MATERI — konten ensiklopedia planet
│   │   └── quiz.js         # DATABASE_QUIZ — bank soal kuis
│   ├── pages/
│   │   ├── pages.js        # Template HTML tiap halaman (Pages object)
│   │   └── materi-page.js  # Logika halaman ensiklopedia (MateriPage)
│   ├── levels/
│   │   ├── level1.js       # Game orbit planet (auto-scale responsive)
│   │   ├── level2.js       # Game cocokkan planet
│   │   ├── level3.js       # Kuis benar/salah
│   │   ├── level4.js       # Kuis pilihan ganda
│   │   └── level5.js       # Game Mission Space (canvas HTML5)
│   └── main.js             # Inisialisasi app, fungsi global
└── assets/
    └── audio/
        └── bgm.mp3         # Musik latar retro/space
```

---

## 🛠️ Teknologi

- **HTML5** — struktur SPA (Single Page Application)
- **Vanilla CSS** — animasi orbit, efek glassmorphism, media queries responsif
- **Tailwind CSS** (CDN) — utility classes
- **Vanilla JavaScript** — logika game & navigasi tanpa framework
- **Web Audio API** — efek suara (SFX)
- **HTML5 Canvas** — game Mission Space (Level 5)
- **localStorage** — penyimpanan progres & skor pemain
- **Google Fonts** — Fredoka + Luckiest Guy

---

## 🎮 Cara Bermain

1. **Buka** `index.html` di browser (tidak memerlukan server backend)
2. **Masukkan nama** kosmonaut Anda di halaman splash
3. **Pilih menu** utama: Materi, Game, atau Kuis
4. **Selesaikan semua 5 level** untuk mendapatkan lencana tertinggi
5. **Cek Papan Prestasi** untuk melihat skor XP dan riwayat misi

### Kontrol Game Level 5 (Mission Space)
| Platform | Kontrol |
|---|---|
| Desktop | Tombol `←` / `→` keyboard |
| Mobile | Tombol **KIRI** / **KANAN** di bawah canvas |

---

## 📱 Responsivitas

Aplikasi sepenuhnya responsif untuk semua ukuran layar:

- **Mobile** (< 640px) — layout stack vertikal, orbit auto-scale, canvas game menyesuaikan
- **Tablet** (641–1023px) — layout hybrid 
- **Desktop** (≥ 1024px) — layout grid penuh

---

## 🏅 Sistem Poin & Lencana

| Aktivitas | XP |
|---|---|
| Membaca materi | +10 XP per planet |
| Level 1 selesai | +800 XP |
| Level 2 selesai | +600 XP |
| Level 3 selesai | +750 XP |
| Level 4 selesai | +800 XP |
| Level 5 selesai | +1000 XP |
| Menjawab benar | +100–150 XP per soal |

| Lencana | Syarat |
|---|---|
| 🪐 Space Cadet | Memulai perjalanan |
| ⭐ Star Explorer | Skor > 500 XP |
| 🚀 Orbit Master | Skor > 1500 XP |
| 🌌 Galaxy Commander | Skor > 3000 XP |
| 🏆 Supreme Cosmonaut | Semua level selesai |

---

## 🚀 Menjalankan Proyek

Tidak perlu instalasi atau server — cukup buka file langsung di browser:

```bash
# Metode 1: Buka langsung
open tata-surya/index.html

# Metode 2: Server lokal (opsional, untuk menghindari CORS pada audio)
cd tata-surya
python3 -m http.server 8080
# Buka: http://localhost:8080
```

> **Catatan:** Jika file audio BGM tidak terputar, gunakan server lokal (metode 2) karena browser memblokir file audio lokal karena kebijakan CORS.

---

## 📋 Persyaratan Browser

| Browser | Versi Minimum |
|---|---|
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Mobile Chrome | 90+ |
| Mobile Safari | 14+ |

---

## 👨‍💻 Pengembangan

Proyek ini dikembangkan sebagai **media pembelajaran digital** untuk mata pelajaran IPA Kelas VII SMP, sesuai Kurikulum Merdeka.

- **Versi:** 7.0 (Enhanced Responsive Edition)
- **Tahun:** 2026
- **Mata Pelajaran:** Ilmu Pengetahuan Alam (IPA)
- **Jenjang:** SMP / MTs Kelas VII

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan pendidikan. Seluruh konten materi mengacu pada kurikulum resmi IPA Kelas VII Kurikulum Merdeka.

---

*Selamat belajar di Eduspace, Sobat IPA! 🌍🪐⭐*
"# pertualangan-luar-angkasa" 
