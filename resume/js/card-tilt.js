class CardTilt {
  constructor(selector) {
    this.cards = document.querySelectorAll(selector);
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.isReducedMotion) return;
    this.bindEvents();
  }

  bindEvents() {
    for (const card of this.cards) {
      card.addEventListener('mousemove', (e) => this.onMouseMove(e, card));
      card.addEventListener('mouseleave', (e) => this.onMouseLeave(e, card));
    }
  }

  onMouseMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    const inner = card.querySelector('.project-card-inner') || card;
    inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // 光晕跟随
    const glow = card.querySelector('.project-card-glow');
    if (glow) {
      glow.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      glow.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    }
  }

  onMouseLeave(e, card) {
    const inner = card.querySelector('.project-card-inner') || card;
    inner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  }
}