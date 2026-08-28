class TearAnimation {
  constructor(overlay) {
    this.overlay = overlay;
    this.particlesCanvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.isDone = false;
    this.init();
  }

  init() {
    this.particlesCanvas = document.createElement('canvas');
    this.particlesCanvas.className = 'tear-particles-canvas';
    this.particlesCanvas.width = window.innerWidth;
    this.particlesCanvas.height = window.innerHeight;
    document.getElementById('tearParticles').appendChild(this.particlesCanvas);
    this.ctx = this.particlesCanvas.getContext('2d');
  }

  createParticles() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const particleCount = 60;

    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = Utils.getRandomBetween(100, 300);
      this.particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * Utils.getRandomBetween(2, 8),
        vy: Math.sin(angle) * Utils.getRandomBetween(2, 8),
        radius: Utils.getRandomBetween(1, 4),
        opacity: 1,
        life: 1
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.particlesCanvas.width, this.particlesCanvas.height);
    this.ctx.fillStyle = 'rgba(108, 92, 231, 0.8)';

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.opacity = p.life;
      p.life -= 0.02;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      const ctx = this.ctx;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108, 92, 231, ${p.opacity})`;
      ctx.fill();

      // 光晕效果
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
      gradient.addColorStop(0, `rgba(108, 92, 231, ${p.opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(108, 92, 231, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.overlay.classList.add('hidden');
    }
  }

  startReveal() {
    this.createParticles();
    this.overlay.classList.add('reveal');
    setTimeout(() => {
      this.animate();
    }, 300);

    setTimeout(() => {
      this.isDone = true;
    }, 1600);
  }

  resize() {
    if (this.particlesCanvas) {
      this.particlesCanvas.width = window.innerWidth;
      this.particlesCanvas.height = window.innerHeight;
    }
  }
}