// Motion Choreography & Anime.js Animation Coordinator with Built-in Fallbacks

export class PresentationAnimator {
  constructor() {
    this.currentTimeline = null;
  }

  getAnime() {
    return window.anime || null;
  }

  // --- Animate In Slide with Staggered Visual Hierarchy ---
  animateSlideIn(slideElement, onComplete) {
    const anime = this.getAnime();

    // Reset initial states
    const staggerEls = slideElement.querySelectorAll('.anim-stagger');
    staggerEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px) scale(0.98)';
    });

    const bars = slideElement.querySelectorAll('.bar-fill');
    bars.forEach(b => { b.style.width = '0%'; });

    if (anime) {
      if (this.currentTimeline) {
        try { this.currentTimeline.pause(); } catch(e) {}
      }

      const tl = anime.timeline({
        easing: 'easeOutQuart',
        complete: () => {
          if (onComplete) onComplete();
        }
      });

      tl.add({
        targets: slideElement.querySelectorAll('.slide-header-box'),
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 450
      })
      .add({
        targets: slideElement.querySelectorAll('.hero-visual-box, .stat-hero-box'),
        opacity: [0, 1],
        scale: [0.95, 1],
        translateY: [20, 0],
        duration: 550
      }, '-=300')
      .add({
        targets: staggerEls,
        opacity: [0, 1],
        translateY: [24, 0],
        scale: [0.98, 1],
        delay: anime.stagger(75, { start: 40 }),
        duration: 500
      }, '-=350');

      this.currentTimeline = tl;
    } else {
      // Fallback transition without external anime
      slideElement.querySelectorAll('.slide-header-box, .hero-visual-box, .stat-hero-box, .anim-stagger').forEach((el, idx) => {
        setTimeout(() => {
          el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
        }, idx * 60);
      });
      if (onComplete) onComplete();
    }

    // Trigger dynamic count-ups
    this.animateCounters(slideElement);

    // Trigger bar fill animations
    this.animateBars(slideElement);

    // Trigger SVG path drawing
    this.animateSVGs(slideElement);
  }

  // --- Dynamic Scientific Counter Interpolation ---
  animateCounters(slideElement) {
    const counterEls = slideElement.querySelectorAll('[data-counter]');
    const anime = this.getAnime();

    counterEls.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-counter'));
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';

      if (isNaN(target)) return;

      if (anime) {
        const obj = { val: 0 };
        anime({
          targets: obj,
          val: target,
          duration: 1200,
          easing: 'easeOutExpo',
          update: () => {
            const formatted = decimals > 0 ? obj.val.toFixed(decimals) : Math.round(obj.val).toString();
            el.textContent = `${prefix}${formatted}${suffix}`;
          }
        });
      } else {
        // Vanilla RAF Counter Fallback
        const startTime = performance.now();
        const duration = 1200;
        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = target * easeOut;
          el.textContent = `${prefix}${decimals > 0 ? currentVal.toFixed(decimals) : Math.round(currentVal)}${suffix}`;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    });
  }

  // --- Animate Horizontal Progress & Capacity Bars ---
  animateBars(slideElement) {
    const bars = slideElement.querySelectorAll('.bar-fill');
    const anime = this.getAnime();

    bars.forEach((bar) => {
      const targetW = bar.getAttribute('data-target-width') || '100%';
      if (anime) {
        anime({
          targets: bar,
          width: targetW,
          duration: 1000,
          delay: 300,
          easing: 'cubicBezier(0.25, 1, 0.5, 1)'
        });
      } else {
        setTimeout(() => {
          bar.style.transition = 'width 1s cubic-bezier(0.25, 1, 0.5, 1)';
          bar.style.width = targetW;
        }, 250);
      }
    });
  }

  // --- Animate SVG Paths & Radar Polygons ---
  animateSVGs(slideElement) {
    const anime = this.getAnime();
    const polies = slideElement.querySelectorAll('.radar-poly');
    if (polies.length > 0 && anime) {
      anime({
        targets: polies,
        opacity: [0, 1],
        scale: [0.6, 1],
        duration: 800,
        delay: anime.stagger(120, { start: 150 }),
        easing: 'easeOutElastic(1, .8)'
      });
    }

    const paretoPoints = slideElement.querySelectorAll('.pareto-point-node');
    if (paretoPoints.length > 0 && anime) {
      anime({
        targets: paretoPoints,
        opacity: [0, 1],
        scale: [0, 1],
        delay: anime.stagger(70, { start: 200 }),
        duration: 600,
        easing: 'easeOutBack'
      });
    }
  }

  // --- Slide Transition Out ---
  animateSlideOut(slideElement, onComplete) {
    const anime = this.getAnime();
    if (anime) {
      anime({
        targets: slideElement,
        opacity: [1, 0],
        translateY: [0, -12],
        duration: 250,
        easing: 'easeInQuad',
        complete: () => {
          if (onComplete) onComplete();
        }
      });
    } else {
      slideElement.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      slideElement.style.opacity = '0';
      slideElement.style.transform = 'translateY(-12px)';
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 250);
    }
  }
}
