const Utils = {
  throttle(fn, delay = 100) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn.apply(this, args);
      }
    };
  },

  debounce(fn, delay = 150) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
  },

  isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    const vh = window.innerHeight;
    return rect.top < vh - offset && rect.bottom > offset;
  },

  getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
  },

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  },

  easeOutQuad(t) {
    return t * (2 - t);
  },

  easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }
};