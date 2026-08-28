class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 200 };
    this.animationId = null;
    this.isRunning = false;
    this.particleCount = 100;
    this.maxDistance = 150;
    this.speed = 0.5;
    this.resize();
    this.bindEvents();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.particleCount = Math.min(120, Math.max(60, Math.floor(window.innerWidth * window.innerHeight / 12000)));
  }

  bindEvents() {
    const onResize = Utils.debounce(() => this.resize(), 200);
    window.addEventListener('resize', onResize);

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.speed * 2,
        vy: (Math.random() - 0.5) * this.speed * 2,
        radius: Math.random() * 2 + 1.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  update() {
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
    }
  }

  draw() {
    const ctx = this.ctx;
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const particleColor = isDark ? '200, 200, 230' : '100, 100, 150';
    const lineColor = isDark ? '150, 150, 200' : '80, 80, 120';

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`;
      ctx.fill();
    }

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDistance) {
          const opacity = (1 - dist / this.maxDistance) * 0.4;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (this.mouse.x !== null && this.mouse.y !== null) {
      ctx.beginPath();
      ctx.arc(this.mouse.x, this.mouse.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${lineColor}, 0.3)`;
      ctx.fill();
    }
  }

  animate() {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.init();
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  refresh() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw();
  }
}