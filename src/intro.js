/**
 * Interactive Intro Controller for EcoPilah
 * Direct 1:1 tactile interaction inspired by previouslyinstalled.com and krackerz.com design language.
 * High-plane floor layout, realistic drop chute aperture, pointer capture, and flawless z-index layering.
 */

import { TRASH_ITEMS } from './trash-data.js';
import { sound } from './sound.js';

export class IntroController {
  constructor(options = {}) {
    this.onComplete = options.onComplete || (() => { });
    this.container = document.getElementById('introScreen');
    this.binContainer = document.getElementById('binContainer');
    this.binBack = document.getElementById('binBack');
    this.binFront = document.getElementById('binFront');
    this.binDropChute = document.getElementById('binDropChute');
    this.binApertureTarget = document.getElementById('binApertureTarget');
    this.tooltip = document.getElementById('binTooltip');
    this.tooltipText = document.getElementById('binTooltipText');
    this.bgText = document.getElementById('bgDisplayText');
    this.trashPile = document.getElementById('trashPile');
    this.liveAnnouncer = document.getElementById('liveAnnouncer');

    this.activePointerId = null;
    this.draggedElement = null;
    this.draggedData = null;
    this.dragOffset = { x: 0, y: 0 };
    this.isNearBin = false;
    this.isDropping = false;
    this.selectedKeyboardItem = null;

    // Cache computed positions
    this.itemPositions = new Map();

    this.init();
  }

  init() {
    this.renderTrashPile();
    this.positionAllItems();
    this.bindEvents();
  }

  calculateFloorMetrics() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w <= 680;
    const isTablet = w > 680 && w <= 1024;

    // Spread scaling factor: responsive across viewports
    let floorSpread;
    let floorCenterY;

    if (isMobile) {
      floorSpread = Math.min(130, Math.max(75, w * 0.28));
      floorCenterY = Math.max(300, Math.min(h * 0.62, h - 170));
    } else if (isTablet) {
      floorSpread = Math.min(240, Math.max(150, w * 0.22));
      floorCenterY = Math.max(340, Math.min(h * 0.58, h - 220));
    } else {
      floorSpread = Math.min(360, Math.max(220, w * 0.22));
      floorCenterY = Math.max(340, Math.min(h * 0.56, h - 250));
    }

    const floorCenterX = w / 2;

