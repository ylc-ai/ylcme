class NavController {
  constructor() {
    this.nav = document.querySelector('.navbar');
    this.menu = document.querySelector('.nav-menu');
    this.isMobileMenuOpen = false;
    this.bindEvents();
  }

  bindEvents() {
    const onScroll = Utils.throttle(() => this.updateNavBackground(), 16);
    window.addEventListener('scroll', onScroll);
    this.updateNavBackground();

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          this.scrollTo(targetId);
        }
      });
    });

    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    document.querySelector('.back-to-top')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  updateNavBackground() {
    if (window.scrollY > 20) {
      this.nav.style.borderBottom = `1px solid var(--border-color)`;
    } else {
      this.nav.style.borderBottom = '1px solid transparent';
    }
  }

  setActive(activeId) {
    if (!activeId) return;
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  scrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const offsetTop = rect.top + window.pageYOffset - 70;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    this.closeMobileMenu();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.menu.classList.toggle('open', this.isMobileMenuOpen);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.menu.classList.remove('open');
  }
}