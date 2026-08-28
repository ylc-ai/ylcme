document.addEventListener('DOMContentLoaded', () => {
  // 光线撕裂开场动画
  const overlay = document.getElementById('loadingOverlay');
  const tearAnim = new TearAnimation(overlay);
  window.tearAnim = tearAnim;

  // 延迟后触发撕裂开场
  setTimeout(() => {
    tearAnim.startReveal();
  }, 600);

  // 初始化粒子系统（延迟启动，等开场动画完成后）
  setTimeout(() => {
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
      const particles = new ParticleSystem(canvas);
      window.particles = particles;
      particles.start();
    }
  }, 2200);

  // 初始化打字机效果
  const taglineEl = document.getElementById('tagline');
  if (taglineEl) {
    const typewriter = new TypeWriter(taglineEl, {
      text: resumeData.tagline,
      speed: 80,
      cursor: true
    });
    setTimeout(() => typewriter.start(), 1200);
  }

  // 初始化滚动控制器
  const scrollController = new ScrollController();
  scrollController.init();
  scrollController.observeSections();
  scrollController.observeBackToTop();

  // 视差效果
  const heroGlow = document.querySelector('.hero-glow');
  if (heroGlow) scrollController.addParallax(heroGlow, 0.15);
  const heroGlow2 = document.querySelector('.hero-glow-2');
  if (heroGlow2) scrollController.addParallax(heroGlow2, -0.1);
  scrollController.applyParallax();

  // 导航高亮
  const navController = new NavController();
  scrollController.onScroll(() => {
    scrollController.updateActiveNav((activeId) => {
      navController.setActive(activeId);
    });
  });

  // 初始化主题切换
  const themeManager = new ThemeManager();
  document.querySelector('.theme-toggle').addEventListener('click', () => {
    themeManager.toggle();
    // 刷新环形图
    if (window.ringCharts) {
      window.ringCharts.forEach(chart => chart.refresh());
    }
  });

  // 初始化技能环形图
  const ringContainers = document.querySelectorAll('.skill-ring-canvas');
  const ringCharts = [];
  const skillData = resumeData.skills.slice(0, ringContainers.length);

  ringContainers.forEach((container, index) => {
    const canvas = container.querySelector('canvas');
    if (!canvas) return;
    const skill = skillData[index] || { name: '', level: 0 };
    const chart = new RingChart(canvas, {
      level: 0,
      targetLevel: skill.level,
      size: 140,
      ringWidth: 8,
      duration: 1500,
      label: skill.name
    });
    ringCharts.push(chart);
    container.dataset.chartIndex = index;
  });

  window.ringCharts = ringCharts;

  // 当技能区域进入视口时触发环形图动画
  const skillsSection = document.querySelector('#skills');
  if (skillsSection && 'IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          ringCharts.forEach(chart => chart.animate());
          skillsObserver.unobserve(entry.target);
        }
      }
    }, { threshold: 0.3 });
    skillsObserver.observe(skillsSection);
  } else {
    ringCharts.forEach(chart => chart.animate());
  }

  // 初始化卡片倾斜
  new CardTilt('.project-card');

  // 初始化图片轮播
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    new ImageCarousel(carouselContainer, { autoplaySpeed: 4000 });
  }

  // 窗口大小变化时自适应撕裂动画粒子
  window.addEventListener('resize', () => {
    if (window.tearAnim) {
      window.tearAnim.resize();
    }
  });
});