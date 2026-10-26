/**
 * =====================================================
 * T2C UNIFIED TRASH-RING LOADER (JAVASCRIPT)
 * Komponen loader reusable dengan cincin foto sampah asli,
 * orientasi tangensial, animasi ekor komet, dan dukungan 3 mode:
 * 'fullscreen', 'inline', dan 'small'.
 * =====================================================
 */

// Sumber aset foto sampah asli (sama dengan intro)
export const DEFAULT_TRASH_ASSETS = [
  { id: 'plastic-bottle', name: 'Botol Plastik', image: '/assets/trash/plastic-bottle.png' },
  { id: 'soda-can', name: 'Kaleng Minuman', image: '/assets/trash/soda-can.png' },
  { id: 'banana-peel', name: 'Kulit Pisang', image: '/assets/trash/banana-peel.png' },
  { id: 'cardboard', name: 'Kardus', image: '/assets/trash/cardboard.png' },
  { id: 'coffee-cup', name: 'Gelas Kopi', image: '/assets/trash/coffee-cup.png' },
  { id: 'crumpled-paper', name: 'Kertas Kusut', image: '/assets/trash/crumpled-paper.png' },
  { id: 'battery', name: 'Baterai Bekas', image: '/assets/trash/battery.png' }
];

// Konstanta Konfigurasi Default
export const LOADER_CONFIG = {
  ITEM_COUNT: 12,        // Jumlah objek di cincin (mudah diubah)
  DURATION: 2.0,         // Kecepatan putaran tenang & anggun dalam detik (2.0s per putaran)
  MIN_FULLSCREEN_MS: 1800 // Durasi minimum tampil mode fullscreen agar tidak berkedip
};

// Cache preload gambar agar tidak ada pop-in
const preloadedImages = new Set();
export function preloadTrashImages(assets = DEFAULT_TRASH_ASSETS) {
  assets.forEach((item) => {
    if (!preloadedImages.has(item.image)) {
      const img = new Image();
      img.src = item.image;
      preloadedImages.add(item.image);
    }
  });
}

// Preload awal di latar belakang
if (typeof window !== 'undefined') {
  preloadTrashImages();
}

/**
 * Kelas Pengelola Komponen Loader
 */
export class TrashRingLoader {
  constructor(options = {}) {
    this.mode = options.mode || 'fullscreen'; // 'fullscreen' | 'inline' | 'small'
    this.target = options.target || (this.mode === 'fullscreen' ? document.body : null);
    this.text = options.text !== undefined ? options.text : 'Memuat';
    this.subtext = options.subtext || null;
    this.minDuration = options.minDuration !== undefined ? options.minDuration : (this.mode === 'fullscreen' ? LOADER_CONFIG.MIN_FULLSCREEN_MS : 0);
    this.activeItem = options.activeItem || null;
    this.itemCount = options.count || LOADER_CONFIG.ITEM_COUNT;
    this.duration = options.duration || LOADER_CONFIG.DURATION;
    this.trashList = options.trashList || DEFAULT_TRASH_ASSETS;

    this.startTime = 0;
    this.element = null;
    this.subtextInterval = null;
    this.previousFocusedElement = null;
    this.isHiding = false;

    this.render();
  }

  /**
   * Menyiapkan daftar objek cincin (12 objek berputar berselang-seling)
   * Jika activeItem diberikan (sampah yang baru dimasukkan ke tong),
   * letakkan di posisi kepala pertama (indeks 0).
   */
  getRingItems() {
    const list = [...this.trashList];
    let headItem = null;

    if (this.activeItem) {
      if (typeof this.activeItem === 'string') {
        headItem = list.find(item => item.id === this.activeItem || item.image.includes(this.activeItem));
      } else if (this.activeItem.image) {
        headItem = this.activeItem;
      }
    }

    if (!headItem) {
      headItem = list[0];
    }

    const otherItems = list.filter(item => item.id !== headItem.id);
    const ringItems = [headItem];

    // Isi hingga mencapai itemCount (default 12)
    for (let i = 1; i < this.itemCount; i++) {
      const source = otherItems.length > 0 ? otherItems : list;
      ringItems.push(source[(i - 1) % source.length]);
    }

    return ringItems;
  }

