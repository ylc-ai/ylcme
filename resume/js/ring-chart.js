class RingChart {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.level = options.level || 0;
    this.targetLevel = options.targetLevel || 0;
    this.size = options.size || 140;
    this.ringWidth = options.ringWidth || 8;
    this.radius = (this.size / 2) - this.ringWidth;
    this.animationDuration = options.duration || 1500;
    this.currentProgress = 0;
    this.targetProgress = this.targetLevel / 100;
    this.isAnimating = false;
    this.hasAnimated = false;
    this.label = options.label || '';

    this.canvas.width = this.size;
    this.canvas.height = this.size;
  }

  draw(progress) {
    const ctx = this.ctx;
    const cx = this.size / 2;
    const cy = this.size / 2;
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const bgColor = isDark ? 'rgba(200, 200, 230, 0.08)' : 'rgba(80, 80, 120, 0.08)';
    const primaryColor = isDark ? '#6c5ce7' : '#5b4bd5';
    const secondaryColor = isDark ? '#00d2ff' : '#0099cc';

    ctx.clearRect(0, 0, this.size, this.size);

    // 背景弧
    ctx.beginPath();
    ctx.arc(cx, cy, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = bgColor;
    ctx.lineWidth = this.ringWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 前景弧
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + Math.PI * 2 * progress;

    const gradient = ctx.createLinearGradient(0, 0, this.size, this.size);
    gradient.addColorStop(0, primaryColor);
    gradient.addColorStop(1, secondaryColor);

    ctx.beginPath();
    ctx.arc(cx, cy, this.radius, startAngle, endAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = this.ringWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 数值文字
    ctx.fillStyle = isDark ? '#e8e8ed' : '#1d1d1f';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(progress * 100)}%`, cx, cy);
  }

  animate(callback) {
    if (this.isAnimating || this.hasAnimated) return;
    this.isAnimating = true;
    this.hasAnimated = true;

    const startTime = performance.now();
    const startProgress = 0;

    const tick = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / this.animationDuration, 1);
      const eased = Utils.easeOutQuart(t);
      const progress = startProgress + (this.targetProgress - startProgress) * eased;

      this.draw(progress);
      this.currentProgress = progress;

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        this.draw(this.targetProgress);
        this.currentProgress = this.targetProgress;
        this.isAnimating = false;
        if (callback) callback();
      }
    };

    requestAnimationFrame(tick);
  }

  reset() {
    this.hasAnimated = false;
    this.currentProgress = 0;
    this.draw(0);
  }

  refresh() {
    if (this.hasAnimated) {
      this.draw(this.targetProgress);
    } else {
      this.draw(0);
    }
  }
}