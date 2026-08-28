class ScrollController {
  constructor() {
    this.observer = null;
    this.sections = [];
    this.parallaxElements = [];
    this.activeCallback = null;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  init(options = {}) {
    const rootMargin = options.rootMargin || '-60px 0px -100px 0px';

    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.dataset.onEnter && typeof window[entry.target.dataset.onEnter] === 'function') {
              window[entry.target.dataset.onEnter](entry.target);
            }
          }
        }
      }, {
        threshold: [0, 0.15, 0.3, 0.5],
        rootMargin
      });
    }
  }

  observeSections() {
    if (this.isReducedMotion) {
      document.querySelectorAll('.section, .timeline-item, .project-card, .honor-card').forEach(el => {
        el.classList.add('visible');
      });
      return;
    }

    document.querySelectorAll('.section').forEach(section => {
      if (this.observer) {
        this.observer.observe(section);
      } else {
        section.classList.add('visible');
      }
    });

    document.querySelectorAll('.timeline-item').forEach(item => {
      if (this.observer) {
        this.observer.observe(item);
      } else {
        item.classList.add('visible');
      }
    });

    document.querySelectorAll('.project-card, .honor-card').forEach(card => {
      if (this.observer) {
        this.observer.observe(card);
      } else {
        card.classList.add('visible');
      }
    });
  }

  getActiveSection() {
    const sections = Array.from(document.querySelectorAll('.section[id]'));
    for (const section of sections) {
      if (Utils.isInViewport(section, 200)) {
        return section.id;
      }
    }
    return null;
  }

  updateActiveNav(callback) {
    const activeId = this.getActiveSection();
    callback(activeId);
  }

  onScroll(callback) {
    const throttledCallback = Utils.throttle(callback, 50);
    window.addEventListener('scroll', throttledCallback);
  }

  scrollTo(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const offsetTop = rect.top + window.pageYOffset - 70;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  }

  applyParallax() {
    if (this.isReducedMotion) return;

    const onScroll = () => {
      for (const el of this.parallaxElements) {
        const rect = el.element.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) continue;
        const scrollY = window.scrollY;
        const offset = (scrollY - el.startY) * el.speed;
        el.element.style.transform = `translateY(${offset}px)`;
      }
    };

    const throttled = Utils.throttle(onScroll, 16);
    window.addEventListener('scroll', throttled);
  }

  addParallax(element, speed) {
    const rect = element.getBoundingClientRect();
    const startY = rect.top + window.scrollY;
    this.parallaxElements.push({ element, speed, startY });
  }

  updateBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  observeBackToTop() {
    const updateBackToTop = Utils.throttle(() => this.updateBackToTop(), 100);
    window.addEventListener('scroll', updateBackToTop);
  }
}