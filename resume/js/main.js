// 安全包装：任意一个模块失败不应中断其它模块
function safeRun(name, fn) {
  try {
    fn();
  } catch (err) {
    console.error('[main.js] 模块初始化失败：' + name, err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1) 光线撕裂开场动画
  safeRun('TearAnimation', () => {
    const overlay = document.getElementById('loadingOverlay');
    if (!overlay) return;
    const tearAnim = new TearAnimation(overlay);
    window.tearAnim = tearAnim;

    setTimeout(() => {
      try { tearAnim.startReveal(); } catch (e) { console.error(e); }
    }, 600);
  });

  // 2) 粒子系统（延迟启动，等开场动画完成后）
  safeRun('Particles', () => {
    setTimeout(() => {
      const canvas = document.getElementById('particles-canvas');
      if (!canvas) return;
      const particles = new ParticleSystem(canvas);
      window.particles = particles;
      particles.start();
    }, 2200);
  });

  // 3) 打字机效果
  safeRun('TypeWriter', () => {
    const taglineEl = document.getElementById('tagline');
    if (!taglineEl || typeof resumeData === 'undefined') {
      // 数据缺失时回退为静态文本，避免完全空白
      if (taglineEl && typeof resumeData === 'undefined') {
        taglineEl.textContent = '以音乐学的敏锐感知力驾驭AI，做有审美的内容创作者';
      }
      return;
    }
    const typewriter = new TypeWriter(taglineEl, {
      text: resumeData.tagline,
      speed: 80,
      cursor: true
    });
    setTimeout(() => typewriter.start(), 1200);
  });

  // 4) 滚动控制器 + 视差
  let scrollController = null;
  safeRun('ScrollController', () => {
    scrollController = new ScrollController();
    scrollController.init();
    scrollController.observeSections();
    scrollController.observeBackToTop();

    const heroGlow = document.querySelector('.hero-glow');
    if (heroGlow) scrollController.addParallax(heroGlow, 0.15);
    const heroGlow2 = document.querySelector('.hero-glow-2');
    if (heroGlow2) scrollController.addParallax(heroGlow2, -0.1);
    scrollController.applyParallax();
  });

  // 5) 导航高亮
  safeRun('NavController', () => {
    const navController = new NavController();
    if (scrollController) {
      scrollController.onScroll(() => {
        scrollController.updateActiveNav((activeId) => {
          navController.setActive(activeId);
        });
      });
    }
  });

  // 6) 主题切换（localStorage 受限时不影响整页）
  safeRun('ThemeManager', () => {
    const themeManager = new ThemeManager();
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        try {
          themeManager.toggle();
          if (window.ringCharts) {
            window.ringCharts.forEach(chart => chart.refresh && chart.refresh());
          }
        } catch (e) {
          console.error('[main.js] 主题切换失败', e);
        }
      });
    }
  });

  // 7) 技能环形图
  safeRun('RingCharts', () => {
    if (typeof resumeData === 'undefined') return;
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

    const skillsSection = document.querySelector('#skills');
    if (skillsSection && 'IntersectionObserver' in window) {
      const skillsObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            ringCharts.forEach(chart => chart.animate && chart.animate());
            skillsObserver.unobserve(entry.target);
          }
        }
      }, { threshold: 0.3 });
      skillsObserver.observe(skillsSection);
    } else {
      ringCharts.forEach(chart => chart.animate && chart.animate());
    }
  });

  // 8) 卡片倾斜
  safeRun('CardTilt', () => {
    new CardTilt('.project-card');
  });

  // 9) 图片轮播
  safeRun('Carousel', () => {
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
      new ImageCarousel(carouselContainer, { autoplaySpeed: 4000 });
    }
  });

  // 10) 窗口尺寸变化时同步撕裂动画
  window.addEventListener('resize', () => {
    if (window.tearAnim && window.tearAnim.resize) {
      try { window.tearAnim.resize(); } catch (e) { /* 忽略 */ }
    }
  });

  // 全局错误捕获，便于在 GitHub Pages 上调试
  window.addEventListener('error', (e) => {
    console.error('[全局错误]', e.message, e.filename, e.lineno);
  });
});
