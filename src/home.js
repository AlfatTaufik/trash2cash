/**
 * Homepage Controller for Trash2Cash (TTC)
 * Integrates 5-Pillar Waste-Tech Architecture:
 * - Pilar 1 & 4: AI Computer Vision Pre-Scanner Simulator & Zero-Trust Audit
 * - Pilar 2: Multi-Role Segmented Switcher (Warga, Kurir, Mitra)
 * - Pilar 3: Dynamic Scrap Ledger Calculator & Instant Double-Entry Payout
 * - Pilar 5: B2B ESG & Carbon Avoidance Telemetry
 * 
 * Interactive Frameworks & Libraries:
 * - Lenis (Smooth momentum scrolling)
 * - GSAP (GreenSock: staggered card entrances, rolling odometer wallet)
 * - ApexCharts (Real-time scrap price index sparkline & Scope 3 carbon trajectory telemetry)
 * - Toastify-JS (Archival tactile real-time ledger notifications)
 * - Lucide (Crisp modern SVG iconography)
 */

import Lenis from 'lenis';
import gsap from 'gsap';
import ApexCharts from 'apexcharts';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import {
  createIcons,
  User,
  Truck,
  Building2,
  Coins,
  Camera,
  MapPin,
  Leaf,
  ShieldCheck,
  FileCheck,
  RotateCcw,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  KeyRound,
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  QrCode,
  Scale,
  X,
  ArrowDownToDot,
  Check
} from 'lucide';
import { sound } from './sound.js';
import { showLoader, hideLoader } from './loader.js';
import { refreshIcons } from './icons.js';

export class HomeController {
  constructor(options = {}) {
    this.container = document.getElementById('homeScreen');
    this.onReturnToIntro = options.onReturnToIntro || (() => {});
    this.onOpenAuth = options.onOpenAuth || (() => {});
    
    // Multi-Page View State ('hero' | 'control')
    this.currentView = 'hero';
    this.isSwitchingView = false;

    // User Profile & Gamification State
    this.userProfile = null;

    // Financial State (Deterministic Ledger)
    this.currentBalance = 148500;
    this.currentPoints = 850;
    this.currentScrapRate = 4500;
    this.currentWeight = 3.5;
    this.currentMaterialType = 'pet';
    
    // Scanner Simulation Items
    this.scanItems = [
      {
        name: 'PET_BOTTLE_CLEAR',
        confidence: '96.8%',
        img: '/assets/trash/plastic-bottle.png',
        focus: '98.4% (OPTIMAL)',
        audit: 'PASSED ✓'
      },
      {
        name: 'ALUMINUM_SODA_CAN',
        confidence: '98.2%',
        img: '/assets/trash/soda-can.png',
        focus: '97.6% (OPTIMAL)',
        audit: 'PASSED ✓'
      },
      {
        name: 'CORRUGATED_CARDBOARD',
        confidence: '94.5%',
        img: '/assets/trash/cardboard.png',
        focus: '95.8% (OPTIMAL)',
        audit: 'PASSED ✓'
      },
      {
        name: 'ORGANIC_BANANA_PEEL',
        confidence: '99.1%',
        img: '/assets/trash/banana-peel.png',
        focus: '96.9% (OPTIMAL)',
        audit: 'PASSED ✓'
      }
    ];
    this.scanIndex = 0;

    // Charts instances
    this.scrapChart = null;
    this.esgChart = null;

    this.renderIcons();
    this.initLenis();
    this.bindEvents();
    this.initRoleSwitcher();
    this.initScrapLedger();
    this.initScannerSimulation();
    this.initLogisticsAndEsg();
    this.initApexCharts();
    this.initSaasPipeline();
    this.initGamificationActions();
    this.initModals();
    this.initHeroInteractive();
    this.activeControlTab = 'pipeline';
    this.initControlTabs();
    this.initHeroFanDeckStepper();
  }

  renderIcons() {
    refreshIcons(this.container || document);
  }

  initLenis() {
    const content = document.getElementById('homeScrollContent');
    if (!this.container || !content) return;

    this.lenis = new Lenis({
      wrapper: this.container,
      content: content,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    this.lenis.on('scroll', () => {
      this.updateEditorialStory();
    });

    const raf = (time) => {
      if (this.lenis) {
        this.lenis.raf(time);
        this.lenisRafId = requestAnimationFrame(raf);
      }
    };
    this.lenisRafId = requestAnimationFrame(raf);
  }

  mount(initialItem = null, userProfile = null, initialView = 'hero') {
    if (!this.container) return;
    this.container.classList.remove('is-hidden');
    this.container.scrollTop = 0;
    if (this.lenis) {
      this.lenis.start();
      this.lenis.scrollTo(0, { immediate: true });
    }

    // Apply Authenticated User Profile & Dynamic Gamification
    if (userProfile) {
      this.applyUserProfile(userProfile);
    } else if (!this.userProfile) {
      let saved = null;
      try {
        const item = localStorage.getItem('ttc_user_session');
        if (item) saved = JSON.parse(item);
      } catch (e) {}

      if (saved) {
        this.applyUserProfile(saved);
      } else {
        this.applyUserProfile({
          name: 'Alfat Budi Santoso',
          role: 'warga',
          roleTitle: 'Warga Penyetor',
          badge: 'WARGA SIRKULAR',
          balance: 148500,
          points: 850,
          streakDays: 5,
          streakMultiplier: '1.2x',
          rankPosition: '#3 se-RW 03',
          divertedKg: 34.8
        });
      }
    }

    this.renderIcons();
    this.bindEvents();
    this.setPipelineStep(1);

    // Set initial view state ('hero' | 'control')
    this.setView(initialView, false);

    // GSAP: Staggered Bento Card Entrance Animation
    gsap.fromTo(['.saas-pipeline-card', '.home-gamification-hub', '.bento-card'], 
      { opacity: 0, y: 32, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.7, ease: 'power2.out', clearProps: 'transform' }
    );
  }

  applyUserProfile(profile) {
    if (!profile) return;
    this.userProfile = profile;
    this.currentBalance = profile.balance || 148500;
    this.currentPoints = profile.points || 850;

    // 1. Navbar elements
    const navName = document.getElementById('navUserName');
    const navAvatar = document.getElementById('navUserAvatar');
    const navRolePill = document.getElementById('navUserRolePill');
    const navBal = document.getElementById('navBalanceVal');
    const navPts = document.getElementById('navPointsVal');

    const firstLetter = profile.name ? profile.name.trim().charAt(0).toUpperCase() : 'A';
    const shortName = profile.name ? profile.name.trim().split(' ')[0] : 'Alfat';

    if (navName) navName.textContent = shortName;
    if (navAvatar) navAvatar.textContent = firstLetter;
    if (navRolePill) navRolePill.textContent = (profile.role || 'WARGA').toUpperCase();
    if (navBal) navBal.textContent = `Rp ${this.currentBalance.toLocaleString('id-ID')}`;
    if (navPts) navPts.textContent = `${this.currentPoints} PTS`;

    // 2. Gamification Hub elements
    const homeDispName = document.getElementById('homeUserDisplayName');
    const homeAvatar = document.getElementById('homeUserAvatar');
    const homeRoleBadge = document.getElementById('homeUserRoleBadge');
    const homeIncomeVal = document.getElementById('homeUserIncomeVal');
    const homeIncomeSub = document.getElementById('homeUserIncomeSub');
    const homeStreakDays = document.getElementById('homeStreakDays');
    const homeStreakMultiplier = document.getElementById('homeStreakMultiplier');
    const homeUserRank = document.getElementById('homeUserRankBadge');
    const lbSelfName = document.getElementById('leaderboardSelfName');
    const lbSelfKg = document.getElementById('leaderboardSelfKg');
    const lbSelfCuan = document.getElementById('leaderboardSelfCuan');

    if (homeDispName) homeDispName.textContent = profile.name || 'Alfat';
    if (homeAvatar) homeAvatar.textContent = firstLetter;
    if (homeRoleBadge) homeRoleBadge.textContent = profile.roleTitle || 'WARGA PENYETOR';
    if (homeIncomeVal) homeIncomeVal.textContent = `Rp ${this.currentBalance.toLocaleString('id-ID')}`;
    
    // Role-dependent income explanation
    if (homeIncomeSub) {
      if (profile.role === 'warga') {
        homeIncomeSub.textContent = `Rp 150.000 / bln (${profile.divertedKg || 34.8} kg Sampah Disetor)`;
      } else if (profile.role === 'kurir') {
        homeIncomeSub.textContent = `Rp 2.400.000 / bln (14 Order Jemput • ${profile.divertedKg || 156} kg Muatan)`;
      } else if (profile.role === 'bumdes' || profile.role === 'mitra') {
        homeIncomeSub.textContent = `Rp 12.500.000 / bln (${profile.divertedKg || 1240} kg Agregasi Komoditas Mitra)`;
      }
    }

    if (homeStreakDays) homeStreakDays.textContent = `${profile.streakDays || 5} HARI`;
    if (homeStreakMultiplier) homeStreakMultiplier.textContent = `${profile.streakMultiplier || '1.2x'} PENGALI POIN`;
    if (homeUserRank) homeUserRank.textContent = (profile.rankPosition || 'RANKING #3').toUpperCase();

    // Sync Navbar Streak Badge
    const navStreakDays = document.getElementById('navStreakDays');
    const navStreakMult = document.getElementById('navStreakMult');
    const navStreakFlame = document.getElementById('navStreakFlame');
    const streakDaysVal = profile.streakDays !== undefined ? profile.streakDays : 5;
    const streakMultVal = profile.streakMultiplier || '1.2x';
    if (navStreakDays) navStreakDays.textContent = `${streakDaysVal} HARI`;
    if (navStreakMult) navStreakMult.textContent = `${streakMultVal} POIN`;
    if (navStreakFlame) {
      navStreakFlame.innerHTML = streakDaysVal === 0 ? '⚡' : '🔥';
    }

    if (lbSelfName) lbSelfName.textContent = `${shortName} (Anda)`;
    if (lbSelfKg) lbSelfKg.textContent = `${profile.divertedKg || 34.8} kg`;
    if (lbSelfCuan) lbSelfCuan.textContent = `Rp ${this.currentBalance.toLocaleString('id-ID')}`;

    const navRoleStatus = document.getElementById('navRoleStatusText');
    if (navRoleStatus) {
      navRoleStatus.textContent = (profile.roleTitle || ((profile.role === 'bumdes' || profile.role === 'mitra') ? 'MITRA HUB' : 'WARGA PENYETOR')).toUpperCase();
    }

    const heroSpeech = document.getElementById('heroMascotSpeechText');
    if (heroSpeech) {
      heroSpeech.textContent = `Hai ${shortName}! Selamat datang di Trash 2 Cash!`;
    }

    // 3. Highlight corresponding role switcher button & Bento cards
    this.syncRoleSelection(profile.role || 'warga');

    // 4. Streak status, reward road & leaderboard (role-aware)
    this.initGamifyState(profile);
  }

  syncRoleSelection(role) {
    const badge = document.getElementById('currentRoleBadge');
    const navRoleStatus = document.getElementById('navRoleStatusText');
    const cardScanner = document.getElementById('cardScanner');
    const cardLedger = document.getElementById('cardLedger');
    const cardLogistics = document.getElementById('cardLogistics');
    const cardEsg = document.getElementById('cardEsg');

    [cardScanner, cardLedger, cardLogistics, cardEsg].forEach(c => {
      if (c) c.style.borderColor = '#161616';
    });

    if (role === 'warga') {
      if (badge) badge.textContent = 'WARGA PENYETOR';
      if (navRoleStatus) navRoleStatus.textContent = 'WARGA PENYETOR';
      if (cardScanner) cardScanner.style.borderColor = '#00875a';
    } else if (role === 'bumdes' || role === 'mitra') {
      if (badge) badge.textContent = 'MITRA HUB';
      if (navRoleStatus) navRoleStatus.textContent = 'MITRA HUB';
      if (cardLedger) cardLedger.style.borderColor = '#00875a';
      if (cardEsg) cardEsg.style.borderColor = '#0080FF';
    }

    const pipelineRole = document.getElementById('pipelineRoleIndicator');
    if (pipelineRole) {
      pipelineRole.textContent = (role === 'bumdes' || role === 'mitra') ? 'ALUR AGREGASI MITRA' : 'ALUR WARGA PENYETOR';
    }
  }

  unmount() {
    if (this.container) {
      this.container.classList.add('is-hidden');
    }
    if (this.lenis) {
      this.lenis.stop();
    }
  }

  bindEvents() {
    // Return to intro buttons
    const returnBtns = document.querySelectorAll('.js-return-intro');
    returnBtns.forEach(btn => {
      if (btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (sound.playGrab) sound.playGrab();
        this.unmount();
        this.onReturnToIntro();
      });
    });

    // Switch Account / Open Auth buttons
    const authBtns = document.querySelectorAll('.js-open-auth');
    authBtns.forEach(btn => {
      if (btn.dataset.authBound === 'true') return;
      btn.dataset.authBound = 'true';

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (sound.playGrab) sound.playGrab();
        this.unmount();
        this.onOpenAuth();
      });
    });

