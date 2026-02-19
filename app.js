/* ============================================
   SKI Presentation - Navigation Engine
   ============================================ */

class Presentation {
  constructor() {
    this.currentSlide = 0;
    this.currentStep = {};
    this.slides = document.querySelectorAll('.slide');
    this.totalSlides = this.slides.length;
    this.progressBar = document.querySelector('.progress-bar');
    this.slideCounter = document.querySelector('.slide-counter');
    this.stepIndicator = document.querySelector('.step-indicator');
    this.isAnimating = false;

    // Build step map: for each slide, count the step-items
    this.stepMap = {};
    this.slides.forEach((slide, i) => {
      const steps = slide.querySelectorAll('.step-item');
      this.stepMap[i] = steps.length;
      this.currentStep[i] = 0;
    });

    this.init();
  }

  init() {
    this.bindEvents();
    this.goToSlide(0);
    this.updateUI();
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Click anywhere (except links) to advance
    document.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      this.advance();
    });
  }

  handleKeydown(e) {
    if (this.isAnimating) return;

    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        this.advance();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.retreat();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.previousSlide();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.nextSlideDirectly();
        break;
      case 'Home':
        e.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        this.goToSlide(this.totalSlides - 1);
        break;
    }
  }

  advance() {
    if (this.isAnimating) return;

    const slideIndex = this.currentSlide;
    const totalSteps = this.stepMap[slideIndex];
    const currentStepNum = this.currentStep[slideIndex];

    if (currentStepNum < totalSteps) {
      // Show next step
      this.showStep(slideIndex, currentStepNum);
      this.currentStep[slideIndex]++;
      this.updateUI();
    } else {
      // All steps shown, go to next slide
      this.nextSlide();
    }
  }

  retreat() {
    if (this.isAnimating) return;

    const slideIndex = this.currentSlide;
    const currentStepNum = this.currentStep[slideIndex];

    if (currentStepNum > 0) {
      // Hide last step
      this.currentStep[slideIndex]--;
      this.hideStep(slideIndex, this.currentStep[slideIndex]);
      this.updateUI();
    } else {
      // Go to previous slide (with all steps visible)
      this.previousSlide();
    }
  }

  showStep(slideIndex, stepNum) {
    const slide = this.slides[slideIndex];
    const steps = slide.querySelectorAll('.step-item');
    if (steps[stepNum]) {
      steps[stepNum].classList.add('visible');
    }
  }

  hideStep(slideIndex, stepNum) {
    const slide = this.slides[slideIndex];
    const steps = slide.querySelectorAll('.step-item');
    if (steps[stepNum]) {
      steps[stepNum].classList.remove('visible');
    }
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  nextSlideDirectly() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      const prevIndex = this.currentSlide - 1;
      // Show all steps of previous slide
      this.currentStep[prevIndex] = this.stepMap[prevIndex];
      this.goToSlide(prevIndex, 'left');
      // Make all steps visible on the previous slide
      const prevSlide = this.slides[prevIndex];
      const steps = prevSlide.querySelectorAll('.step-item');
      steps.forEach(s => s.classList.add('visible'));
    }
  }

  goToSlide(index, direction = 'right') {
    if (index < 0 || index >= this.totalSlides) return;
    if (index === this.currentSlide && this.slides[index].classList.contains('active')) return;

    this.isAnimating = true;

    const prevSlide = this.slides[this.currentSlide];
    const nextSlide = this.slides[index];

    // Remove active from current
    prevSlide.classList.remove('active');
    if (direction === 'right') {
      prevSlide.classList.add('exit-left');
    }

    // Reset new slide steps if going forward
    if (index > this.currentSlide) {
      this.currentStep[index] = 0;
      const steps = nextSlide.querySelectorAll('.step-item');
      steps.forEach(s => s.classList.remove('visible'));
    }

    // Activate new slide
    setTimeout(() => {
      prevSlide.classList.remove('exit-left');
      nextSlide.classList.add('active');
      this.currentSlide = index;
      this.updateUI();

      setTimeout(() => {
        this.isAnimating = false;
      }, 300);
    }, 50);
  }

  updateUI() {
    // Progress bar
    const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
    this.progressBar.style.width = `${progress}%`;

    // Slide counter
    this.slideCounter.innerHTML = `<span class="current">${this.currentSlide + 1}</span> / ${this.totalSlides}`;

    // Step indicator
    const totalSteps = this.stepMap[this.currentSlide];
    const currentStepNum = this.currentStep[this.currentSlide];

    if (totalSteps > 0) {
      this.stepIndicator.textContent = `step ${currentStepNum}/${totalSteps}`;
      this.stepIndicator.classList.add('visible');
    } else {
      this.stepIndicator.classList.remove('visible');
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Presentation();
});
