class TypeWriter {
  constructor(element, { text = '', speed = 80, cursor = true } = {}) {
    this.element = element;
    this.text = text;
    this.speed = speed;
    this.cursor = cursor;
    this.currentIndex = 0;
    this.isRunning = false;
    this.timer = null;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.currentIndex = 0;
    this.element.textContent = '';
    if (this.cursor) {
      this.element.innerHTML = '<span class="cursor">|</span>';
    }
    this.type();
  }

  type() {
    if (this.currentIndex >= this.text.length) {
      this.isRunning = false;
      if (this.cursor) {
        this.element.innerHTML = this.text + '<span class="cursor">|</span>';
      }
      return;
    }

    const char = this.text[this.currentIndex];
    let delay = this.speed;

    if ('，。！？、；：'.includes(char)) {
      delay = 300;
    } else if (char === ' ') {
      delay = 50;
    }

    if (this.cursor) {
      this.element.innerHTML = this.text.slice(0, this.currentIndex + 1) + '<span class="cursor">|</span>';
    } else {
      this.element.textContent = this.text.slice(0, this.currentIndex + 1);
    }

    this.currentIndex++;
    this.timer = setTimeout(() => this.type(), delay);
  }

  reset() {
    this.stop();
    this.currentIndex = 0;
    this.element.textContent = '';
  }

  stop() {
    this.isRunning = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}