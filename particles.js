/**
 * ParticleEngine - Interactive high-performance 2D Canvas Particle System
 * Supports cursor attraction/repulsion, dynamic connection meshes, and live theme updates.
 */

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.particles = [];
    this.mouse = {
      x: null,
      y: null,
      radius: 160,
      isActive: false
    };

    this.themeColors = {
      quantum: {
        primary: 'rgba(56, 189, 248, ',    // Cyan
        secondary: 'rgba(99, 102, 241, ',  // Indigo
        line: 'rgba(56, 189, 248, '
      },
      cyberpunk: {
        primary: 'rgba(236, 72, 153, ',    // Pink / Magenta
        secondary: 'rgba(168, 85, 247, ',  // Purple
        line: 'rgba(236, 72, 153, '
      },
      matrix: {
        primary: 'rgba(34, 197, 94, ',     // Emerald Green
        secondary: 'rgba(16, 185, 129, ',  // Mint
        line: 'rgba(34, 197, 94, '
      },
      solar: {
        primary: 'rgba(245, 158, 11, ',    // Amber
        secondary: 'rgba(239, 68, 68, ',   // Orange-Red
        line: 'rgba(245, 158, 11, '
      }
    };

    this.currentTheme = document.documentElement.getAttribute('data-theme') || 'quantum';
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseleave', this.handleMouseLeave);

    this.setupCanvas();
    this.createParticles();
    this.animate();
  }

  setupCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);
  }

  handleResize() {
    this.setupCanvas();
    this.createParticles();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.mouse.isActive = true;
  }

  handleMouseLeave() {
    this.mouse.isActive = false;
  }

  setTheme(themeName) {
    if (this.themeColors[themeName]) {
      this.currentTheme = themeName;
    }
  }

  createParticles() {
    this.particles = [];
    // Calculate count based on screen area (adaptive performance)
    const baseCount = Math.floor((this.width * this.height) / 14000);
    const count = Math.min(Math.max(baseCount, 40), 95);

    for (let i = 0; i < count; i++) {
      const isSecondary = Math.random() > 0.65;
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        size: Math.random() * 2.2 + 1,
        baseAlpha: Math.random() * 0.45 + 0.25,
        isSecondary: isSecondary,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseAngle: Math.random() * Math.PI * 2
      });
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const theme = this.themeColors[this.currentTheme] || this.themeColors.quantum;
    const maxLineDist = 135;
    const pCount = this.particles.length;

    // Connect particles
    for (let i = 0; i < pCount; i++) {
      for (let j = i + 1; j < pCount; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxLineDist) {
          const alpha = (1 - dist / maxLineDist) * 0.22;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `${theme.line}${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    // Connect to mouse if nearby
    if (this.mouse.isActive && this.mouse.x !== null) {
      for (let i = 0; i < pCount; i++) {
        const dx = this.particles[i].x - this.mouse.x;
        const dy = this.particles[i].y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const alpha = (1 - dist / this.mouse.radius) * 0.45;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `${theme.primary}${alpha})`;
          this.ctx.lineWidth = 1.2;
          this.ctx.stroke();
        }
      }
    }

    // Update & Draw Particles
    for (let i = 0; i < pCount; i++) {
      const p = this.particles[i];

      // Pulse alpha
      p.pulseAngle += p.pulseSpeed;
      const pulseAlpha = p.baseAlpha + Math.sin(p.pulseAngle) * 0.15;

      // Mouse gentle repulsion / interaction
      if (this.mouse.isActive && this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const force = (1 - dist / this.mouse.radius) * 1.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      // Movement
      p.x += p.vx;
      p.y += p.vy;

      // Screen wrap / bounce smoothly
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Draw particle dot
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      const colorPrefix = p.isSecondary ? theme.secondary : theme.primary;
      this.ctx.fillStyle = `${colorPrefix}${Math.max(0.1, pulseAlpha)})`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = `${colorPrefix}0.8)`;
      this.ctx.fill();
      this.ctx.shadowBlur = 0; // reset
    }
  }

  animate() {
    this.draw();
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseleave', this.handleMouseLeave);
  }
}

window.ParticleEngine = ParticleEngine;
