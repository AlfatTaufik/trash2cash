/**
 * Main Application Orchestrator for Trash2Cash (TTC)
 * Coordinates the full circular experience:
 * 1. Intro Screen (Interactive physical trash sorting)
 * 2. Loading Screen (Single tangential trash ring loader)
 * 3. Onboarding Screen (3-Step walkthrough with stepper & cartoon mascot dialog bubbles)
 * 4. Authentication & Role Selection Screen (Warga, Kurir, Mitra with gamification preview)
 * 5. Homepage Dashboard (5-Pillar Waste-Tech architecture, dynamic earnings & leaderboard)
 */

import { sound } from './sound.js';
import { IntroController } from './intro.js';
import { OnboardingController } from './onboarding.js';
import { AuthController } from './auth.js';
import { HomeController } from './home.js';
import { initFallingLeaves } from './leaves.js';
import { showLoader } from './loader.js';
import { refreshIcons } from './icons.js';

class EcoPilahApp {
  constructor() {
    refreshIcons();
    this.introScreen = document.getElementById('introScreen');
    this.homeScreen = document.getElementById('homeScreen');
    this.onboardingScreen = document.getElementById('onboardingScreen');
    this.authScreen = document.getElementById('authScreen');

    initFallingLeaves('fallingLeavesCanvas', 6);

    this.soundBtns = [
      document.getElementById('introSoundBtn'),
      document.getElementById('homeSoundBtn')
    ].filter(Boolean);

    this.soundLabels = [
      document.getElementById('introSoundLabel'),
      document.getElementById('homeSoundLabel')
    ].filter(Boolean);

    this.initAudioSync();
    this.initControllers();
  }

