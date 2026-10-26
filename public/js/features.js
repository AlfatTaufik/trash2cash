/**
 * ====================================================================
 * FITUR APLIKASI — CIRCULAR FAN-DECK INTERACTIVE CONTROLLER (JS)
 * Proyek: EcoPilah / Trash2Cash 3.0
 * Fitur:
 *  - 10 Kartu Fitur dari Array Tunggal yang Mudah Disesuaikan
 *  - Busur Lingkaran Besar Cembung ke Atas (Pusat di Bawah Layar)
 *  - Putaran Mengikuti Scroll dengan Sticky Stage & rAF Inertia (Lerp)
 *  - Drag / Swipe Horizontal dengan Pointer Events & Momentum
 *  - Navigasi Keyboard (Panah Kiri / Kanan & Tab Focus)
 *  - Hover / Focus Radial Elevation & Tilt Straightening (450ms)
 *  - Modal Detail Panel dengan Focus Trap & Tombol Tutup / Esc
 *  - Pause Otomatis Menggunakan IntersectionObserver saat Di Luar Layar
 * ====================================================================
 */

// ====================================================================
// 1. KONSTANTA & PENGATURAN YANG MUDAH DIUBAH
// ====================================================================
export const FEATURES_CONFIG = {
  // Sudut antar-kartu (dalam derajat)
  stepAngleDesktop: 9.8,
  stepAngleMobile: 16.5,

  // Faktor kehalusan gerak (lerp / inertia, 0.05 = sangat lambat/lembut, 0.15 = cepat)
  lerpFactor: 0.09,

  // Sensitivitas drag pointer horizontal
  dragSensitivity: 0.0016,

  // Ambang sudut batas untuk visibilitas kartu (optimasi render)
  cullAngleThreshold: 72,

  // Durasi transisi hover (ms)
  hoverDuration: 450,
};