  /**
   * Membangun struktur DOM loader secara dinamis
   */
  render() {
    const ringItems = this.getRingItems();

    // Container pembungkus
    const wrapper = document.createElement('div');
    wrapper.setAttribute('role', 'status');
    wrapper.setAttribute('aria-live', 'polite');

    if (this.mode === 'fullscreen') {
      wrapper.className = 't2c-loader-overlay';
      wrapper.id = 't2cFullscreenLoader';
    } else if (this.mode === 'small') {
      wrapper.className = 't2c-loader-small';
    } else {
      wrapper.className = 't2c-loader-inline';
    }

    // Kotak konten
    const box = document.createElement('div');
    box.className = 't2c-loader-box';

    // Aksesibilitas: Teks tersembunyi untuk pembaca layar
    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = 'Sedang memuat konten, mohon tunggu…';
    box.appendChild(srOnly);

    // Cincin Loader
    const ring = document.createElement('div');
    ring.className = 't2c-loader-ring';
    ring.style.setProperty('--loader-count', this.itemCount);
    ring.style.setProperty('--loader-duration', `${this.duration}s`);

    // Bangun N objek cincin dengan sudut tangensial
    ringItems.forEach((item, index) => {
      const angle = (360 / this.itemCount) * index;

      const itemEl = document.createElement('div');
      itemEl.className = 't2c-loader-item';
      itemEl.style.setProperty('--i', index);
      itemEl.style.setProperty('--angle', `${angle}deg`);

      const innerEl = document.createElement('div');
      innerEl.className = 't2c-loader-item-inner';
      // Kalkulasi delay bertingkat per objek untuk efek ekor komet yang presisi
      const delay = ((index * (this.duration / this.itemCount)) - this.duration).toFixed(3);
      innerEl.style.animationDelay = `${delay}s`;
      innerEl.style.animationDuration = `${this.duration}s`;

      const img = document.createElement('img');
      img.src = item.image;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.className = 't2c-loader-img';
      img.loading = 'eager';
      img.decoding = 'async';

      // Fallback jika gambar sampah gagal dimuat
      img.onerror = () => {
        img.style.display = 'none';
        const disc = document.createElement('div');
        disc.className = 't2c-loader-fallback-disc';
        innerEl.appendChild(disc);
      };

      innerEl.appendChild(img);
      itemEl.appendChild(innerEl);
      ring.appendChild(itemEl);
    });

    box.appendChild(ring);

    // Teks di bawah cincin (tidak ditampilkan di mode small)
    if (this.mode !== 'small') {
      const content = document.createElement('div');
      content.className = 't2c-loader-content';

      const label = document.createElement('div');
      label.className = 't2c-loader-label';

      const textSpan = document.createElement('span');
      textSpan.className = 't2c-loader-text';
      textSpan.textContent = this.text;

      const dotsSpan = document.createElement('span');
      dotsSpan.className = 't2c-loader-dots';
      dotsSpan.setAttribute('aria-hidden', 'true');
      dotsSpan.innerHTML = `
        <span class="t2c-loader-dot">.</span>
        <span class="t2c-loader-dot">.</span>
        <span class="t2c-loader-dot">.</span>
      `;

      label.appendChild(textSpan);
      label.appendChild(dotsSpan);
      content.appendChild(label);

      // Pesan subtext opsional
      const subtextEl = document.createElement('div');
      subtextEl.className = 't2c-loader-subtext';
      this.subtextEl = subtextEl;
      content.appendChild(subtextEl);

      box.appendChild(content);
    }

    wrapper.appendChild(box);
    this.element = wrapper;
  }

  /**
   * Menampilkan loader
   */
  show() {
    this.startTime = performance.now();
    this.isHiding = false;

    // Simpan elemen yang sedang aktif untuk dipulihkan nanti
    if (typeof document !== 'undefined' && document.activeElement) {
      this.previousFocusedElement = document.activeElement;
    }

    // Pasang ke target
    const parent = typeof this.target === 'string'
      ? document.querySelector(this.target)
      : (this.target || document.body);

    if (parent && !parent.contains(this.element)) {
      parent.appendChild(this.element);
    }

    // Kunci scroll body jika mode fullscreen
    if (this.mode === 'fullscreen') {
      document.body.style.overflow = 'hidden';
      // Trap focus
      this.element.setAttribute('tabindex', '-1');
      this.element.focus();
    }

    // Mulai animasi rotasi subtext jika ada
    this.startSubtextCycle();

    // Trigger transisi aktif dengan fade-in halus
    requestAnimationFrame(() => {
      if (this.element) {
        this.element.classList.remove('is-fade-out');
        this.element.classList.add('is-active');
      }
    });

    return this;
  }

