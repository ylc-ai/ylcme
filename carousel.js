class ImageCarousel {
  constructor(container, options = {}) {
    this.container = container;
    this.track = container.querySelector('.carousel-track');
    this.slides = container.querySelectorAll('.carousel-slide');
    this.prevBtn = container.querySelector('.carousel-prev');
    this.nextBtn = container.querySelector('.carousel-next');
    this.dots = container.querySelectorAll('.carousel-dot');
    this.autoplaySpeed = options.autoplaySpeed || 4000;
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.isAnimating = false;
    this.autoplayTimer = null;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.bindEvents();
    this.updateDots();
    this.startAutoplay();
  }

  bindEvents() {
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goTo(index));
    });

    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());

    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    this.container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      this.stopAutoplay();
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
      this.startAutoplay();
    }, { passive: true });
  }

  goTo(index) {
    if (this.isAnimating || index === this.currentIndex) return;
    if (index < 0) index = 0;
    if (index >= this.totalSlides) index = this.totalSlides - 1;

    this.isAnimating = true;
    this.currentIndex = index;

    if (this.isReducedMotion) {
      this.track.style.transition = 'none';
    } else {
      this.track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }

    this.track.style.transform = `translateX(-${index * 100}%)`;
    this.updateDots();

    setTimeout(() => {
      this.isAnimating = false;
    }, 500);
  }

  next() {
    const nextIndex = this.currentIndex + 1;
    if (nextIndex >= this.totalSlides) {
      this.goTo(0);
    } else {
      this.goTo(nextIndex);
    }
  }

  prev() {
    const prevIndex = this.currentIndex - 1;
    if (prevIndex < 0) {
      this.goTo(this.totalSlides - 1);
    } else {
      this.goTo(prevIndex);
    }
  }

  updateDots() {
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  startAutoplay() {
    if (this.autoplayTimer) return;
    this.autoplayTimer = setInterval(() => this.next(), this.autoplaySpeed);
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }
}