  initAudioSync() {
    const updateSoundUI = (enabled) => {
      this.soundLabels.forEach(label => {
        label.textContent = enabled ? 'Suara aktif' : 'Suara mati';
      });

      document.querySelectorAll('.icon-speaker-on').forEach(icon => {
        icon.style.display = enabled ? 'block' : 'none';
      });

      document.querySelectorAll('.icon-speaker-off').forEach(icon => {
        icon.style.display = enabled ? 'none' : 'block';
      });
    };

    sound.subscribe(updateSoundUI);

    this.soundBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        sound.toggle();
      });
    });

    // Browser audio unlock on first user click/touch anywhere
    const unlockAudio = () => {
      sound.ensureContext();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
  }

  initControllers() {
    // 1. Home Dashboard Controller
    this.home = new HomeController({
      onReturnToIntro: () => {
        this.setHash('intro');
        this.showIntro();
      },
      onOpenAuth: () => {
        this.setHash('auth');
        this.showAuth();
      },
      onViewChanged: (view) => {
        this.setHash(view === 'control' ? 'control' : 'home');
      }
    });

    // 2. Authentication & Role Selection Controller
    this.auth = new AuthController({
      onAuthenticated: (userSession) => {
        const roleTitle = userSession?.roleTitle || 'Warga Penyetor';
        const role = userSession?.role || 'warga';
        const subtexts = (role === 'mitra' || role === 'bumdes')
          ? [
              'Menghubungkan buku besar komoditas Mitra...',
              'Sinkronisasi harga bursa scrap & kuota gudang...',
              'Menyiapkan dashboard agregasi Mitra...'
            ]
          : role === 'kurir'
          ? [
              'Memetakan rute penjemputan RW terdekat...',
              'Sinkronisasi armada & timbangan mobile...',
              'Menyiapkan order jemput aktif...'
            ]
          : [
              'Menghitung saldo sirkular & streak harian...',
              'Sinkronisasi katalog harga pilah & reward...',
              'Menyiapkan panggung interaktif Eco-Hero...'
            ];

        if (sound.playGrab) sound.playGrab();

        const loader = showLoader({
          mode: 'fullscreen',
          activeItem: this.lastDroppedItem || 'plastic-bottle',
          minDuration: 1800,
          text: `Masuk sebagai ${roleTitle}...`,
          subtext: subtexts
        });

        setTimeout(() => {
          this.hideAllScreens();
          this.home.mount(this.lastDroppedItem, userSession, 'hero');
          this.setHash('home');
          if (sound.playComplete) sound.playComplete();
          loader.hide();
        }, 1800);
      }
    });

    // 3. Onboarding 3-Step Walkthrough Controller
    this.onboarding = new OnboardingController({
      onComplete: () => {
        this.setHash('auth');
        this.showAuth();
      }
    });

    // 4. Intro Dropping Chute Controller
    this.intro = new IntroController({
      onComplete: (droppedItem, isSkipped) => {
        this.lastDroppedItem = droppedItem;
        this.setHash('onboarding');
        this.showOnboarding({
          isFromIntro: true,
          activeItem: droppedItem,
          duration: isSkipped ? 1400 : 1800,
          text: isSkipped ? 'Menyiapkan Pengenalan Alur' : 'Memproses Pemilahan',
          subtext: isSkipped
            ? ['Memuat 3 langkah mudah Trash2Cash...', 'Sistem siap digunakan!']
            : ['Menganalisis densitas material...', 'Sinkronisasi standar daur ulang...', 'Menyiapkan panggung edukasi...']
        });
      }
    });

    // Listen to hashchange events for browser Back / Forward history navigation
    window.addEventListener('hashchange', () => {
      const route = this.parseRoute();
      this.handleRouteChange(route, false);
    });

    // Initial Route Handling on Page Load / Refresh
    const initialRoute = this.parseRoute();
    if (initialRoute && initialRoute !== 'intro') {
      this.handleRouteChange(initialRoute, true);
    } else {
      this.setHash('intro');
    }
  }

  setHash(route) {
    const clean = (route || 'intro').replace(/^#\/?/, '').trim();
    const formatted = `#/${clean}`;
    if (window.location.hash !== formatted) {
      try {
        window.history.replaceState(null, '', formatted);
      } catch (e) {
        window.location.hash = formatted;
      }
    }
  }

  parseRoute() {
    const urlParams = new URLSearchParams(window.location.search);
    const queryScreen = urlParams.get('screen');
    if (queryScreen) return queryScreen.toLowerCase().trim();

    const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
    return rawHash || 'intro';
  }

  handleRouteChange(route, isInitial = false) {
    const cleanRoute = (route || 'intro').replace(/^#\/?/, '').toLowerCase().trim();

    if (cleanRoute === 'control' || cleanRoute === 'dashboard') {
      if (this.home && this.homeScreen && !this.homeScreen.classList.contains('is-hidden')) {
        this.home.switchToView('control');
      } else {
        this.hideAllScreens();
        this.home.mount(null, null, 'control');
      }
    } else if (cleanRoute === 'home' || cleanRoute === 'hero' || cleanRoute === 'welcome') {
      if (this.home && this.homeScreen && !this.homeScreen.classList.contains('is-hidden')) {
        this.home.switchToView('hero');
      } else {
        this.hideAllScreens();
        this.home.mount(null, null, 'hero');
      }
    } else if (cleanRoute === 'auth' || cleanRoute === 'login') {
      if (isInitial) {
        this.hideAllScreens();
        this.auth.mount();
      } else {
        this.showAuth();
      }
    } else if (cleanRoute === 'onboarding') {
      if (isInitial) {
        this.hideAllScreens();
        this.onboarding.mount();
      } else {
        this.showOnboarding();
      }
    } else if (cleanRoute === 'intro') {
      if (isInitial) {
        this.hideAllScreens();
        if (this.introScreen) {
          this.introScreen.style.display = '';
          this.introScreen.classList.remove('is-hidden');
        }
      } else {
        this.showIntro();
      }
    }
  }

  hideAllScreens() {
    if (this.introScreen) {
      this.introScreen.classList.add('is-hidden');
      this.introScreen.style.display = 'none';
    }
    if (this.onboarding) this.onboarding.unmount();
    if (this.auth) this.auth.unmount();
    if (this.home) this.home.unmount();
  }

  showOnboarding(options = {}) {
    this.setHash('onboarding');
    const minDuration = options.duration !== undefined ? options.duration : 1350;
    if (sound.playGrab) sound.playGrab();

    const loader = showLoader({
      mode: 'fullscreen',
      activeItem: options.activeItem || this.lastDroppedItem || 'plastic-bottle',
      minDuration: minDuration,
      text: options.text || 'Membuka Panduan Alur Sirkular',
      subtext: options.subtext || [
        'Memuat 3 langkah mudah Trash2Cash...',
        'Menyiapkan panggung edukasi interaktif...'
      ]
    });

    setTimeout(() => {
      this.hideAllScreens();
      this.onboarding.mount();
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (sound.playComplete) sound.playComplete();
      loader.hide();
    }, minDuration);
  }

  showAuth(options = {}) {
    this.setHash('auth');
    const minDuration = options.duration !== undefined ? options.duration : 1800;
    if (sound.playGrab) sound.playGrab();

    const loader = showLoader({
      mode: 'fullscreen',
      activeItem: options.activeItem || this.lastDroppedItem || 'soda-can',
      minDuration: minDuration,
      text: options.text || 'Membuka Portal Autentikasi',
      subtext: options.subtext || [
        'Menyiapkan enkripsi PIN & session security...',
        'Memuat opsi profil Warga & Mitra...'
      ]
    });

    setTimeout(() => {
      this.hideAllScreens();
      this.auth.mount();
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (sound.playComplete) sound.playComplete();
      loader.hide();
    }, minDuration);
  }

  showIntro() {
    this.setHash('intro');
    if (sound.playGrab) sound.playGrab();

    const loader = showLoader({
      mode: 'fullscreen',
      activeItem: this.lastDroppedItem || 'coffee-cup',
      minDuration: 1800,
      text: 'Kembali ke Layar Pengantar',
      subtext: [
        'Menyiapkan simulasi tong pemilah sampah...',
        'Reset panggung interaktif...'
      ]
    });

    setTimeout(() => {
      this.hideAllScreens();
      if (this.introScreen) {
        this.introScreen.style.display = '';
        this.introScreen.classList.remove('is-hidden');
      }
      this.intro.resetAllItemsPositions();
      this.intro.isDropping = false;
      this.intro.draggedElement = null;
      this.intro.draggedData = null;
      window.scrollTo({ top: 0, behavior: 'instant' });
      loader.hide();
    }, 1800);
  }
}

// Boot application cleanly when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.t2cApp = new EcoPilahApp();
});
