/**
 * Authentication & Role Selector Controller for Trash2Cash (TTC)
 * Manages Sign In / Sign Up, Role Selection (Warga & Mitra),
 * Interactive Mascot Companion Reactions, Dynamic Real-Time Waste/Income Simulator Slider,
 * 3D Tilt Physics, PIN Security Toggle, and Gamification Profile State.
 */

import gsap from 'gsap';
import Toastify from 'toastify-js';
import { sound } from './sound.js';
import { refreshIcons } from './icons.js';

export class AuthController {
  constructor(options = {}) {
    this.container = document.getElementById('authScreen');
    this.onAuthenticated = options.onAuthenticated || (() => {});
    
    this.mode = 'signup'; // 'signup' | 'signin'
    this.selectedRole = 'warga'; // 'warga' | 'mitra' (kurir is handled internally)
    this.isPinVisible = false;

    // Simulation states
    this.simWasteKg = 3.0; // For Warga (1 - 15 kg/day)
    this.simHubTon = 5.0;  // For Mitra (1 - 30 Ton/month)

    this.roleProfiles = {
      warga: {
        id: 'warga',
        roleTitle: 'Warga Penyetor',
        tagline: 'Keluarga, Individu, & Komunitas Lingkungan',
        badge: 'WARGA SIRKULAR',
        defaultName: 'Alfat Budi Santoso',
        defaultPhone: '0812-3456-7890',
        defaultPin: '882910',
        baseBalance: 148500,
        basePoints: 850,
        streakDays: 5,
        streakMultiplier: '1.2x',
        rankPosition: '#3 se-RW 03',
        divertedKg: 34.8,
        earningsFormula: 'Berdasarkan estimasi bursa Rp 4.500 / kg',
        mascotQuote: 'Hai Warga Hebat! Selamat datang di Trash 2 Cash!',
        mascotImg: '/assets/mascot/mesh-bin-mascot.png',
        primaryColor: '#00875a'
      },
      mitra: {
        id: 'mitra',
        roleTitle: 'Mitra Hub / Pengelola',
        tagline: 'Pengelola Timbangan, Gudang Hub, & Kas Desa',
        badge: 'HUB MITRA RESMI',
        defaultName: 'Mitra Trash 2 Cash Berkah',
        defaultPhone: '0813-8899-0011',
        defaultPin: '773019',
        baseBalance: 4250000,
        basePoints: 5600,
        streakDays: 12,
        streakMultiplier: '1.5x',
        rankPosition: '#1 Hub se-Kecamatan',
        divertedKg: 1240.0,
        earningsFormula: 'Margin bursa komoditas daur ulang & bagi hasil kas Mitra',
        mascotQuote: 'Halo Rekan Mitra! Mari kelola bursa daur ulang bersama Trash 2 Cash!',
        mascotImg: '/assets/mascot/bottle-mascot.png',
        primaryColor: '#0080FF'
      }
    };
    this.roleProfiles.bumdes = this.roleProfiles.mitra;

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    if (!this.container) return;
    this.renderIcons();
    this.updateRolePreview(false);
    this.updateWasteSimulation(false);
  }

  renderIcons() {
    refreshIcons(this.container || document);
  }

