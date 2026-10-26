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
        this.showIntro();
      },
      onOpenAuth: () => {
        this.showAuth();
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
          this.home.mount(this.lastDroppedItem, userSession);
          if (sound.playComplete) sound.playComplete();
          loader.hide();
        }, 1800);
      }
    });

    // 3. Onboarding 3-Step Walkthrough Controller
    this.onboarding = new OnboardingController({
      onComplete: () => {
        this.showAuth();
      }
    });

    // 4. Intro Dropping Chute Controller
    this.intro = new IntroController({
      onComplete: (droppedItem, isSkipped) => {
        this.lastDroppedItem = droppedItem;
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

    // Support direct navigation via query params or URL hash
    const urlParams = new URLSearchParams(window.location.search);
    const targetScreen = urlParams.get('screen') || window.location.hash.replace('#', '');

    if (targetScreen === 'control' || targetScreen === 'dashboard') {
      this.hideAllScreens();
      this.home.mount(null, null, 'control');
    } else if (targetScreen === 'home' || targetScreen === 'welcome' || targetScreen === 'hero') {
      this.hideAllScreens();
      this.home.mount(null, null, 'hero');
      const scrollTo = urlParams.get('scroll');
      if (scrollTo) {
        setTimeout(() => {
          const targetEl = document.getElementById(
            scrollTo === 'manifesto' ? 'manifestoSection' : 
            scrollTo === 'steps' ? 'heroStepsSection' : 
            scrollTo === 'claim' ? 'editorialClaim' : 
            scrollTo === 'impact' ? 'heroImpactSection' : 'closingSection'
          );
          if (targetEl) {
            const doScroll = () => {
              if (this.home && this.home.container) {
                this.home.container.scrollTop = targetEl.offsetTop - 50;
              }
              if (this.home && this.home.lenis) {
                this.home.lenis.scrollTo(targetEl, { immediate: true, offset: -50 });
              }
              if (this.home && this.home.updateEditorialStory) {
                this.home.updateEditorialStory();
              }
            };
            doScroll();
            setTimeout(doScroll, 350);
          }
        }, 120);
      }
    } else if (targetScreen === 'onboarding') {
      this.hideAllScreens();
      this.onboarding.mount();
    } else if (targetScreen === 'auth' || targetScreen === 'login') {
      this.hideAllScreens();
      this.auth.mount();
    }

    // Support hash navigation changes dynamically with circular loader
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'control' || hash === 'dashboard') {
        if (this.home && this.homeScreen && !this.homeScreen.classList.contains('is-hidden')) {
          this.home.switchToView('control');
        } else {
          this.hideAllScreens();
          this.home.mount(null, null, 'control');
        }
      } else if (hash === 'home' || hash === 'hero' || hash === 'welcome') {
        if (this.home && this.homeScreen && !this.homeScreen.classList.contains('is-hidden')) {
          this.home.switchToView('hero');
        } else {
          this.hideAllScreens();
          this.home.mount(null, null, 'hero');
        }
      } else if (hash === 'auth' || hash === 'login') {
        this.showAuth();
      } else if (hash === 'onboarding') {
        this.showOnboarding();
      } else if (hash === 'intro') {
        this.showIntro();
      }
    });
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
