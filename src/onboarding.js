/**
 * Onboarding Controller for Trash2Cash (TTC)
 * Interactive Stacked Card Deck (Tumpukan Kartu Fisik dengan Bayangan Blur & Geser Interaktif).
 * 
 * Features:
 * - Physical stacked card layers: Active card on top, subsequent card blurred & scaled down behind.
 * - Fluid pointer drag-and-throw gesture with rotational physics & dynamic unblurring.
 * - Programmatic slide controls ("Geser Kartu", "Next", "Kembali", "Lewati").
 * - Segmented stepper progress bar (1/3 -> 2/3 -> 3/3).
 */

import gsap from 'gsap';
import { sound } from './sound.js';
import {
  createIcons,
  ArrowRight,
  ArrowLeft,
  Camera,
  Truck,
  Coins,
  ShieldCheck,
  Flame,
  Award,
  Sparkles
} from 'lucide';

export class OnboardingController {
  constructor(options = {}) {
    this.container = document.getElementById('onboardingScreen');
    this.onComplete = options.onComplete || (() => {});
    this.currentStep = 0;
    this.totalSteps = 3;
    this.isAnimating = false;

    // Gesture State
    this.isDragging = false;
    this.activePointerId = null;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.startTime = 0;

    this.cardIds = ['stackCard0', 'stackCard1', 'stackCard2'];

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    if (!this.container) return;
    this.renderIcons();
    this.resetStack(false);
  }

  renderIcons() {
    createIcons({
      icons: {
        ArrowRight,
        ArrowLeft,
        Camera,
        Truck,
        Coins,
        ShieldCheck,
        Flame,
        Award,
        Sparkles
      }
    });
  }

  mount() {
    if (!this.container) return;
    this.container.classList.remove('is-hidden');
    this.container.style.display = 'flex';
    this.currentStep = 0;
    this.resetStack(true);
    this.renderIcons();

    // Subtle device card entrance
    gsap.fromTo('.onboarding-device-card',
      { opacity: 0, y: 30, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' }
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

  resetStack(animated = false) {
    this.cardIds.forEach((id, idx) => {
      const card = document.getElementById(id);
      if (!card) return;

      // Clean classes
      card.classList.remove('card-active', 'card-next', 'card-deep', 'card-discarded');

      let targetProps = {};
      if (idx === 0) {
        card.classList.add('card-active');
        targetProps = {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          zIndex: 30
        };
      } else if (idx === 1) {
        card.classList.add('card-next');
        targetProps = {
          x: 0,
          y: 18,
          rotation: 2,
          scale: 0.93,
          opacity: 0.8,
          filter: 'blur(3.5px)',
          zIndex: 20
        };
      } else {
        card.classList.add('card-deep');
        targetProps = {
          x: 0,
          y: 34,
          rotation: -2.5,
          scale: 0.86,
          opacity: 0.45,
          filter: 'blur(6.5px)',
          zIndex: 10
        };
      }

      if (animated) {
        gsap.to(card, { ...targetProps, duration: 0.45, ease: 'back.out(1.5)' });
      } else {
        gsap.set(card, targetProps);
      }
    });

    this.currentStep = 0;
    this.updateProgressUI();
  }

  bindEvents() {
    if (!this.container) return;

    // Attach pointer drag gestures to all cards
    this.cardIds.forEach((id, idx) => {
      const card = document.getElementById(id);
      if (!card) return;

      card.addEventListener('pointerdown', (e) => this.handlePointerDown(e, idx));
      card.addEventListener('pointermove', (e) => this.handlePointerMove(e, idx));
      card.addEventListener('pointerup', (e) => this.handlePointerUp(e, idx));
      card.addEventListener('pointercancel', (e) => this.handlePointerUp(e, idx));
    });

    // Programmatic Next / Slide button
    const nextBtn = document.getElementById('onboardNextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.slideCurrentCard(1);
      });
    }

    const topNextBtn = document.getElementById('onboardTopNextBtn');
    if (topNextBtn) {
      topNextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.slideCurrentCard(1);
      });
    }

