/**
 * Real Photo Falling Leaves Simulation with Wind Aerodynamics
 * High-performance, 60fps Canvas simulation.
 * Features realistic 3D fluttering, chaotic wind turbulence, and natural tumbling.
 */

const LEAF_IMAGE_PATHS = [
  '/assets/leaves/leaf-green.png',
  '/assets/leaves/leaf-autumn.png',
  '/assets/leaves/leaf-willow.png'
];

class LeafParticle {
  constructor(canvas, images, isInitial = false) {
    this.canvas = canvas;
    this.images = images;
    this.img = images[Math.floor(Math.random() * images.length)];
    this.reset(isInitial);
  }

  reset(isInitial = false) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Pick random leaf image
    this.img = this.images[Math.floor(Math.random() * this.images.length)];

    // Sizing: natural scale between 28px and 46px
    this.size = 28 + Math.random() * 18;
    this.aspect = (this.img && this.img.width && this.img.height) 
      ? this.img.height / this.img.width 
      : 1.25;

    // Position
    this.x = Math.random() * w;
    // On startup, scatter throughout viewport height so leaves are already mid-flight
    this.y = isInitial ? Math.random() * h : -60 - Math.random() * 100;

    // Buoyant downward velocity
    this.vy = 0.65 + Math.random() * 0.75; // 0.65 to 1.4 px/frame

    // Wind gust drift (predominantly gentle diagonal right/left drift)
    this.baseWindX = (Math.random() - 0.45) * 0.6; // gentle bias

    // Aerodynamic swaying oscillation
    this.swayPhase = Math.random() * Math.PI * 2;
    this.swaySpeed = 0.015 + Math.random() * 0.02; // slow organic wave
    this.swayAmp = 0.8 + Math.random() * 1.4; // horizontal sway distance

    // 2D Rotation (Z-axis roll)
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.02;

    // 3D Flutter / Pitch (flipping over like paper in wind)
    this.flipPhase = Math.random() * Math.PI * 2;
    this.flipSpeed = 0.025 + Math.random() * 0.035;

    // Opacity
    this.opacity = 0.75 + Math.random() * 0.2;
  }

  update(globalWind = 0) {
    // Advance wave phases
    this.swayPhase += this.swaySpeed;
    this.flipPhase += this.flipSpeed;
    this.rotation += this.rotSpeed;

    // Horizontal movement: base drift + sinusoidal pendulum sway + global gust
    const swayX = Math.sin(this.swayPhase) * this.swayAmp;
    this.x += this.baseWindX + swayX + globalWind;

    // Vertical movement: buoyant descent with subtle lift when fluttering flat
    const flutterLift = Math.abs(Math.cos(this.flipPhase)) * 0.25;
    this.y += Math.max(0.3, this.vy - flutterLift);

    // Reset when leaf exits bottom or drifts too far outside sides
    if (this.y > this.canvas.height + 70 || this.x < -100 || this.x > this.canvas.width + 100) {
      this.reset(false);
    }
  }

  draw(ctx) {
    if (!this.img || !this.img.complete || this.img.naturalWidth === 0) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;

    // Position at leaf center
    ctx.translate(this.x, this.y);

    // 2D Rotation
    ctx.rotate(this.rotation);

    // 3D Flutter simulation (scale horizontally to simulate 3D pitch/yaw)
    const scaleX = Math.cos(this.flipPhase);
    ctx.scale(scaleX, 1);

    // Subtle physical drop shadow for tactile depth
    ctx.shadowColor = 'rgba(22, 22, 22, 0.12)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 6;

    const renderW = this.size;
    const renderH = this.size * this.aspect;

    ctx.drawImage(this.img, -renderW / 2, -renderH / 2, renderW, renderH);

    ctx.restore();
  }
}

class FallingLeavesEngine {
  constructor(canvasId = 'fallingLeavesCanvas', leafCount = 6) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.leafCount = leafCount;
    this.leaves = [];
    this.images = [];
    this.isRunning = false;
    this.globalTime = 0;
    this.rafId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Preload real photo images
    let loadedCount = 0;
    LEAF_IMAGE_PATHS.forEach((path) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === LEAF_IMAGE_PATHS.length) {
          this.createLeaves();
          this.start();
        }
      };
      this.images.push(img);
    });
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
    // Recompute logical coordinate bounds
    this.logicalWidth = window.innerWidth;
    this.logicalHeight = window.innerHeight;
  }

  createLeaves() {
    this.leaves = [];
    for (let i = 0; i < this.leafCount; i++) {
      const leaf = new LeafParticle(
        { width: this.logicalWidth, height: this.logicalHeight },
        this.images,
        true // initial scattering
      );
      this.leaves.push(leaf);
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    const loop = () => {
      if (!this.isRunning) return;

      this.globalTime += 0.015;
      // Gentle dynamic atmospheric breeze gust (periodically shifts between -0.4 and +0.6)
      const gust = Math.sin(this.globalTime * 0.4) * 0.35 + Math.cos(this.globalTime * 0.15) * 0.2;

      this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);

      for (let i = 0; i < this.leaves.length; i++) {
        const leaf = this.leaves[i];
        leaf.canvas.width = this.logicalWidth;
        leaf.canvas.height = this.logicalHeight;
        leaf.update(gust);
        leaf.draw(this.ctx);
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

let engineInstance = null;

export function initFallingLeaves(canvasId = 'fallingLeavesCanvas', count = 6) {
  if (engineInstance) {
    engineInstance.stop();
  }
  engineInstance = new FallingLeavesEngine(canvasId, count);
  return engineInstance;
}
