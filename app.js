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
    this.jumpMenuOpen = false;
    this.jumpMenu = document.getElementById('jumpMenu');

    // Key → slide index mapping for quick jump
    this.jumpKeys = {
      '1': 0, '2': 1, '3': 2, '4': 3, '5': 4,
      '6': 5, '7': 6, '8': 7, '9': 8, '0': 9,
      'q': 10, 'w': 11, 'e': 12, 'r': 13
    };

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

    // Click only for jump menu interactions
    document.addEventListener('click', (e) => {
      // Jump menu item click
      const jumpItem = e.target.closest('.jump-item');
      if (jumpItem) {
        const target = parseInt(jumpItem.dataset.target, 10);
        this.jumpTo(target);
        return;
      }

      // Click outside jump menu closes it
      if (this.jumpMenuOpen) {
        this.closeJumpMenu();
        return;
      }
    });
  }

  handleKeydown(e) {
    // Jump menu is open — handle its keys
    if (this.jumpMenuOpen) {
      e.preventDefault();
      if (e.key === 'Escape' || e.key === 'g') {
        this.closeJumpMenu();
        return;
      }
      const target = this.jumpKeys[e.key.toLowerCase()];
      if (target !== undefined) {
        this.jumpTo(target);
      }
      return;
    }

    if (this.isAnimating) return;

    // Open jump menu with G
    if (e.key === 'g' || e.key === 'G') {
      e.preventDefault();
      this.openJumpMenu();
      return;
    }

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

    // Single-step mode: hide previous step before showing next
    if (slide.classList.contains('single-step') && stepNum > 0 && steps[stepNum - 1]) {
      steps[stepNum - 1].classList.remove('visible');
    }

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

    // Single-step mode: re-show the previous step when going back
    if (slide.classList.contains('single-step') && stepNum > 0 && steps[stepNum - 1]) {
      steps[stepNum - 1].classList.add('visible');
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
      const prevSlide = this.slides[prevIndex];
      const steps = prevSlide.querySelectorAll('.step-item');

      this.currentStep[prevIndex] = this.stepMap[prevIndex];
      this.goToSlide(prevIndex, 'left');

      if (prevSlide.classList.contains('single-step')) {
        // Only show the last step
        steps.forEach(s => s.classList.remove('visible'));
        if (steps.length > 0) {
          steps[steps.length - 1].classList.add('visible');
        }
      } else {
        steps.forEach(s => s.classList.add('visible'));
      }
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

  openJumpMenu() {
    this.jumpMenuOpen = true;
    this.jumpMenu.classList.add('open');
    // Highlight current slide
    this.jumpMenu.querySelectorAll('.jump-item').forEach(item => {
      item.classList.toggle('active', parseInt(item.dataset.target, 10) === this.currentSlide);
    });
  }

  closeJumpMenu() {
    this.jumpMenuOpen = false;
    this.jumpMenu.classList.remove('open');
  }

  jumpTo(index) {
    this.closeJumpMenu();
    if (index >= 0 && index < this.totalSlides) {
      this.goToSlide(index);
    }
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