    // Prev / Back button (pull discarded card back)
    const prevBtn = document.getElementById('onboardPrevBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.pullPreviousCard();
      });
    }

    // Skip all button
    const skipBtn = document.getElementById('onboardSkipBtn');
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.finishOnboarding();
      });
    }

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      if (this.container.classList.contains('is-hidden')) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        this.slideCurrentCard(1);
      } else if (e.key === 'ArrowLeft') {
        this.pullPreviousCard();
      }
    });
  }

  /* -----------------------------------------------------
     DRAG & SWIPE PHYSICS
     ----------------------------------------------------- */
  handlePointerDown(e, cardIndex) {
    if (this.isAnimating || cardIndex !== this.currentStep) return;

    const card = document.getElementById(this.cardIds[cardIndex]);
    if (!card) return;

    this.isDragging = true;
    this.activePointerId = e.pointerId;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.currentX = e.clientX;
    this.currentY = e.clientY;
    this.startTime = performance.now();

    try {
      card.setPointerCapture(e.pointerId);
    } catch (err) {}

    gsap.killTweensOf(card);
    card.classList.add('is-dragging');
  }

  handlePointerMove(e, cardIndex) {
    if (!this.isDragging || e.pointerId !== this.activePointerId || cardIndex !== this.currentStep) return;

    this.currentX = e.clientX;
    this.currentY = e.clientY;
    const dx = this.currentX - this.startX;
    const dy = this.currentY - this.startY;

    const card = document.getElementById(this.cardIds[cardIndex]);
    if (!card) return;

    const rot = dx * 0.08;
    gsap.set(card, {
      x: dx,
      y: dy * 0.35,
      rotation: rot,
      cursor: 'grabbing'
    });

    // Interpolate next card behind
    const nextIndex = this.currentStep + 1;
    if (nextIndex < this.totalSteps) {
      const nextCard = document.getElementById(this.cardIds[nextIndex]);
      if (nextCard) {
        const progress = Math.min(1, Math.abs(dx) / 160);
        gsap.set(nextCard, {
          scale: 0.93 + 0.07 * progress,
          y: 18 - 18 * progress,
          rotation: 2 - 2 * progress,
          opacity: 0.8 + 0.2 * progress,
          filter: `blur(${3.5 * (1 - progress)}px)`
        });
      }
    }
  }

  handlePointerUp(e, cardIndex) {
    if (!this.isDragging || e.pointerId !== this.activePointerId || cardIndex !== this.currentStep) return;
    this.isDragging = false;

    const card = document.getElementById(this.cardIds[cardIndex]);
    if (!card) return;

    try {
      card.releasePointerCapture(e.pointerId);
    } catch (err) {}
    card.classList.remove('is-dragging');

    const dx = this.currentX - this.startX;
    const dt = Math.max(1, performance.now() - this.startTime);
    const velocityX = Math.abs(dx) / dt;

    // Swipe threshold
    const isSwiped = Math.abs(dx) > 75 || (Math.abs(dx) > 35 && velocityX > 0.45);

    if (isSwiped) {
      const dir = dx >= 0 ? 1 : -1;
      this.slideCardOut(cardIndex, dir);
    } else {
      this.snapCardBack(cardIndex);
    }
  }

  snapCardBack(cardIndex) {
    const card = document.getElementById(this.cardIds[cardIndex]);
    if (!card) return;

    gsap.to(card, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 0.45,
      ease: 'back.out(2)'
    });

    const nextIndex = cardIndex + 1;
    if (nextIndex < this.totalSteps) {
      const nextCard = document.getElementById(this.cardIds[nextIndex]);
      if (nextCard) {
        gsap.to(nextCard, {
          scale: 0.93,
          y: 18,
          rotation: 2,
          opacity: 0.8,
          filter: 'blur(3.5px)',
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    }
  }

  slideCurrentCard(direction = 1) {
    if (this.isAnimating) return;
    this.slideCardOut(this.currentStep, direction);
  }

  slideCardOut(cardIndex, direction = 1) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const card = document.getElementById(this.cardIds[cardIndex]);
    if (!card) {
      this.isAnimating = false;
      return;
    }

    if (sound.playGrab) sound.playGrab();

    const targetX = direction * (window.innerWidth < 600 ? 480 : 620);
    const targetRot = direction * 28;

    // Animate top card off screen
    gsap.to(card, {
      x: targetX,
      rotation: targetRot,
      opacity: 0,
      duration: 0.38,
      ease: 'power2.in',
      onComplete: () => {
        card.classList.remove('card-active');
        card.classList.add('card-discarded');
        card.style.zIndex = '5';

        this.currentStep++;

        if (this.currentStep >= this.totalSteps) {
          this.isAnimating = false;
          this.finishOnboarding();
        } else {
          this.promoteNextCards();
          this.updateProgressUI();
          this.isAnimating = false;
        }
      }
    });

    // Promote the card right behind it to the active spot
    const nextIndex = cardIndex + 1;
    if (nextIndex < this.totalSteps) {
      const nextCard = document.getElementById(this.cardIds[nextIndex]);
      if (nextCard) {
        gsap.to(nextCard, {
          scale: 1,
          y: 0,
          rotation: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    }

    // Promote the 3rd card to layer 2
    const deepIndex = cardIndex + 2;
    if (deepIndex < this.totalSteps) {
      const deepCard = document.getElementById(this.cardIds[deepIndex]);
      if (deepCard) {
        gsap.to(deepCard, {
          scale: 0.93,
          y: 18,
          rotation: 2,
          opacity: 0.8,
          filter: 'blur(3.5px)',
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    }
  }

  promoteNextCards() {
    this.cardIds.forEach((id, idx) => {
      const card = document.getElementById(id);
      if (!card) return;

      if (idx === this.currentStep) {
        card.classList.remove('card-next', 'card-deep', 'card-discarded');
        card.classList.add('card-active');
        card.style.zIndex = '30';
      } else if (idx === this.currentStep + 1) {
        card.classList.remove('card-active', 'card-deep', 'card-discarded');
        card.classList.add('card-next');
        card.style.zIndex = '20';
      } else if (idx > this.currentStep + 1) {
        card.classList.remove('card-active', 'card-next', 'card-discarded');
        card.classList.add('card-deep');
        card.style.zIndex = '10';
      }
    });
  }

  pullPreviousCard() {
    if (this.isAnimating || this.currentStep <= 0) return;
    this.isAnimating = true;

    this.currentStep--;
    const prevCard = document.getElementById(this.cardIds[this.currentStep]);
    if (!prevCard) {
      this.isAnimating = false;
      return;
    }

    if (sound.playGrab) sound.playGrab();

    prevCard.classList.remove('card-discarded');
    prevCard.classList.add('card-active');
    prevCard.style.zIndex = '35';

    // Set starting point from off-screen
    gsap.set(prevCard, {
      x: -450,
      y: 0,
      rotation: -25,
      opacity: 0.2
    });

    // Pull back onto stack
    gsap.to(prevCard, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.42,
      ease: 'back.out(1.5)',
      onComplete: () => {
        this.promoteNextCards();
        this.updateProgressUI();
        this.isAnimating = false;
      }
    });

    // Demote current card to layer 2
    const currentCard = document.getElementById(this.cardIds[this.currentStep + 1]);
    if (currentCard) {
      gsap.to(currentCard, {
        scale: 0.93,
        y: 18,
        rotation: 2,
        opacity: 0.8,
        filter: 'blur(3.5px)',
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }

  updateProgressUI() {
    // 1. Stepper Segments
    const segments = document.querySelectorAll('.stepper-segment');
    segments.forEach((seg, idx) => {
      const fill = seg.querySelector('.stepper-fill');
      if (idx < this.currentStep) {
        seg.classList.add('completed');
        seg.classList.remove('active');
        if (fill) fill.style.width = '100%';
      } else if (idx === this.currentStep) {
        seg.classList.add('active');
        seg.classList.remove('completed');
        if (fill) fill.style.width = '100%';
      } else {
        seg.classList.remove('active', 'completed');
        if (fill) fill.style.width = '0%';
      }
    });

    // 2. Step Counter & Button Labels
    const stepCountEl = document.getElementById('onboardStepCounter');
    const nextBtnText = document.getElementById('onboardNextBtnText');
    const prevBtn = document.getElementById('onboardPrevBtn');

    if (stepCountEl) {
      stepCountEl.textContent = `${Math.min(this.totalSteps, this.currentStep + 1)} / ${this.totalSteps}`;
    }

    if (nextBtnText) {
      if (this.currentStep === 0) {
        nextBtnText.textContent = 'Geser ke Logistik →';
      } else if (this.currentStep === 1) {
        nextBtnText.textContent = 'Geser ke Cuan & Poin →';
      } else {
        nextBtnText.textContent = 'Geser Masuk ke Akun ✦';
      }
    }

    if (prevBtn) {
      if (this.currentStep === 0) {
        prevBtn.style.visibility = 'hidden';
        prevBtn.style.opacity = '0';
      } else {
        prevBtn.style.visibility = 'visible';
        prevBtn.style.opacity = '1';
      }
    }

    // 3. Dots
    const dots = document.querySelectorAll('.onboard-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentStep);
    });
  }

  finishOnboarding() {
    if (sound.playComplete) sound.playComplete();
    this.unmount();
    this.onComplete();
  }
}