// ====================================================================
// 2. DATA FITUR (ARRAY TUNGGAL — EDIT, TAMBAH, ATAU UBAH DENGAN MUDAH)
// ====================================================================
export const FEATURES_DATA = [
  {
    id: 'scan-sampah',
    title: 'Scan Sampah',
    tagline: 'Foto sampahmu, langsung tahu tong-nya.',
    description: 'Kecerdasan buatan visi komputer menganali material sampah secara instan dari kamera ponselmu dan memandu ke tong pemilahan yang tepat tanpa ragu.',
    // Gradasi hijau segar organik
    colors: ['#8DF0A9', '#32B870', '#136136'],
    ink: '#073318',
    icon: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Viewfinder brackets -->
        <path d="M18 32 V20 H30" />
        <path d="M82 32 V20 H70" />
        <path d="M18 68 V80 H30" />
        <path d="M82 68 V80 H70" />
        <!-- Scan Beam Laser -->
        <line x1="22" y1="50" x2="78" y2="50" stroke-dasharray="3 3" />
        <!-- Central Leaf Icon -->
        <path d="M50 30 C38 30 34 44 38 56 C42 68 50 72 50 72 C50 72 58 68 62 56 C66 44 62 30 50 30 Z" />
        <path d="M50 34 Q50 52 40 62" />
      </svg>
    `
  },
  {
    id: 'panduan-pilah',
    title: 'Panduan Pilah',
    tagline: 'Organik, anorganik, B3 dalam satu panduan.',
    description: 'Direktori komprehensif cara memilah limbah rumah tangga dengan standar baku pemilahan nasional, kiat pencucian wadah, dan protokol aman penanganan B3.',
    // Gradasi kuning hangat ke oranye citrus
    colors: ['#FFE277', '#FFA435', '#F16918'],
    ink: '#3D1702',
    icon: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Buku Terbuka -->
        <path d="M50 28 C42 22 28 22 18 25 V75 C28 72 42 72 50 78 C58 72 72 72 82 75 V25 C72 22 58 22 50 28 Z" />
        <line x1="50" y1="28" x2="50" y2="78" />
        <!-- 3 Tab Pemilahan -->
        <path d="M26 38 H42" />
        <path d="M26 48 H38" />
        <path d="M58 38 H74" />
        <path d="M58 48 H70" />
        <!-- Bookmark Ribbon -->
        <path d="M48 20 V38 L53 34 L58 38 V20" />
      </svg>
    `
  },
  {
    id: 'kamus-sampah',
    title: 'Kamus Sampah',
    tagline: 'Cari ribuan jenis sampah.',
    description: 'Basis data cerdas pencarian material produk, kemasan sachet multi-lapis, simbol segitiga resin plastik (PET, HDPE, PVC, PP), serta kelayakan daur ulangnya.',
    // Gradasi biru muda anorganik
    colors: ['#A0E7FF', '#57B5FD', '#1C6DD0'],
    ink: '#08254A',
    icon: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Kaca Pembesar -->
        <circle cx="44" cy="44" r="24" />
        <line x1="62" y1="62" x2="84" y2="84" stroke-width="2.6" />
        <!-- Simbol Daur Ulang di Dalam Lensa -->
        <path d="M44 28 L49 35 H39 Z" />
        <path d="M49 35 L40 48" />
        <path d="M34 50 L31 42 L39 44" />
        <path d="M54 50 L48 42 L52 38" />
      </svg>
    `
  },
  {
    id: 'bank-sampah',
    title: 'Bank Sampah',
    tagline: 'Temukan titik setor di sekitarmu.',
    description: 'Peta interaktif titik jemput dan drop-box bank sampah binaan terdekat lengkap dengan radius jarak, jam operasional, dan taksiran harga setor terkini.',
    // Gradasi teal bercahaya
    colors: ['#82F3EB', '#22C8BE', '#0E7D77'],
    ink: '#05312E',
    icon: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Pin Lokasi -->
        <path d="M50 16 C34 16 22 28 22 43 C22 62 50 84 50 84 C50 84 78 62 78 43 C78 28 66 16 50 16 Z" />
        <!-- Lingkaran Inti / Tunas -->
        <circle cx="50" cy="42" r="13" />
        <path d="M50 36 V48" />
        <path d="M44 42 Q50 38 56 42" />
        <!-- Gelombang Radar -->
        <path d="M36 88 Q50 94 64 88" stroke-dasharray="3 3" />
      </svg>
    `
  },
  {
    id: 'jadwal-angkut',
    title: 'Jadwal Angkut',
    tagline: 'Tak pernah lewat hari angkut.',
    description: 'Kalender pintar pengangkutan sampah terpilah terjadwal di wilayah RT/RW Anda dengan pengingat notifikasi H-1 sebelum armada tiba.',
    // Gradasi peach hangat ke aprikot
    colors: ['#FFD7BE', '#FFA27E', '#EA6144'],
    ink: '#431709',
    icon: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Lembar Kalender -->
        <rect x="20" y="24" width="60" height="58" rx="8" />
        <line x1="20" y1="40" x2="80" y2="40" />
        <line x1="36" y1="16" x2="36" y2="28" stroke-width="2.2" />
        <line x1="64" y1="16" x2="64" y2="28" stroke-width="2.2" />
        <!-- Jam / Pengingat -->
        <circle cx="50" cy="58" r="14" />
        <polyline points="50,50 50,58 57,61" />
      </svg>
    `
  },
  {
    id: 'poin-hadiah',
    title: 'Poin & Hadiah',
    tagline: 'Setiap pilahan ada nilainya.',
    description: 'Konversikan setiap kilogram limbah bernilai ekonomi menjadi poin digital yang dapat dicairkan ke saldo e-wallet, voucher sembako, atau token listrik.',
    // Gradasi merah muda ke merah ceri B3/hadiah
    colors: ['#FFB3CB', '#FA5883', '#D6194E'],
    ink: '#3B0513',
    icon: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Kotak Kado Hadiah -->
        <rect x="24" y="38" width="52" height="46" rx="6" />
        <rect x="20" y="28" width="60" height="12" rx="4" />
        <!-- Pita Tegak -->
        <line x1="50" y1="28" x2="50" y2="84" stroke-width="2" />
        <!-- Pita Simpul Cantik -->
        <path d="M50 28 C42 16 28 20 36 28 Z" />
        <path d="M50 28 C58 16 72 20 64 28 Z" />
        <!-- Kilauan Bintang -->
        <path d="M80 18 L83 24 L89 25 L84 29 L86 35 L80 32 L74 35 L76 29 L71 25 L77 24 Z" />
      </svg>
    `
  },
  {
    id: 'kuis-edukasi',
    title: 'Kuis Edukasi',
    tagline: 'Belajar sambil bermain.',
    description: 'Asah pengetahuan kelestarian lingkungan lewat kuis interaktif harian. Dapatkan poin ganda, pelajari fakta daur ulang, dan raih badge edukator sirkular.',
    // Gradasi lavender ke royal purple
    colors: ['#E4CBFF', '#AE84F7', '#6E3FE9'],
    ink: '#210A4D',
    icon: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Bohlam Lampu Ide -->
        <path d="M34 40 C34 28 41 20 50 20 C59 20 66 28 66 40 C66 48 60 54 58 58 H42 C40 54 34 48 34 40 Z" />
        <rect x="42" y="62" width="16" height="5" rx="2" />
        <rect x="45" y="70" width="10" height="4" rx="2" />
        <!-- Kilau Petir Inspirasi di Dalam -->
        <path d="M51 28 L45 42 H53 L47 54" stroke-width="1.8" />
        <!-- Radiasi Cahaya Ide -->
        <line x1="24" y1="36" x2="16" y2="34" />
        <line x1="76" y1="36" x2="84" y2="34" />
        <line x1="50" y1="12" x2="50" y2="6" />
      </svg>
    `
  },
  {
    id: 'tantangan-harian',
    title: 'Tantangan Harian',
    tagline: 'Bangun kebiasaan baik.',
    description: 'Rangkaian misi ringkas harian seperti "Bawa Tumbler Sendiri" atau "Setor 2 Botol PET" untuk menjaga streak konsistensi dan membuka reward istimewa mingguan.',
    // Gradasi kuning mentari lembut
    colors: ['#FFF6AB', '#F9D64E', '#E6AB1A'],
    ink: '#3A2C02',
    icon: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Sasaran Target Bullseye -->
        <circle cx="50" cy="50" r="32" />
        <circle cx="50" cy="50" r="20" />
        <circle cx="50" cy="50" r="8" fill="currentColor" fill-opacity="0.3" />
        <!-- Anak Panah Menancap -->
        <path d="M74 26 L56 44" stroke-width="2.2" />
        <polyline points="66,22 78,22 78,34" stroke-width="2" />
        <line x1="72" y1="28" x2="78" y2="22" stroke-width="2" />
      </svg>
    `
  },
  {
    id: 'dampak-saya',
    title: 'Dampak Saya',
    tagline: 'Lihat kontribusimu untuk bumi.',
    description: 'Statistik jejak hijau personal yang mengkalkulasi pengurangan emisi karbon (kg CO₂e), penghematan air tanah, dan pohon terselamatkan dari aksi pemilahanmu.',
    // Gradasi mint emerald segar
    colors: ['#A0F8D8', '#42DEA7', '#1BA574'],
    ink: '#083D28',
    icon: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Garis Bujur & Lintang Bumi -->
        <circle cx="50" cy="46" r="28" />
        <ellipse cx="50" cy="46" rx="14" ry="28" />
        <line x1="22" y1="46" x2="78" y2="46" />
        <!-- Tunas Hijau Muncul di Atas Bumi -->
        <path d="M50 18 C46 10 38 8 38 8 C38 8 38 18 46 22" />
        <path d="M50 18 C54 10 62 8 62 8 C62 8 62 18 54 22" />
        <line x1="50" y1="18" x2="50" y2="28" stroke-width="2" />
      </svg>
    `
  },
  {
    id: 'komunitas',
    title: 'Komunitas',
    tagline: 'Pilah bersama tetangga.',
    description: 'Bergabung dalam gerakan gotong royong pemilahan sampah antar-warga RT/RW, adakan kerja bakti digital, dan raih predikat Lingkungan Asri Berkelanjutan.',
    // Gradasi midnight ocean navy elegan (kartu gelap dengan teks putih)
    colors: ['#3561A2', '#1C3F77', '#0A2044'],
    ink: '#F5F9FD',
    icon: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Figur Manusia Tengah (Utama) -->
        <circle cx="50" cy="34" r="10" />
        <path d="M34 68 C34 54 41 48 50 48 C59 48 66 54 66 68" />
        <!-- Figur Kiri -->
        <circle cx="28" cy="42" r="7" />
        <path d="M16 70 C16 60 21 55 28 55 C33 55 37 58 39 63" />
        <!-- Figur Kanan -->
        <circle cx="72" cy="42" r="7" />
        <path d="M61 63 C63 58 67 55 72 55 C79 55 84 60 84 70" />
        <!-- Lingkaran Solidaritas di Bawah -->
        <path d="M22 78 Q50 90 78 78" stroke-dasharray="3 3" />
      </svg>
    `
  }
];