    return { floorSpread, floorCenterX, floorCenterY };
  }

  renderTrashPile() {
    this.trashPile.innerHTML = '';
    if (this.binDropChute) {
      this.binDropChute.innerHTML = '';
    }

    TRASH_ITEMS.forEach((item) => {
      const el = document.createElement('div');
      el.className = 'trash-item';
      el.id = `trash-${item.id}`;
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `${item.name}. Tekan Spasi atau Enter untuk mengambil.`);
      el.setAttribute('data-id', item.id);

      el.dataset.rot = item.initialRotation;
      el.dataset.zIndex = item.zIndex;
      el.dataset.scale = item.scale || 1.0;
      el.style.zIndex = item.zIndex;

      el.innerHTML = `
        <div class="trash-inner">
          <img 
            src="${item.image}" 
            alt="${item.name}" 
            class="trash-img" 
            draggable="false"
            loading="eager"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div class="trash-svg-fallback" style="display:none;">
            <span class="fallback-tag">${item.shortName}</span>
          </div>
          <div class="trash-shadow"></div>
          <div class="trash-category-badge" style="border-color: #161616">
            <span class="badge-dot" style="background: ${item.categoryColor}"></span>
            ${item.category.split('(')[0].trim()}
          </div>
        </div>
      `;

      this.trashPile.appendChild(el);
    });
  }

  positionAllItems() {
    const { floorSpread, floorCenterX, floorCenterY } = this.calculateFloorMetrics();

    TRASH_ITEMS.forEach((item) => {
      const el = document.getElementById(`trash-${item.id}`);
      if (!el || el === this.draggedElement || el.parentElement === this.binDropChute) return;

      const posX = floorCenterX + item.floorX * floorSpread;
      const posY = floorCenterY + item.floorY * floorSpread;
      const rot = item.initialRotation;
      const scale = item.scale || 1.0;

      this.itemPositions.set(item.id, { x: posX, y: posY, rot, scale });

      el.style.left = `${posX}px`;
      el.style.top = `${posY}px`;
      el.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`;
      el.style.opacity = '1';
    });
  }

  bindEvents() {
    this.trashPile.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    window.addEventListener('pointermove', (e) => this.handlePointerMove(e), { passive: false });
    window.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    window.addEventListener('pointercancel', (e) => this.handlePointerUp(e));

    this.trashPile.addEventListener('keydown', (e) => this.handleKeyboardItem(e));
    if (this.binContainer) {
      this.binContainer.addEventListener('keydown', (e) => this.handleKeyboardBin(e));
    }

    const skipBtn = document.getElementById('skipIntroBtn');
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sound.playGrab();
        this.completeIntro(null, true);
      });
    }

    window.addEventListener('resize', () => {
      if (!this.draggedElement && !this.isDropping) {
        this.positionAllItems();
      }
    });
  }

  announce(message) {
    if (this.liveAnnouncer) {
      this.liveAnnouncer.textContent = message;
    }
  }

  handlePointerDown(e) {
    if (this.isDropping) return;
    const itemEl = e.target.closest('.trash-item');
    if (!itemEl) return;

    e.preventDefault();
    sound.ensureContext();

    this.activePointerId = e.pointerId;
    itemEl.setPointerCapture(e.pointerId);

    const itemId = itemEl.getAttribute('data-id');
    this.draggedData = TRASH_ITEMS.find((it) => it.id === itemId);
    this.draggedElement = itemEl;

    const rect = itemEl.getBoundingClientRect();
    const itemCenterX = rect.left + rect.width / 2;
    const itemCenterY = rect.top + rect.height / 2;

    this.dragOffset = {
      x: e.clientX - itemCenterX,
      y: e.clientY - itemCenterY
    };

    // Elevation above EVERYTHING while dragging
    itemEl.classList.add('is-dragging');
    itemEl.style.zIndex = '9999';

    // Fade out initial tooltip
    this.tooltip.classList.add('is-hidden');

    sound.playGrab();
    this.announce(`Mengambil ${this.draggedData.name}. Seret ke atas menuju tong sampah.`);
  }

  handlePointerMove(e) {
    if (!this.draggedElement || e.pointerId !== this.activePointerId || this.isDropping) return;
    e.preventDefault();

    const clientX = e.clientX - this.dragOffset.x;
    const clientY = e.clientY - this.dragOffset.y;

    // Direct pointer tracking with slight uprighting rotation
    const rot = parseFloat(this.draggedElement.dataset.rot) * 0.18;
    this.draggedElement.style.left = `${clientX}px`;
    this.draggedElement.style.top = `${clientY}px`;
    this.draggedElement.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(1.12)`;

    // Hit-testing with bin aperture
    this.checkProximity(e.clientX, e.clientY);
  }

  checkProximity(pointerX, pointerY) {
    if (!this.binContainer) return;

    const binRect = this.binContainer.getBoundingClientRect();
    const targetRect = this.binApertureTarget
      ? this.binApertureTarget.getBoundingClientRect()
      : {
        left: binRect.left + binRect.width * 0.2,
        right: binRect.right - binRect.width * 0.2,
        top: binRect.top + binRect.height * 0.35,
        bottom: binRect.bottom * 0.85,
      };

    const mouthCenterX = (targetRect.left + targetRect.right) / 2;
    const mouthCenterY = (targetRect.top + targetRect.bottom) / 2;

    const dx = pointerX - mouthCenterX;
    const dy = pointerY - mouthCenterY;
    const dist = Math.hypot(dx, dy);

    const proximityThreshold = Math.max(160, binRect.width * 0.75);

    if (dist < proximityThreshold) {
      if (!this.isNearBin) {
        this.isNearBin = true;
        this.binContainer.classList.add('is-near');
        this.bgText.classList.add('is-active');
        this.tooltip.classList.remove('is-hidden');
        this.tooltip.classList.add('is-ready');
        this.tooltipText.textContent = 'Lepaskan di sini';
        sound.playNearBin();
      }
    } else {
      if (this.isNearBin) {
        this.isNearBin = false;
        this.binContainer.classList.remove('is-near');
        this.bgText.classList.remove('is-active');
        this.tooltip.classList.add('is-hidden');
        this.tooltip.classList.remove('is-ready');
        this.tooltipText.textContent = 'Masukan sampahmu kedalam sini';
      }
    }
  }

  handlePointerUp(e) {
    if (!this.draggedElement || e.pointerId !== this.activePointerId || this.isDropping) return;

    const itemEl = this.draggedElement;
    const pointerId = this.activePointerId;
    this.activePointerId = null;

    try {
      itemEl.releasePointerCapture(pointerId);
    } catch (_) { }

    const wasDroppedInside = this.isInsideBinDropZone(e.clientX, e.clientY);

    if (wasDroppedInside) {
      this.executeSuccessDrop(itemEl, this.draggedData);
    } else {
      this.executeSpringBack(itemEl);
    }
  }

  isInsideBinDropZone(x, y) {
    if (!this.binContainer) return false;
    const binRect = this.binContainer.getBoundingClientRect();

    const hitPadding = 50;
    return (
      x >= binRect.left - hitPadding &&
      x <= binRect.right + hitPadding &&
      y >= binRect.top - 20 &&
      y <= binRect.bottom + hitPadding
    );
  }

  executeSuccessDrop(itemEl, itemData) {
    this.isDropping = true;
    itemEl.classList.remove('is-dragging');
    itemEl.classList.add('is-dropping-into-bin');

    // Reset bin near states
    this.binContainer.classList.remove('is-near');
    this.tooltip.classList.add('is-hidden');
    this.bgText.classList.add('is-active');

    // Sound effect
    sound.playDropSuccess();

    // Bin recoil impact jiggle
    this.binContainer.classList.add('is-impacted');

    // MOVE itemEl inside binDropChute!
    // In bin-container, bin-back is z-index 10, binDropChute is z-index 20, bin-front is z-index 30.
    // By reparenting itemEl into binDropChute at the moment of dropping,
    // the item falls BEHIND bin-front and IN FRONT OF bin-back seamlessly!
    const chuteRect = this.binDropChute.getBoundingClientRect();
    const apertureRect = this.binApertureTarget.getBoundingClientRect();

    // Relative coordinates inside binDropChute
    const chuteCenterX = (apertureRect.left + apertureRect.width / 2) - chuteRect.left;
    const chuteCenterY = (apertureRect.top + apertureRect.height * 0.5) - chuteRect.top;

    // Reparent into chute
    this.binDropChute.appendChild(itemEl);
    itemEl.style.zIndex = '20';
    itemEl.style.transition = 'left 0.46s cubic-bezier(0.2, 0.9, 0.3, 1), top 0.46s cubic-bezier(0.2, 0.9, 0.3, 1), transform 0.46s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.42s ease-out';
    itemEl.style.left = `${chuteCenterX}px`;
    itemEl.style.top = `${chuteCenterY + 45}px`;
    itemEl.style.transform = `translate(-50%, -50%) scale(0.28) rotate(${parseFloat(itemEl.dataset.rot) * 0.4}deg)`;
    itemEl.style.opacity = '0.04';

    this.announce(`Sampah ${itemData.name} berhasil dimasukkan ke dalam tong! Memulai proses pemilahan.`);

    setTimeout(() => {
      this.binContainer.classList.remove('is-impacted');
      this.completeIntro(itemData, false);
    }, 520);
  }

  executeSpringBack(itemEl) {
    this.isNearBin = false;
    this.binContainer.classList.remove('is-near');
    this.bgText.classList.remove('is-active');
    this.tooltip.classList.remove('is-ready');
    this.tooltip.classList.remove('is-hidden');
    this.tooltipText.textContent = 'Masukan sampahmu kedalam sini';

    itemEl.classList.remove('is-dragging');
    itemEl.classList.add('is-springing-back');

    const itemId = itemEl.getAttribute('data-id');
    const pos = this.itemPositions.get(itemId);

    if (pos) {
      itemEl.style.transition = 'left 0.48s cubic-bezier(0.175, 0.885, 0.32, 1.275), top 0.48s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.48s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      itemEl.style.left = `${pos.x}px`;
      itemEl.style.top = `${pos.y}px`;
      itemEl.style.transform = `translate(-50%, -50%) rotate(${pos.rot}deg) scale(${pos.scale})`;
      itemEl.style.zIndex = itemEl.dataset.zIndex;
    }

    sound.playDropFail();
    this.announce(`${this.draggedData.name} dikembalikan ke lantai.`);

    setTimeout(() => {
      itemEl.classList.remove('is-springing-back');
      itemEl.style.transition = '';
      this.draggedElement = null;
      this.draggedData = null;
    }, 480);
  }

  /* ---------------- Keyboard Accessibility ---------------- */

  handleKeyboardItem(e) {
    const itemEl = e.target.closest('.trash-item');
    if (!itemEl) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      sound.ensureContext();

      if (this.selectedKeyboardItem === itemEl) {
        this.selectedKeyboardItem = null;
        itemEl.classList.remove('is-keyboard-selected');
        this.announce(`${itemEl.getAttribute('aria-label')} batal dipilih.`);
        return;
      }

      if (this.selectedKeyboardItem) {
        this.selectedKeyboardItem.classList.remove('is-keyboard-selected');
      }

      this.selectedKeyboardItem = itemEl;
      itemEl.classList.add('is-keyboard-selected');
      sound.playGrab();

      const itemId = itemEl.getAttribute('data-id');
      const itemData = TRASH_ITEMS.find((it) => it.id === itemId);
      this.announce(`${itemData.name} dipilih. Tekan Tab menuju tong sampah lalu tekan Enter untuk memasukkan.`);

      this.tooltip.classList.remove('is-hidden');
      this.tooltip.classList.add('is-ready');
      this.tooltipText.textContent = 'Tekan Tab ke tong sampah & Enter';
    }
  }

  handleKeyboardBin(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      sound.ensureContext();

      let targetItem = this.selectedKeyboardItem;
      if (!targetItem) {
        targetItem = this.trashPile.querySelector('.trash-item:last-child');
      }

      if (targetItem) {
        const itemId = targetItem.getAttribute('data-id');
        const itemData = TRASH_ITEMS.find((it) => it.id === itemId);
        this.executeSuccessDrop(targetItem, itemData);
      }
    }
  }

  completeIntro(itemData, isSkipped = false) {
    if (typeof this.onComplete === 'function') {
      this.onComplete(itemData, isSkipped);
    }
  }

  resetAllItems() {
    this.isDropping = false;
    this.draggedElement = null;
    this.draggedData = null;
    this.renderTrashPile();
    this.positionAllItems();
  }

  resetAllItemsPositions() {
    this.resetAllItems();
  }
}