  mount() {
    if (!this.container) return;
    this.container.classList.remove('is-hidden');
    this.container.style.display = 'flex';
    this.renderIcons();
    this.updateRolePreview(false);
    this.updateWasteSimulation(false);

    // Entrance animation
    gsap.fromTo('.auth-card-stage',
      { opacity: 0, y: 35, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power2.out' }
    );

    // Initial mascot wave
    gsap.fromTo('#authMascotAvatar',
      { scale: 0.8, rotate: -8 },
      { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' }
    );
  }

  unmount() {
    if (!this.container) return;
    this.container.classList.add('is-hidden');
    setTimeout(() => {
      if (this.container.classList.contains('is-hidden')) {
        this.container.style.display = 'none';
      }
    }, 400);
  }

  bindEvents() {
    if (!this.container) return;

    // Mode Toggle Tabs (Sign In vs Sign Up)
    const tabSignIn = document.getElementById('tabAuthSignIn');
    const tabSignUp = document.getElementById('tabAuthSignUp');

    if (tabSignIn && tabSignUp) {
      tabSignIn.addEventListener('click', () => {
        this.setMode('signin');
      });
      tabSignUp.addEventListener('click', () => {
        this.setMode('signup');
      });
    }

    // Role Selection Cards
    const roleCards = document.querySelectorAll('.auth-role-select-card');
    roleCards.forEach(card => {
      card.addEventListener('click', () => {
        const role = card.dataset.role;
        this.selectRole(role);
      });

      // 3D Magnetic Tilt Physics
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(card, {
          rotateY: x * 0.06,
          rotateX: -y * 0.06,
          transformPerspective: 500,
          duration: 0.2,
          ease: 'power1.out'
        });
      });

      card.addEventListener('pointerleave', () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    });

    // Dynamic Range Slider Simulation
    const wasteSlider = document.getElementById('authWasteSlider');
    if (wasteSlider) {
      wasteSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (this.selectedRole === 'warga') {
          this.simWasteKg = val;
        } else {
          this.simHubTon = val;
        }
        if (sound.playGrab) sound.playGrab();
        this.updateWasteSimulation(true);
      });
    }