  /**
   * Memperbarui teks pesan utama
   */
  setText(text) {
    this.text = text;
    if (this.element) {
      const textEl = this.element.querySelector('.t2c-loader-text');
      if (textEl) textEl.textContent = text;
    }
  }

  /**
   * Memperbarui pesan status kecil (subtext)
   */
  setSubtext(text) {
    if (this.subtextEl) {
      this.subtextEl.style.opacity = '0';
      setTimeout(() => {
        this.subtextEl.textContent = text || '';
        this.subtextEl.style.opacity = '0.9';
      }, 150);
    }
  }

  startSubtextCycle() {
    if (!this.subtext) return;

    if (Array.isArray(this.subtext) && this.subtext.length > 0) {
      let index = 0;
      this.setSubtext(this.subtext[0]);

      this.subtextInterval = setInterval(() => {
        index = (index + 1) % this.subtext.length;
        this.setSubtext(this.subtext[index]);
      }, 1800);
    } else if (typeof this.subtext === 'string') {
      this.setSubtext(this.subtext);
    }
  }

  /**
   * Menyembunyikan loader dengan jaminan minDuration terpenuhi
   * @returns {Promise<void>}
   */
  hide() {
    if (this.isHiding) return Promise.resolve();
    this.isHiding = true;

    if (this === activeFullscreenLoader) {
      activeFullscreenLoader = null;
    }

    if (this.subtextInterval) {
      clearInterval(this.subtextInterval);
      this.subtextInterval = null;
    }

    return new Promise((resolve) => {
      const elapsed = performance.now() - this.startTime;
      const remainingTime = Math.max(0, this.minDuration - elapsed);

      setTimeout(() => {
        if (!this.element) {
          resolve();
          return;
        }

        // Jalankan fade-out ±400ms
        this.element.classList.remove('is-active');
        this.element.classList.add('is-fade-out');

        setTimeout(() => {
          if (this.mode === 'fullscreen') {
            document.body.style.overflow = '';
            if (this.previousFocusedElement && typeof this.previousFocusedElement.focus === 'function') {
              this.previousFocusedElement.focus();
            }
          }

          if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
          }

          resolve();
        }, 420);
      }, remainingTime);
    });
  }
}

// Global active fullscreen loader tracker
let activeFullscreenLoader = null;

/**
 * Antarmuka Utama: Menampilkan Loader
 * @param {Object} options
 * @returns {TrashRingLoader}
 */
export function showLoader(options = {}) {
  const mode = options.mode || 'fullscreen';

  if (mode === 'fullscreen') {
    if (typeof document !== 'undefined') {
      const existingOverlays = document.querySelectorAll('.t2c-loader-overlay');
      existingOverlays.forEach(el => {
        try {
          if (el.parentNode) el.parentNode.removeChild(el);
        } catch (_) {}
      });
    }
    activeFullscreenLoader = null;

    const loader = new TrashRingLoader({
      ...options,
      mode: 'fullscreen'
    });
    activeFullscreenLoader = loader;
    loader.show();
    return loader;
  }

  const loader = new TrashRingLoader(options);
  loader.show();
  return loader;
}

/**
 * Antarmuka Utama: Menyembunyikan Loader
 * @param {TrashRingLoader|HTMLElement|string} instanceOrTarget
 * @returns {Promise<void>}
 */
export function hideLoader(instanceOrTarget) {
  if (instanceOrTarget instanceof TrashRingLoader) {
    if (instanceOrTarget === activeFullscreenLoader) {
      activeFullscreenLoader = null;
    }
    return instanceOrTarget.hide();
  }

  if (activeFullscreenLoader) {
    const ref = activeFullscreenLoader;
    activeFullscreenLoader = null;
    return ref.hide();
  }

  return Promise.resolve();
}

// Ekspor ke window global untuk pemakaian via tag script biasa
if (typeof window !== 'undefined') {
  window.t2cLoader = {
    TrashRingLoader,
    showLoader,
    hideLoader,
    preloadTrashImages,
    DEFAULT_TRASH_ASSETS,
    LOADER_CONFIG
  };
}