    // Mascot 3D parallax & GSAP continuous floating breathing animation
    const stage = document.querySelector('.home-editorial-stage');
    const mascotWrap = document.getElementById('heroMascotWrap');
    if (stage && mascotWrap && !this.parallaxBound) {
      this.parallaxBound = true;
      let rafId = null;
      let targetRotX = 0;
      let targetRotY = 0;
      let targetTransX = 0;
      let targetTransY = 0;
      let curRotX = 0;
      let curRotY = 0;
      let curTransX = 0;
      let curTransY = 0;

      const updateParallax = () => {
        curRotX += (targetRotX - curRotX) * 0.08;
        curRotY += (targetRotY - curRotY) * 0.08;
        curTransX += (targetTransX - curTransX) * 0.08;
        curTransY += (targetTransY - curTransY) * 0.08;

        mascotWrap.style.transform = `translate(calc(-50% + ${curTransX}px), calc(-50% + ${curTransY}px)) rotate(${curRotY}deg) scale(1.02)`;

        if (Math.abs(targetRotX - curRotX) > 0.01 || Math.abs(targetTransX - curTransX) > 0.01) {
          rafId = requestAnimationFrame(updateParallax);
        } else {
          rafId = null;
        }
      };

      stage.addEventListener('pointermove', (e) => {
        if (window.innerWidth <= 768) return;
        const rect = stage.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        targetTransX = normX * 22;
        targetTransY = normY * 16;
        targetRotY = normX * 8;
        targetRotX = -normY * 6;

        if (!rafId) {
          rafId = requestAnimationFrame(updateParallax);
        }
      });

      stage.addEventListener('pointerleave', () => {
        targetTransX = 0;
        targetTransY = 0;
        targetRotX = 0;
        targetRotY = 0;
        if (!rafId) {
          rafId = requestAnimationFrame(updateParallax);
        }
      });
    }
  }

  /* -----------------------------------------------------
     PILAR 2: AUTHENTICATED USER ROLE & ACCOUNT SWITCHER
     ----------------------------------------------------- */
  initRoleSwitcher() {
    // Role is locked to the authenticated user's account.
    // To switch role, user clicks 'Ganti Akun' which opens authentication.
    const switchBtns = document.querySelectorAll('.nav-switch-account-btn, .js-open-auth');
    switchBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (sound.playGrab) sound.playGrab();
        this.unmount();
        this.onOpenAuth();
      });
    });
  }

  /* -----------------------------------------------------
     PILAR 3: DYNAMIC SCRAP LEDGER & CALCULATOR
     ----------------------------------------------------- */
  initScrapLedger() {
    const rateRows = document.querySelectorAll('.rate-row');
    const slider = document.getElementById('scrapWeightRange');
    const weightDisplay = document.getElementById('calcWeightDisplay');
    const payoutAmount = document.getElementById('calcPayoutAmount');
    const pointsAmount = document.getElementById('calcPointsAmount');
    const claimBtn = document.getElementById('btnClaimPayout');

    const updateCalculation = () => {
      const payout = Math.round(this.currentWeight * this.currentScrapRate);
      const points = Math.round(this.currentWeight * 20);

      if (weightDisplay) weightDisplay.textContent = `${this.currentWeight.toFixed(1)} KG`;
      if (payoutAmount) payoutAmount.textContent = `Rp ${payout.toLocaleString('id-ID')}`;
      if (pointsAmount) pointsAmount.textContent = `+${points} Poin ESG`;
    };

    rateRows.forEach(row => {
      row.addEventListener('click', () => {
        rateRows.forEach(r => r.classList.remove('active'));
        row.classList.add('active');
        this.currentScrapRate = parseInt(row.dataset.rate, 10) || 4500;
        this.currentMaterialType = row.dataset.type || 'pet';
        
        if (sound.playGrab) sound.playGrab();
        updateCalculation();

        // Update dynamic scrap chart
        this.updateScrapChart(this.currentMaterialType);
      });
    });

    if (slider) {
      slider.addEventListener('input', (e) => {
        this.currentWeight = parseFloat(e.target.value) || 1.0;
        updateCalculation();
      });
    }

    if (claimBtn) {
      claimBtn.addEventListener('click', () => {
        const added = Math.round(this.currentWeight * this.currentScrapRate);
        const pts = Math.round(this.currentWeight * 20);

        this.currentBalance += added;
        this.currentPoints += pts;

        if (sound.playComplete) sound.playComplete();

        // 1. GSAP Wallet Pill Pulse (Clean & Lightweight)
        const navPill = document.getElementById('navBalancePill');
        if (navPill) {
          gsap.fromTo(navPill, 
            { scale: 1.12, borderColor: '#00875a' },
            { scale: 1, borderColor: '#161616', duration: 0.35, ease: 'back.out(2)' }
          );
        }

        // 2. GSAP Rolling Odometer Counter for Wallet Balance & Points
        this.animateBalanceRoll(added, pts);

        // Validated deposit → keeps daily streak alive & updates leaderboard
        this.recordDeposit(this.currentWeight);

        // 3. Toastify Transaction Hash Notification
        Toastify({
          text: `Payout Rp ${added.toLocaleString('id-ID')} tervalidasi ke Ledger! (+${pts} Poin ESG)`,
          className: 'toast-success',
          duration: 3200,
          gravity: 'top',
          position: 'right'
        }).showToast();

        const originalText = claimBtn.innerHTML;
        claimBtn.innerHTML = '🛡️ <span>✓ TERSETOR KE LEDGER!</span>';
        claimBtn.style.background = '#C8FF2E';
        claimBtn.style.color = '#161616';

        setTimeout(() => {
          claimBtn.innerHTML = originalText;
          claimBtn.style.background = '';
          claimBtn.style.color = '';
          this.renderIcons();
        }, 2200);
      });
    }

    updateCalculation();
  }

  /* -----------------------------------------------------
     GSAP ROLLING ODOMETER COUNTER (BALANCE & POINTS)
     ----------------------------------------------------- */
  animateBalanceRoll(added, pts) {
    const navBal = document.getElementById('navBalanceVal');
    const navPts = document.getElementById('navPointsVal');
    if (!navBal && !navPts) return;

    const startBal = this.currentBalance - added;
    const endBal = this.currentBalance;
    const startPts = this.currentPoints - pts;
    const endPts = this.currentPoints;

    const tracker = { bal: startBal, pts: startPts };

    gsap.to(tracker, {
      bal: endBal,
      pts: endPts,
      duration: 1.1,
      ease: 'power2.out',
      onUpdate: () => {
        if (navBal) navBal.textContent = `Rp ${Math.round(tracker.bal).toLocaleString('id-ID')}`;
        if (navPts) navPts.textContent = `${Math.round(tracker.pts)} PTS`;
      }
    });
  }

  /* -----------------------------------------------------
     APEXCHARTS INTEGRATION
     1. Scrap Price Index 7-Day Sparkline
     2. ESG Scope 3 Monthly Trajectory Chart
     ----------------------------------------------------- */
  initApexCharts() {
    this.scrapChartData = {
      pet: {
        name: 'Plastik PET Bening',
        data: [4200, 4300, 4250, 4400, 4450, 4400, 4500],
        color: '#00875a',
        badge: 'PET: Rp 4.500/kg'
      },
      kaleng: {
        name: 'Kaleng Aluminium',
        data: [13200, 13400, 13300, 13600, 13800, 13900, 14000],
        color: '#D4AF37',
        badge: 'KALENG: Rp 14.000/kg'
      },
      kardus: {
        name: 'Kardus Kraft',
        data: [1750, 1780, 1760, 1800, 1800, 1790, 1800],
        color: '#8B5A2B',
        badge: 'KARDUS: Rp 1.800/kg'
      }
    };

    // 1. Scrap Price Chart
    const scrapContainer = document.getElementById('scrapPriceChart');
    if (scrapContainer) {
      const optionsScrap = {
        chart: {
          type: 'area',
          height: 105,
          sparkline: { enabled: true },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 500
          }
        },
        stroke: {
          curve: 'smooth',
          width: 2.5
        },
        colors: ['#00875a'],
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [0, 95, 100]
          }
        },
        series: [{
          name: 'Plastik PET Bening',
          data: this.scrapChartData.pet.data
        }],
        xaxis: {
          categories: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
        },
        tooltip: {
          theme: 'light',
          x: { show: true },
          y: {
            formatter: (val) => `Rp ${val.toLocaleString('id-ID')}/kg`
          }
        }
      };

      try {
        this.scrapChart = new ApexCharts(scrapContainer, optionsScrap);
        this.scrapChart.render();
      } catch (err) {
        console.warn('Scrap chart initialization error:', err);
      }
    }

    // 2. ESG Scope 3 Trajectory Chart
    const esgContainer = document.getElementById('esgTrajectoryChart');
    if (esgContainer) {
      const optionsEsg = {
        chart: {
          type: 'bar',
          height: 120,
          toolbar: { show: false },
          sparkline: { enabled: false },
          parentHeightOffset: 0
        },
        plotOptions: {
          bar: {
            columnWidth: '55%',
            borderRadius: 3
          }
        },
        colors: ['#00875a', '#0080FF'],
        series: [
          {
            name: 'Karbon Dicegah (kg CO₂e)',
            data: [18.4, 22.1, 28.5, 34.0, 39.2, 42.6]
          },
          {
            name: 'Limbah Dipilah (kg)',
            data: [14.2, 18.0, 23.4, 27.8, 31.5, 34.8]
          }
        ],
        xaxis: {
          categories: ['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'],
          labels: {
            style: {
              colors: '#646464',
              fontSize: '10px',
              fontFamily: 'monospace'
            }
          },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: {
          show: false
        },
        grid: {
          borderColor: 'rgba(22, 22, 22, 0.06)',
          strokeDashArray: 3,
          padding: { top: 0, bottom: 0, left: 10, right: 10 }
        },
        legend: {
          show: true,
          position: 'top',
          horizontalAlign: 'right',
          fontSize: '10px',
          fontFamily: 'monospace',
          markers: { width: 8, height: 8, radius: 2 }
        },
        tooltip: {
          theme: 'light'
        }
      };

      try {
        this.esgChart = new ApexCharts(esgContainer, optionsEsg);
        this.esgChart.render();
      } catch (err) {
        console.warn('ESG chart initialization error:', err);
      }
    }
  }

  updateScrapChart(materialType) {
    if (!this.scrapChart || !this.scrapChartData[materialType]) return;

    const dataObj = this.scrapChartData[materialType];
    const badge = document.getElementById('chartLiveRateBadge');
    if (badge) {
      badge.textContent = dataObj.badge;
      badge.style.color = dataObj.color;
    }

    this.scrapChart.updateOptions({
      colors: [dataObj.color]
    });

    this.scrapChart.updateSeries([{
      name: dataObj.name,
      data: dataObj.data
    }]);
  }

  /* -----------------------------------------------------
     PILAR 1 & 4: AI PRE-SCANNER SIMULATION
     ----------------------------------------------------- */
  initScannerSimulation() {
    const scanBtn = document.getElementById('btnSimulateScan');
    const img = document.getElementById('scannerDetectedImg');
    const bboxLabel = document.getElementById('scannerBBoxLabel');
    const focusVal = document.getElementById('scannerFocusVal');
    const laser = document.getElementById('scannerLaser');

    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        this.scanIndex = (this.scanIndex + 1) % this.scanItems.length;
        const current = this.scanItems[this.scanIndex];

        if (sound.playGrab) sound.playGrab();

        // Trigger laser scan effect
        if (laser) {
          laser.style.animationDuration = '0.8s';
          setTimeout(() => {
            laser.style.animationDuration = '2.4s';
          }, 1200);
        }

        if (img) {
          img.style.opacity = '0.4';
          img.src = current.img;
          setTimeout(() => {
            img.style.opacity = '1';
          }, 200);
        }

        if (bboxLabel) {
          bboxLabel.textContent = `${current.name} • ${current.confidence}`;
        }

        if (focusVal) {
          focusVal.textContent = current.focus;
        }

        // Tactile Toastify feedback
        Toastify({
          text: `AI Pre-Scanner: ${current.name} tervalidasi AI (${current.focus})`,
          className: 'toast-eco',
          duration: 3000,
          gravity: 'top',
          position: 'right'
        }).showToast();
      });
    }
  }

  /* -----------------------------------------------------
     PILAR 5: LOGISTICS & ESG EXPORT
     ----------------------------------------------------- */
  initLogisticsAndEsg() {
    const pickupBtn = document.getElementById('btnRequestPickup');
    const exportBtn = document.getElementById('btnExportEsg');

    if (pickupBtn) {
      pickupBtn.addEventListener('click', () => {
        if (sound.playComplete) sound.playComplete();
        const orig = pickupBtn.innerHTML;
        pickupBtn.innerHTML = '<span>✓ PENJEMPUTAN DIJADWALKAN!</span>';
        pickupBtn.style.background = '#C8FF2E';

        Toastify({
          text: 'Armada T2C #04 berhasil dijadwalkan menjemput di lokasi Anda!',
          className: 'toast-info',
          duration: 3500,
          gravity: 'top',
          position: 'right'
        }).showToast();

        setTimeout(() => {
          pickupBtn.innerHTML = orig;
          pickupBtn.style.background = '';
          this.renderIcons();
        }, 2200);
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (sound.playComplete) sound.playComplete();
        const orig = exportBtn.innerHTML;
        exportBtn.innerHTML = '📄 <span>✓ LAPORAN ESG DI-GENERATE (PDF)</span>';
        exportBtn.style.background = '#00875a';
        exportBtn.style.color = '#ffffff';

        Toastify({
          text: 'Sertifikasi Reduksi Emisi Scope 3 ISO 14064-1 siap diunduh (PDF)',
          className: 'toast-success',
          duration: 3500,
          gravity: 'top',
          position: 'right'
        }).showToast();

        setTimeout(() => {
          exportBtn.innerHTML = orig;
          exportBtn.style.background = '';
          exportBtn.style.color = '';
          this.renderIcons();
        }, 2400);
      });
    }
  }

  /* -----------------------------------------------------
     SAAS ACTION PIPELINE (4-STEP GUIDED CIRCULAR WORKFLOW)
     ----------------------------------------------------- */
  initSaasPipeline() {
    this.pipelineStep = 1;

    const stepNodes = [
      document.getElementById('pipelineStep1'),
      document.getElementById('pipelineStep2'),
      document.getElementById('pipelineStep3'),
      document.getElementById('pipelineStep4')
    ];

    const btnTriggerStep1 = document.getElementById('btnTriggerStep1');
    const btnTriggerStep2 = document.getElementById('btnTriggerStep2');
    const btnTriggerStep3 = document.getElementById('btnTriggerStep3');
    const btnTriggerStep4 = document.getElementById('btnTriggerStep4');
    const btnRunAll = document.getElementById('btnRunFullPipeline');

    // Step 1: Scan AI
    const handleStep1 = () => {
      if (sound.playGrab) sound.playGrab();
      const cardScanner = document.getElementById('cardScanner');
      if (cardScanner) {
        if (this.lenis) {
          this.lenis.scrollTo(cardScanner, { offset: -60, duration: 0.9 });
        } else {
          cardScanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        gsap.fromTo(cardScanner, 
          { borderColor: '#C8FF2E', scale: 1.01 },
          { borderColor: '#00875a', scale: 1, duration: 0.8, ease: 'power2.out' }
        );
      }

      const scanBtn = document.getElementById('btnSimulateScan');
      if (scanBtn) {
        scanBtn.click();
      }

      this.setPipelineStep(2);

      Toastify({
        text: 'Langkah 1 Selesai: AI mendeteksi material sampah. Lanjut ke Tiket QR!',
        className: 'toast-eco',
        duration: 3500,
        gravity: 'top',
        position: 'right'
      }).showToast();
    };

    // Step 2: Tiket QR
    const handleStep2 = () => {
      if (sound.playGrab) sound.playGrab();
      const modal = document.getElementById('modalQrTicket');
      const ticketMat = document.getElementById('ticketMaterialText');
      const ticketCuan = document.getElementById('ticketPotentialCuan');
      
      const current = this.scanItems[this.scanIndex] || this.scanItems[0];
      const added = Math.round(this.currentWeight * this.currentScrapRate);
      const pts = Math.round(this.currentWeight * 20);

      if (ticketMat) {
        ticketMat.textContent = `${current.name.replace(/_/g, ' ')} (${this.currentWeight} kg)`;
      }
      if (ticketCuan) {
        ticketCuan.textContent = `Rp ${added.toLocaleString('id-ID')} (+${pts} Pts)`;
      }

      if (modal) {
        modal.classList.remove('is-hidden');
      }

      this.setPipelineStep(3);

      Toastify({
        text: 'Langkah 2: Tiket Setor QR siap ditunjukkan di Hub Mitra.',
        className: 'toast-info',
        duration: 3500,
        gravity: 'top',
        position: 'right'
      }).showToast();
    };

    // Step 3: Timbangan IoT
    const handleStep3 = () => {
      if (sound.playGrab) sound.playGrab();
      const modalQr = document.getElementById('modalQrTicket');
      if (modalQr) modalQr.classList.add('is-hidden');

      const cardLedger = document.getElementById('cardLedger');
      if (cardLedger) {
        if (this.lenis) {
          this.lenis.scrollTo(cardLedger, { offset: -60, duration: 0.9 });
        } else {
          cardLedger.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        gsap.fromTo(cardLedger, 
          { borderColor: '#C8FF2E', scale: 1.01 },
          { borderColor: '#00875a', scale: 1, duration: 0.8, ease: 'power2.out' }
        );
      }

      const claimBtn = document.getElementById('btnClaimCuan');
      if (claimBtn) {
        claimBtn.click();
      }

      this.setPipelineStep(4);

      Toastify({
        text: 'Langkah 3: Berat divalidasi timbangan IoT Hub & tercatat ke Ledger!',
        className: 'toast-success',
        duration: 3500,
        gravity: 'top',
        position: 'right'
      }).showToast();
    };

    // Step 4: Saldo & Streak
    const handleStep4 = () => {
      if (sound.playGrab) sound.playGrab();
      const modalWithdraw = document.getElementById('modalWithdraw');
      const curBal = document.getElementById('modalCurrentBalVal');
      if (curBal) {
        curBal.textContent = `Rp ${this.currentBalance.toLocaleString('id-ID')}`;
      }
      if (modalWithdraw) {
        modalWithdraw.classList.remove('is-hidden');
      }

      this.setPipelineStep(4, true);

      Toastify({
        text: 'Langkah 4: Saldo siap dicairkan atau diklaim bonus streak harian!',
        className: 'toast-success',
        duration: 3500,
        gravity: 'top',
        position: 'right'
      }).showToast();
    };

    if (btnTriggerStep1) btnTriggerStep1.addEventListener('click', (e) => { e.stopPropagation(); handleStep1(); });
    if (btnTriggerStep2) btnTriggerStep2.addEventListener('click', (e) => { e.stopPropagation(); handleStep2(); });
    if (btnTriggerStep3) btnTriggerStep3.addEventListener('click', (e) => { e.stopPropagation(); handleStep3(); });
    if (btnTriggerStep4) btnTriggerStep4.addEventListener('click', (e) => { e.stopPropagation(); handleStep4(); });

    // Click on entire node card
    if (stepNodes[0]) stepNodes[0].addEventListener('click', () => handleStep1());
    if (stepNodes[1]) stepNodes[1].addEventListener('click', () => handleStep2());
    if (stepNodes[2]) stepNodes[2].addEventListener('click', () => handleStep3());
    if (stepNodes[3]) stepNodes[3].addEventListener('click', () => handleStep4());

    // Run Full Pipeline Guided Demo Tour
    if (btnRunAll) {
      btnRunAll.addEventListener('click', () => {
        if (sound.playGrab) sound.playGrab();
        Toastify({
          text: 'Menjalankan Alur SaaS Terpadu (Langkah 1 s/d 4)...',
          className: 'toast-info',
          duration: 3000,
          gravity: 'top',
          position: 'center'
        }).showToast();

        // 1. Scan AI
        handleStep1();

        // 2. Open QR Ticket after 1.8s
        setTimeout(() => {
          handleStep2();

          // 3. Close QR & Simulate Scale after 2.4s
          setTimeout(() => {
            handleStep3();

            // 4. Open Withdraw modal after 2.2s
            setTimeout(() => {
              handleStep4();
              Toastify({
                text: 'Siklus Alur SaaS Trash2Cash Sukses Sempurna!',
                className: 'toast-success',
                duration: 4000,
                gravity: 'top',
                position: 'center'
              }).showToast();
            }, 2200);
          }, 2400);
        }, 1800);
      });
    }
  }

  setPipelineStep(step, allCompleted = false) {
    this.pipelineStep = step;
    const stepNodes = [
      document.getElementById('pipelineStep1'),
      document.getElementById('pipelineStep2'),
      document.getElementById('pipelineStep3'),
      document.getElementById('pipelineStep4')
    ];
    const statusTags = [
      document.getElementById('step1Status'),
      document.getElementById('step2Status'),
      document.getElementById('step3Status'),
      document.getElementById('step4Status')
    ];
    const activeText = document.getElementById('pipelineActiveStepText');

    const stepTitles = [
      'Langkah 1 dari 4: Scan AI',
      'Langkah 2 dari 4: Tiket Setor QR',
      'Langkah 3 dari 4: Validasi Timbangan IoT',
      'Langkah 4 dari 4: Saldo Masuk & Klaim Streak'
    ];

    if (activeText) {
      activeText.textContent = allCompleted ? 'Alur Selesai ✓ (Semua Langkah Tuntas)' : stepTitles[step - 1];
    }

    stepNodes.forEach((node, idx) => {
      if (!node) return;
      const tag = statusTags[idx];
      const nodeStep = idx + 1;

      if (allCompleted || nodeStep < step) {
        node.classList.remove('active');
        node.classList.add('completed');
        if (tag) {
          tag.className = 'step-status-tag tag-done';
          tag.textContent = 'SELESAI ✓';
        }
      } else if (nodeStep === step) {
        node.classList.add('active');
        node.classList.remove('completed');
        if (tag) {
          tag.className = 'step-status-tag tag-ready';
          tag.textContent = 'AKTIF ✦';
        }
      } else {
        node.classList.remove('active', 'completed');
        if (tag) {
          tag.className = 'step-status-tag tag-wait';
          tag.textContent = 'MENUNGGU';
        }
      }
    });
  }

  /* -----------------------------------------------------
     GAMIFICATION HUB ACTIONS (WITHDRAW, STREAK, REWARD & LEADERBOARD)
     ----------------------------------------------------- */
  initGamificationActions() {
    const btnOpenWithdraw = document.getElementById('btnOpenWithdrawModal');
    const btnClaimStreak = document.getElementById('btnClaimDailyStreak');
    const btnBuyShield = document.getElementById('btnBuyShield');
    const btnSimNextDay = document.getElementById('btnSimNextDay');
    const milestoneWrap = document.getElementById('rewardMilestones');

    if (btnOpenWithdraw) {
      btnOpenWithdraw.addEventListener('click', () => {
        if (sound.playGrab) sound.playGrab();
        const modal = document.getElementById('modalWithdraw');
        const curBal = document.getElementById('modalCurrentBalVal');
        if (curBal) {
          curBal.textContent = `Rp ${this.currentBalance.toLocaleString('id-ID')}`;
        }
        if (modal) modal.classList.remove('is-hidden');
      });
    }

    if (btnClaimStreak) {
      btnClaimStreak.addEventListener('click', () => this.handleDailyStreakClaim());
    }

    if (btnBuyShield) {
      btnBuyShield.addEventListener('click', () => this.buyStreakShield());
    }

    if (btnSimNextDay) {
      btnSimNextDay.addEventListener('click', () => this.simulateNextDay());
    }

    // Navbar Streak Pill Click → Quick info & scroll to Streak Card
    const navStreakPill = document.getElementById('navStreakPill');
    if (navStreakPill) {
      navStreakPill.addEventListener('click', () => {
        if (sound.playGrab) sound.playGrab();
        const days = this.gamify?.streakDays !== undefined ? this.gamify.streakDays : 5;
        const mult = this.getMultiplier ? this.getMultiplier(days).toFixed(1) : '1.2';
        Toastify({
          text: `Streak Penyetoran: ${days} Hari Berturut-turut! Pengali Poin: ${mult}x. Pertahankan terus!`,
          className: 'toast-eco',
          duration: 3500,
          gravity: 'top',
          position: 'right'
        }).showToast();

        if (this.currentView !== 'control') {
          this.switchToView('control', {
            onAfter: () => {
              const streakCard = document.getElementById('streakCard') || document.getElementById('gamificationHub');
              if (streakCard) {
                if (this.lenis) this.lenis.scrollTo(streakCard, { offset: -30, duration: 1.1 });
                else streakCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                gsap.fromTo(streakCard, { scale: 0.96 }, { scale: 1, duration: 0.45, ease: 'back.out(2)' });
              }
            }
          });
        } else {
          const streakCard = document.getElementById('streakCard') || document.getElementById('gamificationHub');
          if (streakCard) {
            if (this.lenis) this.lenis.scrollTo(streakCard, { offset: -30, duration: 0.9 });
            else streakCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            gsap.fromTo(streakCard, { scale: 0.96 }, { scale: 1, duration: 0.45, ease: 'back.out(2)' });
          }
        }
      });
    }

    // Event delegation for milestone claim buttons (rendered dynamically)
    if (milestoneWrap) {
      milestoneWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-claim-milestone]');
        if (btn) this.claimMilestone(parseInt(btn.dataset.claimMilestone, 10));
      });
    }

    // Leaderboard scope tabs
    document.querySelectorAll('.lb-scope-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        if (!this.gamify) return;
        this.gamify.lbScope = tab.dataset.lbScope || 'weekly';
        if (sound.playGrab) sound.playGrab();
        this.renderLeaderboard();
        const table = document.getElementById('leaderboardTable');
        if (table) gsap.fromTo(table.children, { opacity: 0, x: -8 }, { opacity: 1, x: 0, stagger: 0.04, duration: 0.3 });
      });
    });

    // Live countdown ticker (streak deadline & season end)
    if (!this.gamifyTicker) {
      this.gamifyTicker = setInterval(() => this.tickGamifyTimers(), 1000);
    }
  }

  /* ---------- Gamification config ---------- */
  getStreakMilestones() {
    return [
      { day: 3, emoji: '🌱', icon: 'leaf', iconClass: 'icon-eco', title: '3 Hari', reward: '+30 Poin', pts: 30, rp: 0 },
      { day: 7, emoji: '🎖️', icon: 'award', iconClass: 'icon-gold', title: '7 Hari', reward: 'Rp 5.000 + Badge Pejuang Pilah', pts: 50, rp: 5000 },
      { day: 14, emoji: '🛡️', icon: 'shield', iconClass: 'icon-shield', title: '14 Hari', reward: '+1 Shield & Pengali 1.5x', pts: 100, rp: 0, shield: 1 },
      { day: 30, emoji: '🥇', icon: 'medal', iconClass: 'icon-gold', title: '30 Hari', reward: 'Rp 25.000 + Badge Emas', pts: 250, rp: 25000 },
      { day: 60, emoji: '🏆', icon: 'trophy', iconClass: 'icon-gold', title: '60 Hari', reward: 'Rp 75.000 + Liga Berlian', pts: 500, rp: 75000 }
    ];
  }

  getMultiplierTiers() {
    return [
      { min: 0, max: 2, mult: 1.0, label: '1–2 hari' },
      { min: 3, max: 6, mult: 1.2, label: '3–6 hari' },
      { min: 7, max: 13, mult: 1.3, label: '7–13 hari' },
      { min: 14, max: 29, mult: 1.5, label: '14–29 hari' },
      { min: 30, max: Infinity, mult: 2.0, label: '30+ hari' }
    ];
  }

  getMultiplier(days) {
    const tier = this.getMultiplierTiers().find(t => days >= t.min && days <= t.max);
    return tier ? tier.mult : 1.0;
  }

  getLeague(points) {
    if (points >= 4000) return { icon: '💎', name: 'LIGA BERLIAN', next: null, medalClass: 'lb-medal-diamond' };
    if (points >= 1500) return { icon: '🥇', name: 'LIGA EMAS', next: 4000, medalClass: 'lb-medal-gold' };
    if (points >= 500) return { icon: '🥈', name: 'LIGA PERAK', next: 1500, medalClass: 'lb-medal-silver' };
    return { icon: '🥉', name: 'LIGA PERUNGGU', next: 500, medalClass: 'lb-medal-bronze' };
  }

  /* ---------- State init (called from applyUserProfile) ---------- */
  initGamifyState(profile) {
    const days = profile.streakDays || 5;
    const isHub = profile.role === 'bumdes' || profile.role === 'mitra';
    const baseKg = profile.divertedKg || (isHub ? 1240 : 34.8);

    // Last 6 days history (oldest → newest): done if inside current streak
    const history = [];
    for (let i = 6; i >= 1; i--) history.push(i <= days ? 'done' : 'miss');

    this.gamify = {
      streakDays: days,
      depositedToday: false,
      bonusClaimedToday: false,
      shields: isHub ? 2 : 1,
      history,
      dayOffset: 0,
      claimedMilestones: this.getStreakMilestones().filter(m => m.day <= days).map(m => m.day),
      lbScope: 'weekly',
      selfKg: {
        weekly: baseKg,
        monthly: +(baseKg + (isHub ? 2860 : 96)).toFixed(1)
      },
      prevRank: isHub ? { weekly: 3, monthly: 4 } : { weekly: 5, monthly: 7 }
    };

    document.querySelectorAll('.lb-scope-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.lbScope === 'weekly');
    });

    this.renderGamification();
  }

  renderGamification() {
    if (!this.gamify) return;
    this.renderStreakCard();
    this.renderRewardRoad();
    this.renderLeaderboard();
    this.tickGamifyTimers();
  }

  /* ---------- Streak card ---------- */
  renderStreakCard() {
    const g = this.gamify;
    const mult = this.getMultiplier(g.streakDays);

    const daysEl = document.getElementById('homeStreakDays');
    const multEl = document.getElementById('homeStreakMultiplier');
    const flameEl = document.getElementById('streakFlameIcon');
    const pill = document.getElementById('streakStatusPill');
    const shieldEl = document.getElementById('streakShieldCount');
    const claimBtn = document.getElementById('btnClaimDailyStreak');
    const claimLabel = document.getElementById('streakClaimLabel');
    const card = document.getElementById('streakCard');

    if (daysEl) daysEl.textContent = `${g.streakDays} HARI`;
    if (multEl) multEl.textContent = `${mult.toFixed(1)}x PENGALI POIN`;
    if (flameEl) flameEl.innerHTML = g.streakDays === 0 ? '⚡' : '🔥';
    if (shieldEl) shieldEl.textContent = g.shields;

    // Sync Navbar Streak Badge
    const navStreakDays = document.getElementById('navStreakDays');
    const navStreakMult = document.getElementById('navStreakMult');
    const navStreakFlame = document.getElementById('navStreakFlame');
    if (navStreakDays) navStreakDays.textContent = `${g.streakDays} HARI`;
    if (navStreakMult) navStreakMult.textContent = `${mult.toFixed(1)}x POIN`;
    if (navStreakFlame) navStreakFlame.innerHTML = g.streakDays === 0 ? '⚡' : '🔥';

    if (pill) {
      pill.classList.remove('is-risk', 'is-safe', 'is-cold');
      if (g.depositedToday) {
        pill.classList.add('is-safe');
        pill.innerHTML = '🛡️ AMAN HARI INI';
      } else if (g.streakDays === 0) {
        pill.classList.add('is-cold');
        pill.innerHTML = '🔥 MULAI STREAK';
      } else {
        pill.classList.add('is-risk');
        pill.innerHTML = '⚠️ BERISIKO PUTUS';
      }
    }
    if (card) card.classList.toggle('is-safe', g.depositedToday);

    if (claimBtn && claimLabel) {
      claimBtn.classList.remove('is-locked');
      if (!g.depositedToday) {
        claimBtn.disabled = false;
        claimBtn.classList.add('is-locked');
        claimLabel.innerHTML = '📦 Setor Hari Ini untuk Amankan Streak';
      } else if (!g.bonusClaimedToday) {
        claimBtn.disabled = false;
        claimLabel.innerHTML = `🔥 Klaim Bonus Streak (+${Math.round(50 * mult)} Poin)`;
      } else {
        claimBtn.disabled = true;
        claimLabel.innerHTML = '✅ Bonus Hari Ini Sudah Diklaim';
      }
    }

    // Rolling 7-day track: 6 past days + today
    const track = document.getElementById('streakWeekTrack');
    if (track) {
      const names = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const base = new Date();
      base.setDate(base.getDate() + g.dayOffset);
      const icons = { done: '✓', shield: '🛡️', miss: '✕' };
      const titles = { done: 'Setor', shield: 'Dilindungi Shield', miss: 'Terlewat' };
      let html = '';
      g.history.forEach((status, idx) => {
        const d = new Date(base);
        d.setDate(base.getDate() - (6 - idx));
        html += `<div class="streak-day-dot ${status}" title="${names[d.getDay()]}: ${titles[status]}"><span>${names[d.getDay()]}</span><span class="dot-check">${icons[status]}</span></div>`;
      });
      const todayStatus = g.depositedToday ? 'done' : 'pending';
      html += `<div class="streak-day-dot active-today ${todayStatus}" title="Hari ini: ${g.depositedToday ? 'Sudah setor' : 'Belum setor'}"><span>${names[base.getDay()]}</span><span class="dot-check">${g.depositedToday ? '✓' : '!'}</span></div>`;
      track.innerHTML = html;
    }
  }

  /* ---------- Reward road ---------- */
  renderRewardRoad() {
    const g = this.gamify;
    const milestones = this.getStreakMilestones();
    const wrap = document.getElementById('rewardMilestones');
    const fill = document.getElementById('rewardRoadFill');
    const hint = document.getElementById('rewardNextHint');
    const legend = document.getElementById('rewardTierLegend');

    if (wrap) {
      wrap.innerHTML = milestones.map(m => {
        const reached = g.streakDays >= m.day;
        const claimed = g.claimedMilestones.includes(m.day);
        let state = 'locked';
        let action = `<span class="milestone-lock">🔒 ${m.day - g.streakDays} hari lagi</span>`;
        if (claimed) {
          state = 'claimed';
          action = '<span class="milestone-done">✅ Diklaim</span>';
        } else if (reached) {
          state = 'claimable';
          action = `<button class="milestone-claim-btn" type="button" data-claim-milestone="${m.day}">🎁 Klaim</button>`;
        }
        return `
          <div class="reward-milestone ${state}">
            <div class="milestone-node"><span class="milestone-emoji">${m.emoji || '🎁'}</span></div>
            <span class="milestone-day">${m.title}</span>
            <span class="milestone-reward">${m.reward}</span>
            ${action}
          </div>`;
      }).join('');
    }

    // Piecewise fill: node i sits at the center of column i → (i + 0.5) / n of the track.
    // Day 0 = left edge; past the last milestone = full width.
    if (fill) {
      const n = milestones.length;
      const nodePos = (i) => (i < 0 ? 0 : ((i + 0.5) / n) * 100);
      let pct = 100;
      for (let i = 0; i < n; i++) {
        const prevDay = i === 0 ? 0 : milestones[i - 1].day;
        if (g.streakDays < milestones[i].day) {
          const seg = Math.max(0, (g.streakDays - prevDay) / (milestones[i].day - prevDay));
          pct = nodePos(i - 1) + seg * (nodePos(i) - nodePos(i - 1));
          break;
        }
      }
      fill.style.width = `${Math.min(100, pct).toFixed(1)}%`;
    }

    if (hint) {
      const claimable = milestones.find(m => g.streakDays >= m.day && !g.claimedMilestones.includes(m.day));
      const next = milestones.find(m => g.streakDays < m.day);
      if (claimable) {
        hint.innerHTML = `🎁 Hadiah ${claimable.title} siap diklaim!`;
        hint.classList.add('has-reward');
      } else if (next) {
        hint.textContent = `${next.day - g.streakDays} hari lagi menuju ${next.title}`;
        hint.classList.remove('has-reward');
      } else {
        hint.innerHTML = '🏆 Semua milestone tuntas! Anda legenda sirkular.';
        hint.classList.remove('has-reward');
      }
    }

    if (legend) {
      const tiers = this.getMultiplierTiers();
      legend.innerHTML = '<span class="tier-legend-label">PENGALI POIN STREAK:</span>' + tiers.map(t => {
        const active = g.streakDays >= t.min && g.streakDays <= t.max;
        return `<span class="tier-chip ${active ? 'active' : ''}">${t.label} • <b>${t.mult.toFixed(1)}x</b></span>`;
      }).join('');
    }
    this.renderIcons();
  }

  /* ---------- Leaderboard ---------- */
  getLeaderboardEntries(scope) {
    const g = this.gamify;
    const isHub = this.userProfile && (this.userProfile.role === 'bumdes' || this.userProfile.role === 'mitra');
    const fullName = (this.userProfile && this.userProfile.name) || 'Anda';
    const selfName = isHub ? fullName : fullName.split(' ').slice(0, 2).join(' ');

    let others;
    if (isHub) {
      others = scope === 'weekly'
        ? [{ name: 'Mitra Maju Jaya', kg: 1580 }, { name: 'Mitra Sumber Rejeki', kg: 1102 }, { name: 'Mitra Tirta Lestari', kg: 968 }, { name: 'Mitra Karya Mandiri', kg: 874 }, { name: 'Mitra Harapan Baru', kg: 790 }]
        : [{ name: 'Mitra Maju Jaya', kg: 5120 }, { name: 'Mitra Sumber Rejeki', kg: 4380 }, { name: 'Mitra Tirta Lestari', kg: 3990 }, { name: 'Mitra Karya Mandiri', kg: 3420 }, { name: 'Mitra Harapan Baru', kg: 3010 }];
    } else {
      others = scope === 'weekly'
        ? [{ name: 'Siti Rahmawati', kg: 68.2 }, { name: 'Budi Santoso', kg: 52.4 }, { name: 'Dewi Lestari', kg: 31.5 }, { name: 'Rudi Hartono', kg: 27.9 }, { name: 'Agus Salim', kg: 22.1 }]
        : [{ name: 'Hj. Maryam', kg: 212.4 }, { name: 'Bank Sampah Melati', kg: 198.0 }, { name: 'Siti Rahmawati', kg: 176.5 }, { name: 'Andi Pratama', kg: 141.2 }, { name: 'Rina Kusuma', kg: 118.6 }, { name: 'Pak Joko', kg: 101.3 }];
    }

    const all = [...others, { name: selfName, kg: g.selfKg[scope], self: true }]
      .sort((a, b) => b.kg - a.kg);
    all.forEach((e, i) => { e.rank = i + 1; });
    return all;
  }

  getSelfRank(scope) {
    const self = this.getLeaderboardEntries(scope).find(e => e.self);
    return self ? self.rank : 0;
  }

  renderLeaderboard() {
    const g = this.gamify;
    const scope = g.lbScope;
    const isHub = this.userProfile && (this.userProfile.role === 'bumdes' || this.userProfile.role === 'mitra');
    const rate = isHub ? 1200 : 4500;
    const entries = this.getLeaderboardEntries(scope);
    const self = entries.find(e => e.self);

    document.querySelectorAll('.lb-scope-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.lbScope === scope);
    });
    const tabWeekly = document.getElementById('lbTabWeekly');
    const tabMonthly = document.getElementById('lbTabMonthly');
    if (tabWeekly) tabWeekly.textContent = isHub ? 'Mingguan • Kecamatan' : 'Mingguan • RW 03';
    if (tabMonthly) tabMonthly.textContent = isHub ? 'Bulanan • Kabupaten' : 'Bulanan • Kecamatan';

    // Rows: top 5, or top 4 + self if self is outside top 5
    const table = document.getElementById('leaderboardTable');
    if (table) {
      let rows = entries.slice(0, 5);
      let gap = false;
      if (self.rank > 5) { rows = [...entries.slice(0, 4), self]; gap = true; }
      const medal = (r) => (r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : '#');
      table.innerHTML = rows.map((e, idx) => {
        const sep = gap && idx === 4 ? '<div class="leader-gap">• • •</div>' : '';
        return `${sep}<div class="leader-row rank-${e.rank} ${e.self ? 'is-current-user' : ''}">
            <span class="rank-pos">${medal(e.rank)} ${e.rank}</span>
            <span class="rank-name">${e.name}${e.self ? ' (Anda)' : ''}</span>
            <span class="rank-stat">${e.kg.toLocaleString('id-ID', { maximumFractionDigits: 1 })} kg</span>
            <span class="rank-cuan">Rp ${Math.round(e.kg * rate).toLocaleString('id-ID')}</span>
          </div>`;
      }).join('');
    }

    const rankBadge = document.getElementById('homeUserRankBadge');
    if (rankBadge) rankBadge.textContent = `RANKING #${self.rank}`;

    // Rank delta vs. last period
    const deltaEl = document.getElementById('lbRankDelta');
    if (deltaEl) {
      const delta = g.prevRank[scope] - self.rank;
      deltaEl.classList.remove('up', 'down', 'flat');
      const period = scope === 'weekly' ? 'minggu ini' : 'bulan ini';
      if (delta > 0) { deltaEl.classList.add('up'); deltaEl.textContent = `▲ ${delta} ${period}`; }
      else if (delta < 0) { deltaEl.classList.add('down'); deltaEl.textContent = `▼ ${Math.abs(delta)} ${period}`; }
      else { deltaEl.classList.add('flat'); deltaEl.textContent = `• Stabil ${period}`; }
    }

    // League by points
    const leagueEl = document.getElementById('lbLeagueBadge');
    if (leagueEl) {
      const league = this.getLeague(this.currentPoints);
      leagueEl.innerHTML = `<span class="lb-medal-emoji">${league.icon}</span> ${league.name}`;
      leagueEl.title = league.next ? `${league.next - this.currentPoints} poin lagi untuk naik liga` : 'Liga tertinggi';
    }

    // Overtake target
    const overtakeText = document.getElementById('lbOvertakeText');
    const overtakeFill = document.getElementById('lbOvertakeFill');
    const above = entries[self.rank - 2];
    if (overtakeText && overtakeFill) {
      if (!above) {
        overtakeText.innerHTML = '🏆 <b>Anda memimpin!</b> Pertahankan setoran agar tidak tersalip.';
        overtakeFill.style.width = '100%';
      } else {
        const need = Math.max(0.1, above.kg - self.kg + 0.1);
        const needTxt = need.toLocaleString('id-ID', { maximumFractionDigits: 1 });
        overtakeText.innerHTML = `Setor <b>${needTxt} kg</b> lagi untuk menyalip <b>${above.name}</b> (#${above.rank})`;
        overtakeFill.style.width = `${Math.min(100, (self.kg / above.kg) * 100).toFixed(1)}%`;
      }
    }
    this.renderIcons();
  }

  /* ---------- Timers ---------- */
  tickGamifyTimers() {
    if (!this.gamify) return;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');

    // Streak deadline: midnight today
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const left = Math.max(0, midnight - now);
    const h = Math.floor(left / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    const s = Math.floor((left % 60000) / 1000);

    const cd = document.getElementById('streakCountdown');
    const txt = document.getElementById('streakDeadlineText');
    if (cd) {
      cd.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
      cd.classList.toggle('is-urgent', !this.gamify.depositedToday && h < 3);
    }
    if (txt) {
      txt.textContent = this.gamify.depositedToday
        ? 'Streak hari ini aman. Hari berikutnya dimulai dalam'
        : (h < 3 ? 'Segera setor! Streak putus dalam' : 'Setor sebelum 23:59 agar streak tidak putus');
    }

    // Season end: weekly → Sunday 23:59:59, monthly → end of month
    const seasonEl = document.getElementById('lbSeasonCountdown');
    if (seasonEl) {
      const end = new Date(now);
      if (this.gamify.lbScope === 'weekly') {
        end.setDate(now.getDate() + ((7 - now.getDay()) % 7));
      } else {
        end.setMonth(now.getMonth() + 1, 0);
      }
      end.setHours(23, 59, 59, 999);
      const ms = Math.max(0, end - now);
      const d = Math.floor(ms / 86400000);
      const hh = Math.floor((ms % 86400000) / 3600000);
      const mm = Math.floor((ms % 3600000) / 60000);
      seasonEl.textContent = d > 0 ? `${d} hari ${pad(hh)}:${pad(mm)}` : `${pad(hh)}:${pad(mm)}`;
    }
  }

  /* ---------- Actions ---------- */
  creditReward(rp = 0, pts = 0) {
    this.currentBalance += rp;
    this.currentPoints += pts;
    this.animateBalanceRoll(rp, pts);
    const inc = document.getElementById('homeUserIncomeVal');
    if (inc) inc.textContent = `Rp ${this.currentBalance.toLocaleString('id-ID')}`;
  }

  // Called whenever a deposit is validated in the ledger (pipeline step 3)
  recordDeposit(kg) {
    const g = this.gamify;
    if (!g) return;
    const scope = g.lbScope;
    const prevRank = this.getSelfRank(scope);

    g.selfKg.weekly = +(g.selfKg.weekly + kg).toFixed(1);
    g.selfKg.monthly = +(g.selfKg.monthly + kg).toFixed(1);

    if (!g.depositedToday) {
      g.depositedToday = true;
      g.streakDays += 1;
      Toastify({
        text: `Streak aman! Kini ${g.streakDays} hari berturut-turut. Klaim bonus harian Anda.`,
        className: 'toast-eco',
        duration: 3800,
        gravity: 'top',
        position: 'right'
      }).showToast();

      const reached = this.getStreakMilestones().find(m => m.day === g.streakDays);
      if (reached) {
        Toastify({
          text: `Milestone ${reached.title} tercapai! Klaim hadiahnya di Reward Streak.`,
          className: 'toast-success',
          duration: 4200,
          gravity: 'top',
          position: 'right'
        }).showToast();
      }
    }

    const newRank = this.getSelfRank(scope);
    this.renderGamification();

    if (newRank < prevRank) {
      if (sound.playComplete) sound.playComplete();
      Toastify({
        text: `Naik ke peringkat #${newRank} leaderboard ${scope === 'weekly' ? 'mingguan' : 'bulanan'}!`,
        className: 'toast-success',
        duration: 4000,
        gravity: 'top',
        position: 'right'
      }).showToast();
      const card = document.getElementById('leaderboardCard');
      if (card) gsap.fromTo(card, { scale: 1.03 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
    }
  }

  handleDailyStreakClaim() {
    const g = this.gamify;
    if (!g) return;

    if (!g.depositedToday) {
      if (sound.playGrab) sound.playGrab();
      Toastify({
        text: 'Streak dihitung dari setoran. Jalankan Alur Kerja (Scan → Tiket → Timbang) dulu hari ini.',
        className: 'toast-info',
        duration: 4000,
        gravity: 'top',
        position: 'right'
      }).showToast();
      const pipeline = document.getElementById('saasActionPipeline');
      if (pipeline) {
        if (this.lenis) this.lenis.scrollTo(pipeline, { offset: -80, duration: 0.9 });
        else pipeline.scrollIntoView({ behavior: 'smooth', block: 'start' });
        gsap.fromTo(pipeline, { boxShadow: '0 0 0 4px #C8FF2E' }, { boxShadow: '4px 4px 0px #161616', duration: 1.4, ease: 'power2.out' });
      }
      return;
    }
    if (g.bonusClaimedToday) return;

    const pts = Math.round(50 * this.getMultiplier(g.streakDays));
    g.bonusClaimedToday = true;
    this.creditReward(0, pts);
    if (sound.playComplete) sound.playComplete();

    Toastify({
      text: `Bonus streak harian +${pts} Poin (${this.getMultiplier(g.streakDays).toFixed(1)}x) masuk ke akun Anda!`,
      className: 'toast-success',
      duration: 3500,
      gravity: 'top',
      position: 'right'
    }).showToast();

    this.renderGamification();
    const flame = document.getElementById('streakFlameIcon');
    if (flame) gsap.fromTo(flame, { scale: 1.6, rotate: -12 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(3)' });
  }

  claimMilestone(day) {
    const g = this.gamify;
    if (!g) return;
    const m = this.getStreakMilestones().find(x => x.day === day);
    if (!m || g.streakDays < day || g.claimedMilestones.includes(day)) return;

    g.claimedMilestones.push(day);
    if (m.shield) g.shields += m.shield;
    this.creditReward(m.rp, m.pts);
    if (sound.playComplete) sound.playComplete();

    const parts = [];
    if (m.rp) parts.push(`Rp ${m.rp.toLocaleString('id-ID')}`);
    if (m.pts) parts.push(`+${m.pts} Poin`);
    if (m.shield) parts.push(`+${m.shield} Shield`);

    Toastify({
      text: `Hadiah streak ${m.title} diklaim: ${parts.join(' • ')}`,
      className: 'toast-success',
      duration: 4000,
      gravity: 'top',
      position: 'right'
    }).showToast();

    this.renderGamification();
    const idx = this.getStreakMilestones().findIndex(x => x.day === day);
    const target = document.querySelectorAll('.reward-milestone')[idx];
    if (target) gsap.fromTo(target, { scale: 1.12 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
  }

  buyStreakShield() {
    const g = this.gamify;
    if (!g) return;
    if (g.shields >= 3) {
      Toastify({ text: 'Maksimal 3 Streak Shield tersimpan.', className: 'toast-info', duration: 3000, gravity: 'top', position: 'right' }).showToast();
      return;
    }
    if (this.currentPoints < 200) {
      Toastify({ text: `Poin belum cukup (${this.currentPoints}/200).`, className: 'toast-warning', duration: 3000, gravity: 'top', position: 'right' }).showToast();
      return;
    }
    g.shields += 1;
    this.creditReward(0, -200);
    if (sound.playGrab) sound.playGrab();
    Toastify({ text: '+1 Streak Shield! Streak Anda terlindungi 1x jika lupa setor.', className: 'toast-eco', duration: 3200, gravity: 'top', position: 'right' }).showToast();
    this.renderGamification();
  }

  // Demo helper: advance time by one day to show streak keep/break/shield logic
  simulateNextDay() {
    const g = this.gamify;
    if (!g) return;
    if (sound.playGrab) sound.playGrab();

    let todayStatus = 'done';
    if (!g.depositedToday) {
      if (g.streakDays > 0 && g.shields > 0) {
        g.shields -= 1;
        todayStatus = 'shield';
        Toastify({
          text: `Kemarin Anda tidak setor — 1 Streak Shield terpakai. Streak ${g.streakDays} hari selamat!`,
          className: 'toast-info',
          duration: 4200,
          gravity: 'top',
          position: 'right'
        }).showToast();
      } else {
        todayStatus = 'miss';
        if (g.streakDays > 0) {
          Toastify({
            text: `Streak ${g.streakDays} hari putus karena tidak setor. Mulai lagi hari ini!`,
            className: 'toast-warning',
            duration: 4200,
            gravity: 'top',
            position: 'right'
          }).showToast();
        }
        g.streakDays = 0;
        g.claimedMilestones = [];
      }
    } else {
      Toastify({
        text: `Hari baru! Streak ${g.streakDays} hari — setor lagi hari ini untuk lanjut.`,
        className: 'toast-eco',
        duration: 3200,
        gravity: 'top',
        position: 'right'
      }).showToast();
    }

    g.history.push(todayStatus);
    if (g.history.length > 6) g.history.shift();
    g.depositedToday = false;
    g.bonusClaimedToday = false;
    g.dayOffset += 1;

    this.setPipelineStep(1);
    this.renderGamification();
  }

  /* -----------------------------------------------------
     SAAS MODALS (TIKET QR & PENCAIRAN SALDO)
     ----------------------------------------------------- */
  initModals() {
    const closeBtns = document.querySelectorAll('.js-close-modal');
    const backdrops = document.querySelectorAll('.saas-modal-backdrop');
    const btnGoToScale = document.getElementById('btnGoToScaleSim');
    const withdrawForm = document.getElementById('withdrawForm');
    const methodPills = document.querySelectorAll('.withdraw-method-pill');
    const presetBtns = document.querySelectorAll('.amount-preset-btn');
    const inputAmount = document.getElementById('inputWithdrawAmount');
    let selectedMethod = 'Transfer Bank';

    // Close Modals
    const closeModal = (modal) => {
      if (!modal) return;
      modal.classList.add('is-hidden');
    };

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (sound.playGrab) sound.playGrab();
        const modal = btn.closest('.saas-modal-backdrop');
        closeModal(modal);
      });
    });

    backdrops.forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          closeModal(backdrop);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        backdrops.forEach(m => closeModal(m));
      }
    });

    // Go to Scale from QR Modal
    if (btnGoToScale) {
      btnGoToScale.addEventListener('click', () => {
        const modalQr = document.getElementById('modalQrTicket');
        closeModal(modalQr);
        
        // Trigger step 3 (Timbangan)
        const btnTriggerStep3 = document.getElementById('btnTriggerStep3');
        if (btnTriggerStep3) btnTriggerStep3.click();
      });
    }

    // Method selection in Withdraw Modal
    methodPills.forEach(pill => {
      pill.addEventListener('click', () => {
        methodPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedMethod = pill.textContent.trim();
        if (sound.playGrab) sound.playGrab();
      });
    });

    // Presets in Withdraw Modal
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const amt = btn.dataset.amt;
        if (amt === 'all') {
          if (inputAmount) inputAmount.value = this.currentBalance;
        } else {
          if (inputAmount) inputAmount.value = amt;
        }
        if (sound.playGrab) sound.playGrab();
      });
    });

    // Withdraw Form Submission
    if (withdrawForm) {
      withdrawForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amt = parseInt(inputAmount ? inputAmount.value : '0', 10);
        const acct = document.getElementById('inputWithdrawAccount')?.value || 'Akun Anda';

        if (isNaN(amt) || amt < 20000) {
          Toastify({
            text: 'Minimal penarikan saldo adalah Rp 20.000',
            className: 'toast-warning',
            duration: 3000,
            gravity: 'top',
            position: 'right'
          }).showToast();
          return;
        }

        if (amt > this.currentBalance) {
          Toastify({
            text: `Saldo aktif Anda (Rp ${this.currentBalance.toLocaleString('id-ID')}) tidak mencukupi!`,
            className: 'toast-warning',
            duration: 3000,
            gravity: 'top',
            position: 'right'
          }).showToast();
          return;
        }

        // Deduct balance
        this.currentBalance -= amt;
        this.animateBalanceRoll(-amt, 0);

        const homeIncomeVal = document.getElementById('homeUserIncomeVal');
        if (homeIncomeVal) {
          homeIncomeVal.textContent = `Rp ${this.currentBalance.toLocaleString('id-ID')}`;
        }
        const modalCurrentBal = document.getElementById('modalCurrentBalVal');
        if (modalCurrentBal) {
          modalCurrentBal.textContent = `Rp ${this.currentBalance.toLocaleString('id-ID')}`;
        }

        const modalWithdraw = document.getElementById('modalWithdraw');
        closeModal(modalWithdraw);

        if (sound.playComplete) sound.playComplete();

        Toastify({
          text: `Pencairan Rp ${amt.toLocaleString('id-ID')} ke ${selectedMethod} (${acct}) BERHASIL diproses instan!`,
          className: 'toast-success',
          duration: 4000,
          gravity: 'top',
          position: 'right'
        }).showToast();
      });
    }
  }

  /* -----------------------------------------------------
     MULTI-PAGE VIEW NAVIGATION WITH CIRCULAR LOADER
     Pemisahan Nyata: Panggung Maskot vs Pusat Kontrol Sirkular
     Melewati Layar Loading Lingkaran Tangensial TrashRingLoader
     ----------------------------------------------------- */
  switchToView(targetView, options = {}) {
    if (this.currentView === targetView || this.isSwitchingView) return;
    this.isSwitchingView = true;

    if (sound.playGrab) sound.playGrab();

    const isGoingToControl = targetView === 'control';
    const loaderText = isGoingToControl ? 'Membuka Pusat Kontrol Sirkular' : 'Kembali ke Panggung Maskot';
    const loaderSubtext = isGoingToControl
      ? ['Menyiapkan pipeline audit & sensor timbangan IoT...', 'Sinkronisasi buku kas sirkular Mitra...']
      : ['Menyiapkan panggung sambutan maskot...', 'Mengumpulkan insight sirkular hari ini...'];

    // Tampilkan circular trash-ring loader fullscreen
    const loader = showLoader({
      mode: 'fullscreen',
      activeItem: isGoingToControl ? 'soda-can' : 'plastic-bottle',
      text: loaderText,
      subtext: loaderSubtext,
      minDuration: 1600
    });

    setTimeout(() => {
      try {
        this.setView(targetView, true);
        if (typeof options.onAfter === 'function') {
          options.onAfter();
        }
      } finally {
        this.isSwitchingView = false;
        loader.hide();
      }
    }, 1600);
  }

  setView(viewName, isAnimated = false) {
    this.currentView = viewName;
    const pageHero = document.getElementById('pageHeroView');
    const pageControl = document.getElementById('pageControlView');
    const tabHero = document.getElementById('tabHeroView');
    const tabControl = document.getElementById('tabControlView');

    if (viewName === 'hero') {
      if (pageHero) pageHero.classList.remove('is-hidden');
      if (pageControl) pageControl.classList.add('is-hidden');
      if (tabHero) {
        tabHero.classList.add('active');
        tabHero.setAttribute('aria-selected', 'true');
      }
      if (tabControl) {
        tabControl.classList.remove('active');
        tabControl.setAttribute('aria-selected', 'false');
      }

      if (isAnimated && pageHero) {
        gsap.fromTo(pageHero, 
          { opacity: 0, y: 15 }, 
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
        );
      }
    } else {
      if (pageHero) pageHero.classList.add('is-hidden');
      if (pageControl) pageControl.classList.remove('is-hidden');
      if (tabHero) {
        tabHero.classList.remove('active');
        tabHero.setAttribute('aria-selected', 'false');
      }
      if (tabControl) {
        tabControl.classList.add('active');
        tabControl.setAttribute('aria-selected', 'true');
      }

      // Re-trigger layout resize so ApexCharts recalculates crisp dimensions
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 60);

      if (isAnimated && pageControl) {
        gsap.fromTo(pageControl, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
        );
      }
    }

    // Always reset scroll to absolute top of the newly displayed page
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (this.container) this.container.scrollTop = 0;
    if (this.lenis) this.lenis.scrollTo(0, { immediate: true });
  }

  /**
   * Helper transisi perpindahan fitur dengan circular trash-ring loader
   */
  openFeatureWithLoader(options = {}, onComplete) {
    if (this.isFeatureTransitioning) return;
    this.isFeatureTransitioning = true;

    if (sound.playGrab) sound.playGrab();

    const minDuration = options.minDuration || 850;
    const loader = showLoader({
      mode: 'fullscreen',
      activeItem: options.activeItem || 'plastic-bottle',
      text: options.text || 'Membuka Fitur Trash 2 Cash',
      subtext: options.subtext || ['Sinkronisasi modul sistem...'],
      minDuration: minDuration
    });

    setTimeout(() => {
      this.isFeatureTransitioning = false;
      if (typeof onComplete === 'function') {
        onOpenComplete();
      }
      if (sound.playComplete) sound.playComplete();
      loader.hide();
    }, minDuration);

    const onOpenComplete = () => {
      try {
        onComplete();
      } catch (err) {
        console.error('Error in onComplete callback:', err);
      }
    };
  }

  /* -----------------------------------------------------
     PUSAT KONTROL 3-TAB SYSTEM (PIPELINE, MONITORING, GAMIFICATION)
     ----------------------------------------------------- */
  initControlTabs() {
    const tabBtns = document.querySelectorAll('.control-nav-tab');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.controlTab;
        if (target) {
          this.setControlTab(target, true);
        }
      });
    });
  }

  setControlTab(tabKey, isAnimated = true) {
    if (this.activeControlTab === tabKey) return;

    if (sound.playTick) sound.playTick();
    this.activeControlTab = tabKey;
    this.renderControlTabPanels(tabKey, isAnimated);
  }

  renderControlTabPanels(tabKey, isAnimated = true) {
    const panels = {
      pipeline: document.getElementById('panelPipeline'),
      monitoring: document.getElementById('panelMonitoring'),
      gamification: document.getElementById('panelGamification')
    };

    const tabs = {
      pipeline: document.getElementById('tabBtnPipeline'),
      monitoring: document.getElementById('tabBtnMonitoring'),
      gamification: document.getElementById('tabBtnGamification')
    };

    Object.keys(panels).forEach(key => {
      const p = panels[key];
      const t = tabs[key];
      const isActive = key === tabKey;

      if (t) {
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      }

      if (p) {
        p.classList.toggle('is-hidden', !isActive);
        if (isActive) {
          p.style.display = 'block';
          if (isAnimated) {
            gsap.fromTo(p, 
              { opacity: 0, y: 16 }, 
              { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }
            );
          } else {
            p.style.opacity = '1';
            p.style.transform = 'none';
          }
        } else {
          p.style.display = 'none';
        }
      }
    });

    if (tabKey === 'monitoring') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    }
  }

  /* -----------------------------------------------------
     HERO STAGE: INTERACTIVE MASCOT, DIALOG & ENTER GATEWAY
     ----------------------------------------------------- */
  initHeroInteractive() {
    const mascotWrap = document.getElementById('heroMascotWrap');
    const speechText = document.getElementById('heroMascotSpeechText');
    const speechBubble = document.getElementById('heroMascotSpeechBubble');
    const btnEnter = document.getElementById('btnEnterControlCenter');
    const heroScroll = document.getElementById('heroScrollIndicator');
    const btnBack = document.getElementById('btnBackToHero');
    const tabHero = document.getElementById('tabHeroView');
    const tabControl = document.getElementById('tabControlView');
    const pilahShortcut = document.getElementById('notePilahShortcut');

    // Fun circular quotes for the mascot
    const quotes = [
      'Hai! Selamat datang di Trash 2 Cash, mari pilah sampah bersama!',
      'Setor sampah terpilah hari ini untuk mempertahankan streak harianmu!',
      'Tahukah kamu? 1 kg botol plastik bisa mencegah emisi karbon hingga 2.1 kg CO2!',
      'Trash 2 Cash siap membantumu mencatat hasil pilahan!',
      'Tekan tombol di bawah untuk langsung membuka Pusat Kontrol Sirkular!',
      'Mitra Trash 2 Cash siap menerima dan menimbang hasil pilahanmu!'
    ];
    let quoteIdx = 0;

    // Interactive Mascot Click / Tap
    if (mascotWrap) {
      mascotWrap.addEventListener('click', () => {
        if (sound.playGrab) sound.playGrab();
        quoteIdx = (quoteIdx + 1) % quotes.length;
        if (speechText) speechText.textContent = quotes[quoteIdx];

        // Snappy tactile bounce animation
        gsap.fromTo(mascotWrap, 
          { scale: 0.94, y: -6, rotate: -2 }, 
          { scale: 1, y: 0, rotate: 0, duration: 0.45, ease: 'back.out(2.5)' }
        );

        if (speechBubble) {
          gsap.fromTo(speechBubble, 
            { scale: 0.8, opacity: 0, y: 10 }, 
            { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(2)' }
          );
        }
      });
    }

    // Page Switching Triggers (Melewati Loading Lingkaran)
    if (btnEnter) {
      btnEnter.addEventListener('click', () => this.switchToView('control'));
    }
    if (heroScroll) {
      heroScroll.addEventListener('click', () => this.switchToView('control'));
    }
    if (tabControl) {
      tabControl.addEventListener('click', () => this.switchToView('control'));
    }

    if (btnBack) {
      btnBack.addEventListener('click', () => this.switchToView('hero'));
    }
    if (tabHero) {
      tabHero.addEventListener('click', () => this.switchToView('hero'));
    }

    // Smooth scroll ke Section 2 (Alur 4 Kartu Kipas & Manifesto)
    const btnScrollSteps = document.getElementById('btnScrollToSteps');
    if (btnScrollSteps) {
      btnScrollSteps.addEventListener('click', () => {
        if (sound.playTick) sound.playTick();
        const stepsSec = document.getElementById('heroStepsSection');
        if (stepsSec) {
          if (this.lenis) {
            this.lenis.scrollTo(stepsSec, { offset: -40, duration: 0.9 });
          } else {
            stepsSec.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }

    // Back to top dari Section 2 ke Hero Stage
    const btnStepsBackTop = document.getElementById('btnStepsBackToTop');
    if (btnStepsBackTop) {
      btnStepsBackTop.addEventListener('click', () => {
        if (sound.playTick) sound.playTick();
        const heroStage = document.getElementById('heroStage');
        if (heroStage) {
          if (this.lenis) {
            this.lenis.scrollTo(heroStage, { offset: 0, duration: 0.9 });
          } else {
            heroStage.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }

    // Shortcut note: berpindah ke Pusat Kontrol lalu buka Langkah 1 AI Scanner
    if (pilahShortcut) {
      pilahShortcut.addEventListener('click', () => {
        this.switchToView('control', {
          onAfter: () => {
            this.setControlTab('pipeline', false);
            const btn1 = document.getElementById('btnTriggerStep1');
            if (btn1) btn1.click();
          }
        });
      });
    }

    // Interactive notes click handler
    document.querySelectorAll('.pencil-note.interactive-note').forEach(note => {
      note.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sound.playGrab) sound.playGrab();
        const tip = note.dataset.tip;
        if (tip) {
          Toastify({
            text: tip,
            className: 'toast-eco',
            duration: 3200,
            gravity: 'bottom',
            position: 'center'
          }).showToast();

          gsap.fromTo(note, 
            { scale: 0.9, rotate: -4 }, 
            { scale: 1, rotate: 0, duration: 0.35, ease: 'back.out(2)' }
          );
        }
      });
    });

    // Live Telemetry Ticker subtle continuous heartbeat
    if (!this.tickerTimer) {
      let liveKg = 14820.4;
      let liveCuan = 66690000;
      this.tickerTimer = setInterval(() => {
        liveKg += Math.round((Math.random() * 0.4 + 0.1) * 10) / 10;
        liveCuan += Math.round(Math.random() * 2500 + 500);

        const kgEl = document.getElementById('tickerKgVal');
        const cuanEl = document.getElementById('tickerCuanVal');
        if (kgEl) kgEl.textContent = `${liveKg.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;
        if (cuanEl) cuanEl.textContent = `Rp ${liveCuan.toLocaleString('id-ID')}`;
      }, 4200);
    }

    this.initEditorialStory();
  }

  /* -----------------------------------------------------
     MONEY-IN-CHECK INSPIRED EDITORIAL STORY & SCROLL ENGINE
     ----------------------------------------------------- */
  initEditorialStory() {
    this.compassFill = document.getElementById('editorialCompassFill');
    this.compassPct = document.getElementById('editorialCompassPct');
    this.scrubWords = Array.from(document.querySelectorAll('.scrub-word'));
    this.claimOutline = document.getElementById('claimOutlineLine');
    this.claimBlock = document.getElementById('editorialClaim');
    this.manifestoTracker = document.getElementById('manifestoReadTracker');
    this.editorialPills = Array.from(document.querySelectorAll('.inline-editorial-pill'));

    this.lastLeadingWordIdx = -1;
    this.lastHapticTickTime = 0;
    this.hasPlayedClaimSparkle = false;

    const btnManifesto = document.getElementById('btnScrollToManifesto');
    if (btnManifesto) {
      btnManifesto.addEventListener('click', () => {
        if (sound.playTick) sound.playTick();
        const manifesto = document.getElementById('manifestoSection');
        if (manifesto) {
          if (this.lenis) {
            this.lenis.scrollTo(manifesto, { offset: -40, duration: 1.2 });
          } else {
            manifesto.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }

    const mouseScroll = document.querySelector('.hero-editorial-scroll');
    if (mouseScroll) {
      mouseScroll.addEventListener('click', () => {
        if (sound.playTick) sound.playTick();
        const manifesto = document.getElementById('manifestoSection');
        if (manifesto) {
          if (this.lenis) {
            this.lenis.scrollTo(manifesto, { offset: -40, duration: 1.2 });
          } else {
            manifesto.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }

    const btnGatewayControl = document.getElementById('btnGatewayControl');
    if (btnGatewayControl) {
      btnGatewayControl.addEventListener('click', () => {
        this.switchToView('control');
      });
    }

    const btnGatewayScan = document.getElementById('btnGatewayScan');
    if (btnGatewayScan) {
      btnGatewayScan.addEventListener('click', () => {
        if (sound.playGrab) sound.playGrab();
        this.setMascotSpeech('Kamera AI siap! Arahkan ke sampahmu ya...');
        const modal = document.getElementById('modalAiScanner');
        if (modal) modal.classList.remove('is-hidden');
      });
    }

    const btnFooterBackTop = document.getElementById('btnFooterBackTop');
    if (btnFooterBackTop) {
      btnFooterBackTop.addEventListener('click', () => {
        if (sound.playTick) sound.playTick();
        if (this.lenis) {
          this.lenis.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    const paradeItems = document.querySelectorAll('.parade-item');
    paradeItems.forEach((item, idx) => {
      item.addEventListener('mouseenter', () => {
        if (sound.playScrollTick) {
          sound.playScrollTick(1.1 + (idx % 6) * 0.06);
        }
      });
    });

    if (this.container) {
      this.container.addEventListener('scroll', () => {
        this.updateEditorialStory();
      }, { passive: true });
    }

    // Initial calculation
    setTimeout(() => {
      this.updateEditorialStory();
    }, 120);
  }

  updateEditorialStory() {
    if (this.currentView !== 'hero') return;

    const pageHero = document.getElementById('pageHeroView');
    if (!pageHero) return;

    const vh = window.innerHeight;
    const now = performance.now();

    // 1. Compass Update (Universal N-S Indicator on right edge)
    if (this.compassFill) {
      const rect = pageHero.getBoundingClientRect();
      const totalH = pageHero.scrollHeight - vh;
      const currentY = -rect.top;
      const progress = Math.max(0, Math.min(1, currentY / (totalH > 0 ? totalH : 1)));
      this.compassFill.style.height = `${(progress * 100).toFixed(1)}%`;
      if (this.compassPct) {
        this.compassPct.textContent = `${String(Math.round(progress * 100)).padStart(2, '0')}%`;
      }
    }

    // 2. Outlined Claim Gradient Position Fill & Sparkle
    if (this.claimOutline) {
      const claimRect = this.claimOutline.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (vh * 0.85 - claimRect.top) / (vh * 0.55)));
      const bgPos = (100 - progress * 100).toFixed(1);
      const fillSpan = this.claimOutline.querySelector('.claim-fill-text');
      if (fillSpan) {
        fillSpan.style.backgroundPosition = `${bgPos}% 0`;
      }

      if (this.claimBlock) {
        if (progress >= 0.95) {
          if (!this.claimBlock.classList.contains('is-claim-unlocked')) {
            this.claimBlock.classList.add('is-claim-unlocked');
            if (!this.hasPlayedClaimSparkle && sound.playClaimSparkle) {
              sound.playClaimSparkle();
              this.hasPlayedClaimSparkle = true;
            }
          }
        } else {
          this.claimBlock.classList.remove('is-claim-unlocked');
          if (progress < 0.7) {
            this.hasPlayedClaimSparkle = false;
          }
        }
      }
    }

    // 3. Tactile Inline Badges / Pills Reveal
    if (this.editorialPills && this.editorialPills.length > 0) {
      this.editorialPills.forEach(pill => {
        const pRect = pill.getBoundingClientRect();
        if (pRect.top < vh * 0.75) {
          pill.classList.add('is-pill-active');
        } else {
          pill.classList.remove('is-pill-active');
        }
      });
    }

    // 4. Scrub Words Reveal + Reading Horizon Spotlight + Tactile Haptic Scroll Sound
    if (this.scrubWords && this.scrubWords.length > 0) {
      let activeCount = 0;
      let currentLeadingIdx = -1;

      this.scrubWords.forEach((word, idx) => {
        const wRect = word.getBoundingClientRect();
        if (wRect.top < vh * 0.72) {
          word.classList.add('is-active-word');
          activeCount++;
          currentLeadingIdx = idx;
        } else {
          word.classList.remove('is-active-word');
          word.classList.remove('is-leading-word');
        }
      });

      // Update leading spotlight word (the one right at the reading horizon)
      this.scrubWords.forEach((word, idx) => {
        if (idx === currentLeadingIdx) {
          word.classList.add('is-leading-word');
        } else {
          word.classList.remove('is-leading-word');
        }
      });

      // Subtle tactile tick when passing across words
      if (currentLeadingIdx !== this.lastLeadingWordIdx && currentLeadingIdx !== -1) {
        if (now - this.lastHapticTickTime > 75) {
          if (sound.playScrollTick) {
            const pitch = 0.96 + (currentLeadingIdx % 6) * 0.035;
            sound.playScrollTick(pitch);
          }
          this.lastHapticTickTime = now;
        }
        this.lastLeadingWordIdx = currentLeadingIdx;
      }

      // Live reading progress readout in meta bar
      if (this.manifestoTracker) {
        const pct = Math.round((activeCount / this.scrubWords.length) * 100);
        this.manifestoTracker.textContent = `BACA: ${String(pct).padStart(2, '0')}%`;
      }
    }

    // 5. Section 2: Fan-Deck Step Progression & Card Rotation Driven by Scroll
    const stepsSection = document.getElementById('heroStepsSection');
    if (stepsSection && this.setHeroFanStepFromScroll) {
      const sRect = stepsSection.getBoundingClientRect();
      if (sRect.top < vh * 0.72 && sRect.bottom > vh * 0.20) {
        const sProg = Math.max(0, Math.min(1, (vh * 0.72 - sRect.top) / (sRect.height * 0.8)));
        const targetStep = Math.min(4, Math.max(1, Math.floor(sProg * 4) + 1));
        this.setHeroFanStepFromScroll(targetStep);
      }
    }
  }

  /* -----------------------------------------------------
     DYNAMIC MASCOT SPEECH & EXPRESSION CONTROLLER
     ----------------------------------------------------- */
  setMascotSpeech(text, emotion = 'normal') {
    const speechText = document.getElementById('heroMascotSpeechText');
    const speechBubble = document.getElementById('heroMascotSpeechBubble');
    const mascotImg = document.querySelector('.mascot-centerpiece-img');

    // Section 2 Companion Mascot elements
    const companionSpeech = document.getElementById('fandeckSpeechText');
    const companionBubble = document.getElementById('fandeckSpeechBubble');
    const companionImg = document.getElementById('fandeckCompanionImg');

    if (speechText) {
      speechText.textContent = text;
    }

    if (speechBubble && window.gsap) {
      gsap.fromTo(speechBubble, 
        { scale: 0.88, y: 8, opacity: 0.7 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(2)' }
      );
    }

    if (companionSpeech) {
      companionSpeech.textContent = text;
    }

    if (companionBubble && window.gsap) {
      gsap.fromTo(companionBubble, 
        { scale: 0.92, opacity: 0.7 }, 
        { scale: 1, opacity: 1, duration: 0.28, ease: 'back.out(2)' }
      );
    }

    if (emotion === 'celebrate') {
      if (mascotImg && window.gsap) {
        gsap.fromTo(mascotImg, 
          { rotate: -8, scale: 1.08 }, 
          { rotate: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }
        );
      }
      if (companionImg && window.gsap) {
        gsap.fromTo(companionImg, 
          { rotate: -8, scale: 1.1 }, 
          { rotate: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }
        );
      }
    }
  }

  /* -----------------------------------------------------
     HERO FAN-DECK STEPPER 4-LANGKAH (INTERAKTIF & SEKUENSIAL)
     ----------------------------------------------------- */
  initHeroFanDeckStepper() {
    this.heroFanActiveStep = 1;
    this.heroFanUnlocked = [true, false, false, false];
    this.heroFanDone = [false, false, false, false];

    const cards = [
      document.getElementById('heroFanCard1'),
      document.getElementById('heroFanCard2'),
      document.getElementById('heroFanCard3'),
      document.getElementById('heroFanCard4')
    ];

    const badges = [
      document.getElementById('fcardBadge1'),
      document.getElementById('fcardBadge2'),
      document.getElementById('fcardBadge3'),
      document.getElementById('fcardBadge4')
    ];

    const indicator = document.getElementById('fandeckActiveIndicator');
    const stepDots = [
      document.getElementById('fstepDot1'),
      document.getElementById('fstepDot2'),
      document.getElementById('fstepDot3'),
      document.getElementById('fstepDot4')
    ];
    const stepLines = [
      document.getElementById('fstepLine1'),
      document.getElementById('fstepLine2'),
      document.getElementById('fstepLine3')
    ];

    const companionImg = document.getElementById('fandeckCompanionImg');
    const companionSpeech = document.getElementById('fandeckSpeechText');
    const companionTag = document.getElementById('fandeckSpeechStepTag');
    const companionBubble = document.getElementById('fandeckSpeechBubble');
    const companionAvatar = document.getElementById('fandeckCompanionAvatar');

    const stepMascotInfo = {
      1: {
        tag: '✦ LANGKAH 1 • PILAH & SCAN',
        speech: 'Sampah terpilah terdeteksi! Siap lanjut ambil tiket?',
        img: '/assets/mascot/card-mascot-1.png'
      },
      2: {
        tag: '✦ LANGKAH 2 • TIKET SETOR QR',
        speech: 'Tiket QR resmi siap! Bawa ke Drop Point Hub Mitra terdekat ya!',
        img: '/assets/mascot/card-mascot-2.png'
      },
      3: {
        tag: '✦ LANGKAH 3 • VALIDASI TIMBANGAN',
        speech: 'Timbangan IoT membaca 2.40 kg akurat! Verifikasi ledger sukses!',
        img: '/assets/mascot/card-mascot-3.png'
      },
      4: {
        tag: '✦ LANGKAH 4 • KLAIM SALDO & DUIT',
        speech: 'Hore! Saldo Rp 148.500 langsung cair & streak 6 hari berturut-turut!',
        img: '/assets/mascot/card-mascot-4.png'
      }
    };

    const updateCompanionMascot = (stepNum, customSpeech = null, emotion = 'normal') => {
      const info = stepMascotInfo[stepNum] || stepMascotInfo[1];
      if (companionImg) {
        if (!companionImg.src.endsWith(info.img)) {
          companionImg.src = info.img;
        }
        if (window.gsap) {
          gsap.fromTo(companionImg,
            { scale: 0.9, rotate: emotion === 'celebrate' ? -8 : -3 },
            { scale: 1, rotate: 0, duration: 0.35, ease: 'back.out(2)' }
          );
        }
      }
      if (companionTag) {
        companionTag.textContent = info.tag;
      }
      if (companionSpeech) {
        companionSpeech.textContent = customSpeech || info.speech;
      }
      if (companionBubble && window.gsap) {
        gsap.fromTo(companionBubble,
          { scale: 0.92, opacity: 0.7 },
          { scale: 1, opacity: 1, duration: 0.28, ease: 'back.out(2)' }
        );
      }
    };

    const updateStepperUI = () => {
      cards.forEach((card, idx) => {
        if (!card) return;
        const isActive = (idx + 1) === this.heroFanActiveStep;
        card.classList.toggle('is-active', isActive);

        const isUnlocked = this.heroFanUnlocked[idx];
        card.classList.toggle('is-locked', !isUnlocked);

        if (badges[idx]) {
          if (this.heroFanDone[idx]) {
            badges[idx].textContent = `0${idx + 1} • SELESAI ✓`;
            badges[idx].className = 'fcard-badge badge-done';
          } else if (isUnlocked) {
            const labels = ['SIAP SCAN', 'TIKET QR', 'TIMBANGAN', 'KLAIM CUAN'];
            badges[idx].textContent = labels[idx];
            badges[idx].className = isActive ? 'fcard-badge badge-active' : 'fcard-badge badge-unlocked';
          } else {
            badges[idx].textContent = 'TERKUNCI';
            badges[idx].className = 'fcard-badge badge-locked';
          }
        }

        if (stepDots[idx]) {
          stepDots[idx].classList.toggle('current', isActive);
          stepDots[idx].classList.toggle('done', this.heroFanDone[idx]);
        }
      });

      stepLines.forEach((line, idx) => {
        if (line) {
          line.classList.toggle('done', this.heroFanDone[idx]);
        }
      });

      const stepNames = [
        'Langkah 1 dari 4: Scan Sampahmu Dulu',
        'Langkah 2 dari 4: Ambil Tiket QR',
        'Langkah 3 dari 4: Validasi Timbangan',
        'Langkah 4 dari 4: Cairkan Saldo & Cuan!'
      ];
      if (indicator) {
        indicator.textContent = stepNames[this.heroFanActiveStep - 1] || 'Semua Langkah Selesai!';
      }

      updateCompanionMascot(this.heroFanActiveStep);
    };

    this.setHeroFanStepFromScroll = (stepNum) => {
      if (this.heroFanActiveStep === stepNum) return;
      this.heroFanActiveStep = stepNum;
      for (let i = 0; i < stepNum; i++) {
        this.heroFanUnlocked[i] = true;
      }
      updateStepperUI();
      if (sound.playScrollTick) {
        sound.playScrollTick(1.0 + stepNum * 0.08);
      }
    };

    // Hover listeners to preview each card's mascot
    cards.forEach((card, idx) => {
      if (!card) return;
      const stepNum = idx + 1;
      card.addEventListener('mouseenter', () => {
        updateCompanionMascot(stepNum);
      });
      card.addEventListener('mouseleave', () => {
        updateCompanionMascot(this.heroFanActiveStep);
      });
    });

    if (companionAvatar) {
      companionAvatar.addEventListener('click', () => {
        if (sound.playGrab) sound.playGrab();
        const activeInfo = stepMascotInfo[this.heroFanActiveStep] || stepMascotInfo[1];
        updateCompanionMascot(this.heroFanActiveStep, activeInfo.speech, 'celebrate');
      });
    }

    // Helper: locked card rejection feedback
    const rejectLockedCard = (stepNum) => {
      if (sound.playGrab) sound.playGrab();
      const card = cards[stepNum - 1];
      if (card) {
        card.classList.remove('shake-locked');
        void card.offsetWidth;
        card.classList.add('shake-locked');
      }

      const deniedQuotes = [
        'Eits, jangan buru-buru! Selesaikan dulu Scan AI di Langkah 1 ya biar cuannya sah.',
        'Eits, jangan buru-buru! Ambil dulu Tiket Setor QR di Langkah 2 ya.',
        'Eits, belum bisa cair nih! Timbang dulu sampahmu di Langkah 3 ya.'
      ];
      const quote = deniedQuotes[stepNum - 2] || 'Eits, selesaikan langkah sebelumnya dulu ya!';
      this.setMascotSpeech(quote);

      Toastify({
        text: `Langkah ${stepNum} masih terkunci! Selesaikan Langkah ${stepNum - 1} terlebih dahulu.`,
        className: 'toast-warning',
        duration: 3200,
        gravity: 'top',
        position: 'center'
      }).showToast();
    };

    // -------------------------------------------------
    // STEP 1: PILAH & SCAN AI
    // -------------------------------------------------
    const triggerStep1 = () => {
      if (sound.playGrab) sound.playGrab();
      this.setMascotSpeech('Kamera AI siap! Arahkan ke sampahmu ya...');
      const modal = document.getElementById('modalAiScanner');
      if (modal) {
        modal.classList.remove('is-hidden');
      }
    };

    const btnCloseScanner = document.getElementById('btnCloseScannerModal');
    if (btnCloseScanner) {
      btnCloseScanner.addEventListener('click', () => {
        const modal = document.getElementById('modalAiScanner');
        if (modal) modal.classList.add('is-hidden');
      });
    }

    const btnRescan = document.getElementById('btnRescanModal');
    if (btnRescan) {
      btnRescan.addEventListener('click', () => {
        if (sound.playGrab) sound.playGrab();
        this.scanIndex = (this.scanIndex + 1) % this.scanItems.length;
        const item = this.scanItems[this.scanIndex];
        const img = document.getElementById('modalScannerImg');
        const lbl = document.getElementById('modalScannerBboxLabel');
        const hint = document.getElementById('modalScannerHintText');
        if (img) img.src = item.img;
        if (lbl) lbl.textContent = `${item.name} • ${item.confidence}`;
        if (hint) hint.textContent = `${item.name.replace(/_/g, ' ')} terdeteksi! Akurasi ${item.confidence}. Siap diubah jadi tiket cuan.`;
      });
    }

    const btnConfirmScan = document.getElementById('btnConfirmScanAndUnlockStep2');
    if (btnConfirmScan) {
      btnConfirmScan.addEventListener('click', () => {
        const modal = document.getElementById('modalAiScanner');
        if (modal) modal.classList.add('is-hidden');

        // Mark Step 1 Done
        this.heroFanDone[0] = true;
        if (badges[0]) {
          badges[0].textContent = '01 • SELESAI ✓';
          badges[0].className = 'fcard-badge badge-done';
        }

        // Unlock Step 2
        this.heroFanUnlocked[1] = true;
        this.heroFanActiveStep = 2;
        if (badges[1]) {
          badges[1].textContent = 'SIAP TIKET';
          badges[1].className = 'fcard-badge badge-active';
        }

        if (cards[1]) {
          cards[1].classList.remove('is-locked');
          cards[1].classList.add('unlock-pop');
        }

        updateStepperUI();
        if (sound.playComplete) sound.playComplete();
        this.setMascotSpeech('Wah keren! Botol plastik bersih terdeteksi. Langkah 1 selesai, Tiket QR kamu sekarang terbuka!', 'celebrate');

        Toastify({
          text: 'Langkah 1 Selesai! Tiket QR (Langkah 2) kini TERBUKA!',
          className: 'toast-success',
          duration: 3500,
          gravity: 'top',
          position: 'center'
        }).showToast();

        // Buka langsung langkah berikutnya dengan transisi loader
        setTimeout(() => triggerStep2(), 400);
      });
    }

    // -------------------------------------------------
    // STEP 2: TIKET SETOR QR
    // -------------------------------------------------
    const triggerStep2 = () => {
      if (!this.heroFanUnlocked[1]) {
        rejectLockedCard(2);
        return;
      }

      if (sound.playGrab) sound.playGrab();
      this.setMascotSpeech('Ini dia tiket barcode setor kamu! Bawa ke Drop Point Hub Mitra terdekat ya.');
      const modal = document.getElementById('modalQrTicket');
      const ticketMat = document.getElementById('ticketMaterialText');
      const ticketCuan = document.getElementById('ticketPotentialCuan');
      const current = this.scanItems[this.scanIndex] || this.scanItems[0];
      const added = Math.round(this.currentWeight * this.currentScrapRate);
      const pts = Math.round(this.currentWeight * 20);

      if (ticketMat) ticketMat.textContent = `${current.name.replace(/_/g, ' ')} (${this.currentWeight} kg)`;
      if (ticketCuan) ticketCuan.textContent = `Rp ${added.toLocaleString('id-ID')} (+${pts} Pts)`;

      if (modal) modal.classList.remove('is-hidden');
    };

    const btnGoToScale = document.getElementById('btnGoToScaleSim');
    if (btnGoToScale) {
      btnGoToScale.addEventListener('click', () => {
        const modal = document.getElementById('modalQrTicket');
        if (modal) modal.classList.add('is-hidden');

        // Mark Step 2 Done
        this.heroFanDone[1] = true;
        if (badges[1]) {
          badges[1].textContent = '02 • SELESAI ✓';
          badges[1].className = 'fcard-badge badge-done';
        }

        // Unlock Step 3
        this.heroFanUnlocked[2] = true;
        this.heroFanActiveStep = 3;
        if (badges[2]) {
          badges[2].textContent = 'SIAP TIMBANG';
          badges[2].className = 'fcard-badge badge-active';
        }

        if (cards[2]) {
          cards[2].classList.remove('is-locked');
          cards[2].classList.add('unlock-pop');
        }

        updateStepperUI();
        if (sound.playComplete) sound.playComplete();
        this.setMascotSpeech('Tiket tersimpan! Sekarang saatnya verifikasi timbangan di Langkah 3.', 'celebrate');

        Toastify({
          text: 'Tiket QR Terverifikasi! Timbangan Digital IoT (Langkah 3) kini TERBUKA!',
          className: 'toast-success',
          duration: 3500,
          gravity: 'top',
          position: 'center'
        }).showToast();

        // Buka langsung timbangan dengan transisi loader
        setTimeout(() => triggerStep3(), 400);
      });
    }

    // -------------------------------------------------
    // STEP 3: VALIDASI TIMBANGAN IoT
    // -------------------------------------------------
    const triggerStep3 = () => {
      if (!this.heroFanUnlocked[2]) {
        rejectLockedCard(3);
        return;
      }

      if (sound.playGrab) sound.playGrab();
      this.setMascotSpeech('Timbangan IoT mendeteksi 2.40 kg! Estimasi saldo Rp 15.000 sudah siap dicairkan.');
      const modal = document.getElementById('modalIotScale');
      if (modal) {
        modal.classList.remove('is-hidden');
        const digits = document.getElementById('scaleDisplayDigits');
        if (digits) {
          gsap.fromTo(digits, { textContent: '00.00' }, { textContent: '02.40', snap: { textContent: 0.1 }, duration: 0.8, ease: 'power2.out' });
        }
      }
    };

    const btnConfirmScale = document.getElementById('btnConfirmScaleAndUnlockStep4');
    if (btnConfirmScale) {
      btnConfirmScale.addEventListener('click', () => {
        const modal = document.getElementById('modalIotScale');
        if (modal) modal.classList.add('is-hidden');

        // Mark Step 3 Done
        this.heroFanDone[2] = true;
        if (badges[2]) {
          badges[2].textContent = '03 • SELESAI ✓';
          badges[2].className = 'fcard-badge badge-done';
        }

        // Unlock Step 4
        this.heroFanUnlocked[3] = true;
        this.heroFanActiveStep = 4;
        if (badges[3]) {
          badges[3].textContent = 'SIAP CAIRKAN';
          badges[3].className = 'fcard-badge badge-active';
        }

        if (cards[3]) {
          cards[3].classList.remove('is-locked');
          cards[3].classList.add('unlock-pop');
        }

        updateStepperUI();
        if (sound.playComplete) sound.playComplete();
        this.setMascotSpeech('Validasi sukses tercatat di ledger! Kartu penarikan saldo reward sudah terbuka!', 'celebrate');

        Toastify({
          text: 'Timbangan Tervalidasi! Penarikan Saldo & Bonus Streak (Langkah 4) kini TERBUKA!',
          className: 'toast-success',
          duration: 3500,
          gravity: 'top',
          position: 'center'
        }).showToast();

        // Buka langsung penarikan dengan transisi loader
        setTimeout(() => triggerStep4(), 400);
      });
    }

    // -------------------------------------------------
    // STEP 4: KLAIM SALDO & DUIT
    // -------------------------------------------------
    const triggerStep4 = () => {
      if (!this.heroFanUnlocked[3]) {
        rejectLockedCard(4);
        return;
      }

      if (sound.playGrab) sound.playGrab();
      this.setMascotSpeech('Pilih nominal pencairanmu ke rekening atau e-wallet sekarang.');
      const modalWithdraw = document.getElementById('modalWithdraw');
      const curBal = document.getElementById('modalCurrentBalVal');
      if (curBal) {
        curBal.textContent = `Rp ${this.currentBalance.toLocaleString('id-ID')}`;
      }
      if (modalWithdraw) {
        modalWithdraw.classList.remove('is-hidden');
      }
    };

    // Bind click events on cards & buttons
    if (cards[0]) cards[0].addEventListener('click', () => triggerStep1());
    if (cards[1]) cards[1].addEventListener('click', () => triggerStep2());
    if (cards[2]) cards[2].addEventListener('click', () => triggerStep3());
    if (cards[3]) cards[3].addEventListener('click', () => triggerStep4());

    const btnFanAction1 = document.getElementById('btnFanAction1');
    const btnFanAction2 = document.getElementById('btnFanAction2');
    const btnFanAction3 = document.getElementById('btnFanAction3');
    const btnFanAction4 = document.getElementById('btnFanAction4');

    if (btnFanAction1) btnFanAction1.addEventListener('click', (e) => { e.stopPropagation(); triggerStep1(); });
    if (btnFanAction2) btnFanAction2.addEventListener('click', (e) => { e.stopPropagation(); triggerStep2(); });
    if (btnFanAction3) btnFanAction3.addEventListener('click', (e) => { e.stopPropagation(); triggerStep3(); });
    if (btnFanAction4) btnFanAction4.addEventListener('click', (e) => { e.stopPropagation(); triggerStep4(); });

    // Keyboard support on cards
    cards.forEach((card, idx) => {
      if (!card) return;
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (idx === 0) triggerStep1();
          else if (idx === 1) triggerStep2();
          else if (idx === 2) triggerStep3();
          else if (idx === 3) triggerStep4();
        }
      });
    });

    // Form withdraw submission listener
    const withdrawForm = document.getElementById('withdrawForm');
    if (withdrawForm) {
      withdrawForm.addEventListener('submit', () => {
        this.heroFanDone[3] = true;
        if (badges[3]) {
          badges[3].textContent = '04 • SELESAI ✓';
          badges[3].className = 'fcard-badge badge-done';
        }
        updateStepperUI();
        this.setMascotSpeech('Berhasil! Saldo Rp 15.000 cair instan ke dompetmu dan streak-mu sekarang 6 hari berturut-turut!', 'celebrate');
      });
    }

    updateStepperUI();
  }
}