    // Simulator Preset Buttons
    const presetBtns = document.querySelectorAll('.sim-preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseFloat(btn.dataset.val);
        if (wasteSlider) wasteSlider.value = val;
        if (this.selectedRole === 'warga') {
          this.simWasteKg = val;
        } else {
          this.simHubTon = val;
        }
        if (sound.playGrab) sound.playGrab();
        this.updateWasteSimulation(true);
      });
    });

    // PIN Show/Hide Toggle Button
    const btnTogglePin = document.getElementById('btnTogglePin');
    const pinInput = document.getElementById('authInputPin');
    if (btnTogglePin && pinInput) {
      btnTogglePin.addEventListener('click', () => {
        this.togglePinVisibility();
      });

      pinInput.addEventListener('input', (e) => {
        this.handlePinInput(e.target.value);
      });

      pinInput.addEventListener('focus', () => {
        this.setMascotQuote('Ssshh... rahasia PIN aman bersama enkripsi kami.');
      });

      pinInput.addEventListener('blur', () => {
        const profile = this.roleProfiles[this.selectedRole];
        if (profile) this.setMascotQuote(profile.mascotQuote);
      });
    }

    // Form Submit
    const authForm = document.getElementById('authMainForm');
    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    // Quick Demo Preset Buttons
    const demoBtns = document.querySelectorAll('.auth-demo-pill');
    demoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.dataset.demoRole;
        this.applyDemoProfileWithAnimation(role);
      });
    });
  }

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    if (sound.playGrab) sound.playGrab();

    const tabSignIn = document.getElementById('tabAuthSignIn');
    const tabSignUp = document.getElementById('tabAuthSignUp');
    const titleEl = document.getElementById('authHeadingText');
    const subtitleEl = document.getElementById('authSubheadingText');
    const submitBtnText = document.getElementById('authSubmitBtnText');
    const signupOnlyGroup = document.querySelectorAll('.auth-signup-only');

    if (mode === 'signin') {
      tabSignIn.classList.add('active');
      tabSignUp.classList.remove('active');
      if (titleEl) titleEl.textContent = 'Selamat Datang Kembali!';
      if (subtitleEl) subtitleEl.textContent = 'Pilih role akunmu dan lanjutkan pencatatan ekonomi sirkular.';
      if (submitBtnText) submitBtnText.textContent = 'Masuk ke Dashboard →';
      signupOnlyGroup.forEach(el => el.style.display = 'none');
      this.setMascotQuote('Selamat datang kembali! Ketik nomor WhatsApp & PIN akunmu.');
    } else {
      tabSignUp.classList.add('active');
      tabSignIn.classList.remove('active');
      if (titleEl) titleEl.textContent = 'Daftar Akun Baru & Pilih Role';
      if (subtitleEl) subtitleEl.textContent = 'Tentukan peranmu dalam rantai ekonomi sirkular Trash2Cash untuk mengkalkulasikan pendapatan dan gamifikasi.';
      if (submitBtnText) submitBtnText.textContent = 'Buat Akun & Mulai Beraksi →';
      signupOnlyGroup.forEach(el => el.style.display = 'block');
      const profile = this.roleProfiles[this.selectedRole];
      if (profile) this.setMascotQuote(profile.mascotQuote);
    }

    gsap.fromTo('.auth-form-body',
      { opacity: 0.85, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
  }

  selectRole(role) {
    if (!this.roleProfiles[role]) return;
    this.selectedRole = role;
    if (sound.playGrab) sound.playGrab();

    const roleCards = document.querySelectorAll('.auth-role-select-card');
    roleCards.forEach(c => {
      if (c.dataset.role === role) {
        c.classList.add('selected');
        c.setAttribute('aria-checked', 'true');
        gsap.fromTo(c, { scale: 0.96 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
      } else {
        c.classList.remove('selected');
        c.setAttribute('aria-checked', 'false');
      }
    });

    const profile = this.roleProfiles[role];
    this.setMascotQuote(profile.mascotQuote);
    this.updateRolePreview(true);
    this.updateWasteSimulation(true);
  }

  setMascotQuote(quote) {
    const quoteEl = document.getElementById('authMascotQuote');
    const bubbleEl = document.getElementById('authMascotBubble');
    if (quoteEl && quote) {
      quoteEl.textContent = quote;
      if (bubbleEl) {
        gsap.fromTo(bubbleEl,
          { scale: 0.95, opacity: 0.7 },
          { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(2)' }
        );
      }
    }
  }

  togglePinVisibility() {
    this.isPinVisible = !this.isPinVisible;
    const pinInput = document.getElementById('authInputPin');
    const iconEye = document.getElementById('iconPinEye');
    if (sound.playGrab) sound.playGrab();

    if (pinInput) {
      pinInput.type = this.isPinVisible ? 'text' : 'password';
    }

    if (iconEye) {
      iconEye.setAttribute('data-lucide', this.isPinVisible ? 'eye-off' : 'eye');
      this.renderIcons();
    }
  }

  handlePinInput(val) {
    const dots = document.querySelectorAll('.pin-dot');
    const cleanVal = (val || '').replace(/\D/g, '').slice(0, 6);
    
    dots.forEach((dot, idx) => {
      if (idx < cleanVal.length) {
        if (!dot.classList.contains('filled')) {
          dot.classList.add('filled');
          gsap.fromTo(dot, { scale: 0.6 }, { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1 });
        }
      } else {
        dot.classList.remove('filled');
      }
    });

    const badge = document.getElementById('pinStrengthBadge');
    if (badge) {
      if (cleanVal.length === 6) {
        badge.textContent = '✓ 6-Digit PIN Siap Digunakan';
        badge.classList.add('pin-complete');
      } else if (cleanVal.length > 0) {
        badge.textContent = `${cleanVal.length} / 6 Digit Terisi`;
        badge.classList.remove('pin-complete');
      } else {
        badge.textContent = '✦ Terenkripsi Bank-Grade';
        badge.classList.remove('pin-complete');
      }
    }
  }

  updateWasteSimulation(isAnimated = true) {
    const isWarga = this.selectedRole === 'warga';
    const slider = document.getElementById('authWasteSlider');
    const labelEl = document.getElementById('simSliderLabel');
    const badgeEl = document.getElementById('simSliderValBadge');
    const presetsRow = document.getElementById('simPresetsRow');
    const estEarningsEl = document.getElementById('authPreviewEarnings');
    const formulaEl = document.getElementById('authPreviewFormula');
    const streakEl = document.getElementById('authPreviewStreak');

    if (isWarga) {
      if (labelEl) labelEl.textContent = 'SIMULASI SAMPAH HARIAN:';
      if (slider) {
        slider.min = '1';
        slider.max = '15';
        slider.step = '0.5';
        slider.value = this.simWasteKg;
      }
      if (badgeEl) badgeEl.textContent = `${this.simWasteKg.toFixed(1)} KG / HARI`;

      if (presetsRow) {
        presetsRow.innerHTML = `
          <button type="button" class="sim-preset-btn ${this.simWasteKg === 1 ? 'active' : ''}" data-val="1">1 KG</button>
          <button type="button" class="sim-preset-btn ${this.simWasteKg === 3 ? 'active' : ''}" data-val="3">3 KG</button>
          <button type="button" class="sim-preset-btn ${this.simWasteKg === 5 ? 'active' : ''}" data-val="5">5 KG</button>
          <button type="button" class="sim-preset-btn ${this.simWasteKg === 10 ? 'active' : ''}" data-val="10">10 KG</button>
        `;
        this.rebindPresetButtons();
      }

      // Calculation: kg/day * 30 days * Rp 4.500/kg
      const monthlyTotal = Math.round(this.simWasteKg * 30 * 4500);
      const points = Math.round(this.simWasteKg * 30 * 5);
      const formatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(monthlyTotal);

      if (estEarningsEl) estEarningsEl.textContent = `${formatted} / bln`;
      if (formulaEl) formulaEl.textContent = `Berdasarkan ${this.simWasteKg} kg/hari × 30 hari × Rp 4.500/kg`;
      if (streakEl) streakEl.textContent = `5 Hari Streak (+${points} Poin Reward)`;

    } else {
      // Mitra Hub
      if (labelEl) labelEl.textContent = 'SIMULASI VOLUME HUB BULANAN:';
      if (slider) {
        slider.min = '1';
        slider.max = '30';
        slider.step = '1';
        slider.value = this.simHubTon;
      }
      if (badgeEl) badgeEl.textContent = `${this.simHubTon} TON / BULAN`;

      if (presetsRow) {
        presetsRow.innerHTML = `
          <button type="button" class="sim-preset-btn ${this.simHubTon === 1 ? 'active' : ''}" data-val="1">1 Ton</button>
          <button type="button" class="sim-preset-btn ${this.simHubTon === 5 ? 'active' : ''}" data-val="5">5 Ton</button>
          <button type="button" class="sim-preset-btn ${this.simHubTon === 10 ? 'active' : ''}" data-val="10">10 Ton</button>
          <button type="button" class="sim-preset-btn ${this.simHubTon === 25 ? 'active' : ''}" data-val="25">25 Ton</button>
        `;
        this.rebindPresetButtons();
      }

      // Calculation: ton/month * Rp 1.500.000 margin
      const monthlyMargin = Math.round(this.simHubTon * 1500000);
      const families = Math.round(this.simHubTon * 70);
      const formatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(monthlyMargin);

      if (estEarningsEl) estEarningsEl.textContent = `${formatted} / bln`;
      if (formulaEl) formulaEl.textContent = `Margin bursa hub daur ulang melayani ~${families} KK`;
      if (streakEl) streakEl.textContent = `Level Hub Mandiri (Audit ISO 14064-1)`;
    }

    if (isAnimated) {
      gsap.fromTo('#authPreviewEarnings',
        { scale: 0.94 },
        { scale: 1, duration: 0.25, ease: 'back.out(2)' }
      );
    }
  }

  rebindPresetButtons() {
    const presetBtns = document.querySelectorAll('.sim-preset-btn');
    const wasteSlider = document.getElementById('authWasteSlider');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseFloat(btn.dataset.val);
        if (wasteSlider) wasteSlider.value = val;
        if (this.selectedRole === 'warga') {
          this.simWasteKg = val;
        } else {
          this.simHubTon = val;
        }
        if (sound.playGrab) sound.playGrab();
        this.updateWasteSimulation(true);
      });
    });
  }

  updateRolePreview(isAnimated = true) {
    const profile = this.roleProfiles[this.selectedRole];
    if (!profile) return;

    const roleTitleEl = document.getElementById('authPreviewRoleTitle');
    const roleTaglineEl = document.getElementById('authPreviewRoleTagline');
    const bonusEl = document.getElementById('authPreviewBonus');

    if (roleTitleEl) roleTitleEl.textContent = profile.roleTitle;
    if (roleTaglineEl) roleTaglineEl.textContent = profile.tagline;
    if (bonusEl) bonusEl.textContent = profile.id === 'warga' 
      ? '+50 Poin Selamat Datang + 1x Streak Shield' 
      : 'Akses Portal Audit Emisi Scope 3 ISO 14064-1';

    // Update avatar
    const mascotAvatarImg = document.querySelector('.auth-mascot-avatar .auth-mascot-img');
    if (mascotAvatarImg && profile.mascotImg) {
      mascotAvatarImg.src = profile.mascotImg;
    }

    // Default placeholders
    const nameInput = document.getElementById('authInputName');
    const phoneInput = document.getElementById('authInputPhone');
    if (nameInput && !nameInput.value) {
      nameInput.placeholder = `Misal: ${profile.defaultName}`;
    }
    if (phoneInput && !phoneInput.value) {
      phoneInput.placeholder = `Misal: ${profile.defaultPhone}`;
    }

    if (isAnimated) {
      gsap.fromTo('#authRolePreviewCard',
        { scale: 0.98, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.5)' }
      );
    }
  }

  applyDemoProfileWithAnimation(role) {
    const profile = this.roleProfiles[role];
    if (!profile) return;

    this.selectRole(role);
    const nameInput = document.getElementById('authInputName');
    const phoneInput = document.getElementById('authInputPhone');
    const pinInput = document.getElementById('authInputPin');

    if (sound.playGrab) sound.playGrab();

    // Typewriter effect simulation
    let idx = 0;
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (pinInput) pinInput.value = '';

    const text = profile.defaultName;
    const phone = profile.defaultPhone;
    const pin = profile.defaultPin;

    const typeInterval = setInterval(() => {
      idx++;
      if (nameInput && idx <= text.length) {
        nameInput.value = text.slice(0, idx);
      }
      if (phoneInput && idx <= phone.length) {
        phoneInput.value = phone.slice(0, idx);
      }
      if (pinInput && idx <= pin.length) {
        pinInput.value = pin.slice(0, idx);
        this.handlePinInput(pinInput.value);
      }

      if (idx >= Math.max(text.length, phone.length, pin.length)) {
        clearInterval(typeInterval);
        Toastify({
          text: `✓ Profil Demo Dimuat: ${profile.defaultName} (${profile.roleTitle})`,
          className: 'toast-eco',
          duration: 2500,
          gravity: 'top',
          position: 'right'
        }).showToast();
      }
    }, 25);
  }

  handleSubmit() {
    const nameInput = document.getElementById('authInputName');
    const phoneInput = document.getElementById('authInputPhone');
    const pinInput = document.getElementById('authInputPin');

    const profile = this.roleProfiles[this.selectedRole];
    const userName = (nameInput && nameInput.value.trim()) || profile.defaultName;
    const userPhone = (phoneInput && phoneInput.value.trim()) || profile.defaultPhone;
    const userPin = (pinInput && pinInput.value.trim()) || profile.defaultPin;

    const userSession = {
      name: userName,
      phone: userPhone,
      pin: userPin,
      role: this.selectedRole,
      roleTitle: profile.roleTitle,
      badge: profile.badge,
      balance: profile.baseBalance,
      points: profile.basePoints,
      streakDays: profile.streakDays,
      streakMultiplier: profile.streakMultiplier,
      rankPosition: profile.rankPosition,
      divertedKg: profile.divertedKg,
      simWasteKg: this.simWasteKg,
      simHubTon: this.simHubTon,
      isAuthenticated: true,
      loginTimestamp: Date.now()
    };

    // Persist to localStorage for session continuity
    try {
      localStorage.setItem('ttc_user_session', JSON.stringify(userSession));
    } catch (e) {
      console.warn('Storage unavailable:', e);
    }

    if (sound.playComplete) sound.playComplete();

    // Tactile notification
    Toastify({
      text: `Selamat Datang, ${userName}! Masuk sebagai ${profile.roleTitle}.`,
      className: 'toast-success',
      duration: 3200,
      gravity: 'top',
      position: 'right'
    }).showToast();

    // Animate button and proceed
    const submitBtn = document.getElementById('authSubmitBtn');
    if (submitBtn) {
      submitBtn.innerHTML = '<span>✓ AUTENTIKASI BERHASIL...</span>';
      submitBtn.style.background = '#C8FF2E';
      submitBtn.style.color = '#161616';
    }

    setTimeout(() => {
      this.unmount();
      this.onAuthenticated(userSession);
    }, 600);
  }

  static getSavedSession() {
    try {
      const data = localStorage.getItem('ttc_user_session');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  static clearSession() {
    try {
      localStorage.removeItem('ttc_user_session');
    } catch (e) {
      console.warn(e);
    }
  }
}