// ====================================================================
// 3. KELAS KONTROLER UTAMA: FeaturesFanController
// ====================================================================
export class FeaturesFanController {
  constructor(options = {}) {
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container || document.getElementById('featuresSection');

    if (!this.container) {
      console.warn('FeaturesFanController: Container section tidak ditemukan.');
      return;
    }

    this.data = options.data || FEATURES_DATA;
    this.totalCards = this.data.length;

    // Cache elemen-elemen DOM
    this.stage = this.container.querySelector('.features-stage') || this.container;
    this.fanTrack = this.container.querySelector('.features-fan-track');
    this.progressBar = this.container.querySelector('.features-progress-bar');
    this.counterCurrent = this.container.querySelector('.features-counter-current');
    this.counterTotal = this.container.querySelector('.features-counter-total');
    this.btnPrev = this.container.querySelector('#btnFeaturesPrev');
    this.btnNext = this.container.querySelector('#btnFeaturesNext');

    // Modal elements
    this.modal = document.getElementById('featuresDetailModal');
    this.modalCard = document.getElementById('modalDetailCard');
    this.modalTitle = document.getElementById('modalDetailTitle');
    this.modalTagline = document.getElementById('modalDetailTagline');
    this.modalDesc = document.getElementById('modalDetailDesc');
    this.modalClose = document.getElementById('btnFeaturesModalClose');
    this.modalAction = document.getElementById('btnFeaturesModalAction');

    // Variabel kalkulasi gerak
    this.currentPosition = 0; // Float index aktif (0 hingga totalCards - 1)
    this.targetPosition = 0;  // Posisi target scroll / drag
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartTarget = 0;
    this.rAFId = null;
    this.isIntersecting = true;
    this.activeCardIndex = 0;

    // Responsive step angle
    this.stepAngle = this.getResponsiveStepAngle();

    // Inisialisasi
    this.init();
  }

  getResponsiveStepAngle() {
    return window.innerWidth <= 680
      ? FEATURES_CONFIG.stepAngleMobile
      : FEATURES_CONFIG.stepAngleDesktop;
  }

  init() {
    // 1. Render kartu secara dinamis dari array tunggal
    this.renderCards();

    // 2. Setup counter total
    if (this.counterTotal) {
      this.counterTotal.textContent = String(this.totalCards).padStart(2, '0');
    }

    // 3. Atur CSS variable jumlah kartu pada wrapper
    this.container.style.setProperty('--total-cards', this.totalCards);

    // 4. Bind event listeners
    this.bindEvents();

    // 5. Setup IntersectionObserver untuk menghemat resource bila tidak tampak
    this.setupObserver();

    // 6. Jalankan rendering posisi awal
    this.updateCardPositions(true);

    // 7. Mulai loop animasi rAF
    this.startRAF();
  }

  // ====================================================================
  // 4. GENERASI ELEMEN KARTU DINAMIS (SEMANTIK, AKSESIBEL, BERSIH)
  // ====================================================================
  renderCards() {
    if (!this.fanTrack) return;
    this.fanTrack.innerHTML = '';

    const fragment = document.createDocumentFragment();

    this.data.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'feature-card';
      card.id = `featureCard-${item.id}`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${item.title}: ${item.tagline}. ${item.description}`);
      card.dataset.index = index;

      // Konfigurasi warna gradasi & tinta khusus kartu ini
      const gradStops = item.colors.join(', ');
      card.style.background = `linear-gradient(145deg, ${gradStops})`;
      card.style.setProperty('--card-ink', item.ink);

      card.innerHTML = `
        <!-- Overlay Grain Halus (SVG feTurbulence) -->
        <div class="feature-card-grain" aria-hidden="true"></div>

        <!-- Bingkai Dalam Tipis 1px Putih Inset ~3% -->
        <div class="feature-card-inner-border" aria-hidden="true"></div>

        <!-- Ilustrasi Garis (Line-Art) Samar & Besar di Kanan Bawah -->
        <div class="feature-card-icon-art" aria-hidden="true">
          ${item.icon}
        </div>

        <!-- Konten Teks: Judul di Kiri Atas & Tagline di Kiri Bawah -->
        <div class="feature-card-content">
          <div class="feature-card-title-wrap">
            <h3 class="feature-card-title">${item.title}</h3>
          </div>

          <p class="feature-card-tagline">${item.tagline}</p>
        </div>

        <!-- Hint Tombol Expand -->
        <div class="feature-card-tap-hint" aria-hidden="true" title="Buka Detail Fitur">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </div>
      `;

      fragment.appendChild(card);
    });

    this.fanTrack.appendChild(fragment);
    this.cards = Array.from(this.fanTrack.querySelectorAll('.feature-card'));
  }

  // ====================================================================
  // 5. EVENT BINDINGS (SCROLL, DRAG, KEYBOARD, TOUCH, MODAL)
  // ====================================================================
  bindEvents() {
    // A. Scroll Event (Window scroll dihitung relatif terhadap tinggi wrapper)
    this.onScrollHandler = () => this.handleScroll();
    window.addEventListener('scroll', this.onScrollHandler, { passive: true });

    // B. Window Resize (Update step angle & metrics)
    this.onResizeHandler = () => {
      this.stepAngle = this.getResponsiveStepAngle();
      this.handleScroll();
    };
    window.addEventListener('resize', this.onResizeHandler, { passive: true });

    // C. Pointer Events Drag (Pointerdown, move, up) pada fan track
    if (this.fanTrack) {
      this.fanTrack.addEventListener('pointerdown', (e) => this.onPointerDown(e));
      window.addEventListener('pointermove', (e) => this.onPointerMove(e));
      window.addEventListener('pointerup', () => this.onPointerUp());
      window.addEventListener('pointercancel', () => this.onPointerUp());
    }

    // D. Klik & Fokus Kartu
    this.cards.forEach((card, idx) => {
      // Klik membuka modal detail
      card.addEventListener('click', (e) => {
        // Jika baru saja selesai drag substansial, jangan buka modal
        if (this.hasDragged) return;
        this.openDetailModal(idx);
      });

      // Keyboard focus: angkat kartu dan sesuaikan posisi target
      card.addEventListener('focus', () => {
        this.targetPosition = idx;
        card.classList.add('is-active-focus');
      });

      card.addEventListener('blur', () => {
        card.classList.remove('is-active-focus');
      });

      // Enter / Space untuk membuka modal detail dari keyboard
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openDetailModal(idx);
        }
      });
    });

    // E. Navigasi Keyboard Global (Panah Kiri / Panah Kanan)
    this.onKeydownHandler = (e) => {
      // Jangan intervensi jika modal sedang terbuka
      if (this.isModalOpen) {
        if (e.key === 'Escape') this.closeDetailModal();
        return;
      }

      if (!this.isIntersecting) return;

      if (e.key === 'ArrowLeft') {
        this.stepTo(Math.max(0, Math.round(this.targetPosition) - 1));
      } else if (e.key === 'ArrowRight') {
        this.stepTo(Math.min(this.totalCards - 1, Math.round(this.targetPosition) + 1));
      }
    };
    window.addEventListener('keydown', this.onKeydownHandler);

    // F. Tombol Navigasi Alternatif (Hint Buttons)
    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', () => {
        this.stepTo(Math.max(0, Math.round(this.targetPosition) - 1));
      });
    }
    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => {
        this.stepTo(Math.min(this.totalCards - 1, Math.round(this.targetPosition) + 1));
      });
    }

    // G. Modal Close Handlers
    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => this.closeDetailModal());
    }
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeDetailModal();
      });
    }
  }

  // ====================================================================
  // 6. LOGIKA SCROLL-DRIVEN ROTATION (STICKY SECTION PROGRESS)
  // ====================================================================
  handleScroll() {
    if (!this.container) return;

    const rect = this.container.getBoundingClientRect();
    const scrollDist = -rect.top;
    const maxScroll = this.container.offsetHeight - window.innerHeight;

    if (maxScroll <= 0) return;

    // Hitung progres scroll p dari 0.0 sampai 1.0
    const rawProgress = scrollDist / maxScroll;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));

    // Update progress bar garis atas 2px
    if (this.progressBar) {
      this.progressBar.style.width = `${(clampedProgress * 100).toFixed(2)}%`;
    }

    // Target posisi aktif (dari 0 sampai totalCards - 1)
    if (!this.isDragging) {
      this.targetPosition = clampedProgress * (this.totalCards - 1);
    }
  }

  stepTo(newTargetIndex) {
    this.targetPosition = Math.max(0, Math.min(this.totalCards - 1, newTargetIndex));

    // Sinkronkan scroll window jika diinginkan
    const maxScroll = this.container.offsetHeight - window.innerHeight;
    if (maxScroll > 0) {
      const containerTop = this.container.getBoundingClientRect().top + window.pageYOffset;
      const targetScroll = containerTop + (this.targetPosition / (this.totalCards - 1)) * maxScroll;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }

  // ====================================================================
  // 7. DRAG DENGAN POINTER EVENTS & SINKRONISASI
  // ====================================================================
  onPointerDown(e) {
    if (e.button !== 0) return; // Hanya klik kiri
    this.isDragging = true;
    this.hasDragged = false;
    this.dragStartX = e.clientX;
    this.dragStartTarget = this.targetPosition;
    this.fanTrack.classList.add('is-dragging');
  }

  onPointerMove(e) {
    if (!this.isDragging) return;
    const deltaX = e.clientX - this.dragStartX;

    if (Math.abs(deltaX) > 6) {
      this.hasDragged = true;
    }

    // Menggeser kipas: drag ke kiri memutar kartu ke kanan (maju)
    const deltaPos = -deltaX * FEATURES_CONFIG.dragSensitivity;
    this.targetPosition = Math.max(0, Math.min(this.totalCards - 1, this.dragStartTarget + deltaPos));
  }

  onPointerUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.fanTrack.classList.remove('is-dragging');

    // Sinkronkan posisi scroll halaman dengan posisi target hasil drag
    const maxScroll = this.container.offsetHeight - window.innerHeight;
    if (maxScroll > 0) {
      const containerTop = this.container.getBoundingClientRect().top + window.pageYOffset;
      const targetScroll = containerTop + (this.targetPosition / (this.totalCards - 1)) * maxScroll;
      window.scrollTo({
        top: targetScroll,
        behavior: 'auto'
      });
    }

    // Reset flag hasDragged setelah delay singkat
    setTimeout(() => {
      this.hasDragged = false;
    }, 120);
  }

  // ====================================================================
  // 8. INTERSECTION OBSERVER (HEMAT BATERAI & CPU)
  // ====================================================================
  setupObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isIntersecting = entry.isIntersecting;
          if (this.isIntersecting) {
            this.startRAF();
          } else {
            this.stopRAF();
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(this.container);
  }

  startRAF() {
    if (!this.rAFId) {
      const loop = () => {
        this.updateCardPositions();
        this.rAFId = requestAnimationFrame(loop);
      };
      this.rAFId = requestAnimationFrame(loop);
    }
  }

  stopRAF() {
    if (this.rAFId) {
      cancelAnimationFrame(this.rAFId);
      this.rAFId = null;
    }
  }

  // ====================================================================
  // 9. ANIMASI POSISI KARTU DENGAN LERP MOMENTUM & Z-INDEX
  // ====================================================================
  updateCardPositions(forceImmediate = false) {
    if (forceImmediate) {
      this.currentPosition = this.targetPosition;
    } else {
      // Penghalusan gerak (lerp: current += (target - current) * factor)
      const diff = this.targetPosition - this.currentPosition;
      this.currentPosition += diff * FEATURES_CONFIG.lerpFactor;
    }

    // Hitung kartu aktif yang berada paling dekat dengan tengah (0 derajat)
    const activeIdx = Math.round(this.currentPosition);
    if (activeIdx !== this.activeCardIndex) {
      this.activeCardIndex = activeIdx;
      if (this.counterCurrent) {
        this.counterCurrent.textContent = String(this.activeCardIndex + 1).padStart(2, '0');
      }
    }

    // Terapkan sudut dan z-index untuk setiap kartu
    const step = this.stepAngle;
    const count = this.cards.length;

    this.cards.forEach((card, i) => {
      // Sudut kartu ke-i = (i - posisiAktif) * stepSudut
      const angle = (i - this.currentPosition) * step;
      const absAngle = Math.abs(angle);

      // Optimasi cull: sembunyikan kartu yang berada jauh di luar layar
      if (absAngle > FEATURES_CONFIG.cullAngleThreshold) {
        card.style.visibility = 'hidden';
        card.style.pointerEvents = 'none';
        return;
      } else {
        card.style.visibility = 'visible';
        card.style.pointerEvents = 'auto';
      }

      // Terapkan variabel custom CSS untuk transform kartu
      card.style.setProperty('--card-angle', `${angle.toFixed(3)}deg`);

      // Z-Index: kartu di tengah berada di paling atas, menurun ke samping
      // Rentang z-index: 100 - jarak relatif
      const distFromCenter = Math.abs(i - this.currentPosition);
      const zIndex = Math.max(1, 200 - Math.round(distFromCenter * 15));
      card.style.zIndex = zIndex;
    });
  }

  // ====================================================================
  // 10. MODAL DETAIL FITUR (KLIK / TAP KARTU TERANGKAT)
  // ====================================================================
  openDetailModal(index) {
    const item = this.data[index];
    if (!item || !this.modal) return;

    this.isModalOpen = true;

    if (this.modalTitle) this.modalTitle.textContent = item.title;
    if (this.modalTagline) this.modalTagline.textContent = item.tagline;
    if (this.modalDesc) this.modalDesc.textContent = item.description;

    if (this.modalCard) {
      const gradStops = item.colors.join(', ');
      this.modalCard.style.background = `linear-gradient(145deg, ${gradStops})`;
      this.modalCard.style.color = item.ink;
    }

    if (this.modalAction) {
      this.modalAction.style.background = item.ink === '#F5F9FD' ? '#FFFFFF' : '#000000';
      this.modalAction.style.color = item.ink === '#F5F9FD' ? '#0A2044' : '#FFFFFF';
    }

    this.modal.classList.add('is-open');
    this.modal.setAttribute('aria-hidden', 'false');

    // Kunci fokus keyboard ke dalam tombol tutup modal
    if (this.modalClose) {
      this.modalClose.focus();
    }
  }

  closeDetailModal() {
    if (!this.modal) return;
    this.isModalOpen = false;
    this.modal.classList.remove('is-open');
    this.modal.setAttribute('aria-hidden', 'true');

    // Kembalikan fokus ke kartu aktif
    const activeCard = this.cards[this.activeCardIndex];
    if (activeCard) {
      activeCard.focus();
    }
  }

  destroy() {
    this.stopRAF();
    window.removeEventListener('scroll', this.onScrollHandler);
    window.removeEventListener('resize', this.onResizeHandler);
    window.removeEventListener('keydown', this.onKeydownHandler);
  }
}

// Inisialisasi otomatis jika dipanggil langsung di halaman browser
export function initFeaturesSection(containerSelector = '#featuresSection') {
  return new FeaturesFanController({ container: containerSelector });
}

// Global window attach untuk kemudahan pemanggilan tanpa bundler
if (typeof window !== 'undefined') {
  window.FeaturesFanController = FeaturesFanController;
  window.initFeaturesSection = initFeaturesSection;
  window.FEATURES_DATA = FEATURES_DATA;
}
