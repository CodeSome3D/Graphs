// World State of AI (2026 Edition) - Master Application Coordinator

import { presentationData } from './data.js';
import { HolographicVisualizer } from './globe.js';
import { InfographicCharts } from './charts.js';
import { PresentationAnimator } from './animations.js';

class PresentationApp {
  constructor() {
    this.data = presentationData;
    this.currentSlideIndex = 0;
    this.totalSlides = this.data.slides.length;
    this.currentPaletteKey = 'cyber';
    this.isPresenterPlaying = false;
    this.presenterTimer = null;
    this.slideDurationSec = 14;
    this.remainingSec = this.slideDurationSec;

    this.visualizer = null;
    this.charts = null;
    this.animator = null;

    this.init();
  }

  init() {
    try {
      // 1. Initialize Visualizer (Three.js) in dedicated right stage
      if (window.THREE) {
        this.visualizer = new HolographicVisualizer('webgl-canvas-container', {
          onHubSelect: (hub) => this.showHubDetail(hub),
          onHubHover: (hub) => this.onHubHover(hub),
          onExpertSelect: (expert) => this.showExpertDetail(expert),
          onTelemetryUpdate: (hub) => this.updateTelemetry(hub)
        });

        this.visualizer.populateHubs(this.data.globalHubs);
        this.visualizer.populateArcs(this.data.dataArcs, this.data.globalHubs);
      }

      // 2. Initialize Charts & Animator
      this.charts = new InfographicCharts(this.data.palettes[this.currentPaletteKey]);
      this.animator = new PresentationAnimator();

      // 3. Render Visualizations
      this.renderAllSlideVisuals();

      // 4. Bind UI Controls & Keyboard Events
      this.bindEvents();

      // 5. Activate First Slide
      this.activateSlide(0);

      console.log("WORLD STATE OF AI // 2026 Split View Ready");
    } catch (err) {
      console.error("Initialization error:", err);
      this.bindEvents();
      this.activateSlide(0);
    }
  }

  renderAllSlideVisuals() {
    if (!this.charts) return;

    // Slide 2: Regional Capacity Bars & Energy Breakdown
    const slide2 = this.data.slides.find(s => s.id === 2);
    if (slide2) {
      this.charts.createCapacityBars('slide2-capacity-bars', slide2.regionalCapacity);
      this.charts.createEnergyBreakdown('slide2-energy-grid', slide2.energyBreakdown);
    }

    // Slide 4: 4 Rich Interactive Charts (Radar, Pareto, Gap Evolution, Scaling Curve)
    const slide4 = this.data.slides.find(s => s.id === 4);
    if (slide4) {
      this.charts.createRadarChart('slide4-radar-container', slide4.radarMetrics, 210);
      this.charts.createParetoPlot('slide4-pareto-container', slide4.paretoPoints, 260, 160);
      this.charts.createGapEvolutionPlot('slide4-delta-container', 260, 160);
      this.charts.createInferenceScalingPlot('slide4-scaling-container', 260, 160);
    }
  }

  // --- Slide Navigation & Camera Choreography ---
  goToSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;
    if (index === this.currentSlideIndex) return;

    const currentSlideEl = document.querySelector(`.slide-container[data-slide-index="${this.currentSlideIndex}"]`);
    const nextSlideEl = document.querySelector(`.slide-container[data-slide-index="${index}"]`);

    if (currentSlideEl && nextSlideEl) {
      if (this.animator) {
        this.animator.animateSlideOut(currentSlideEl, () => {
          currentSlideEl.classList.remove('active-slide');
          this.activateSlide(index);
        });
      } else {
        currentSlideEl.classList.remove('active-slide');
        this.activateSlide(index);
      }
    } else if (nextSlideEl) {
      this.activateSlide(index);
    }
  }

  nextSlide() {
    const nextIndex = (this.currentSlideIndex + 1) % this.totalSlides;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentSlideIndex - 1 + this.totalSlides) % this.totalSlides;
    this.goToSlide(prevIndex);
  }

  activateSlide(index) {
    this.currentSlideIndex = index;
    const slideData = this.data.slides[index];
    const slideEl = document.querySelector(`.slide-container[data-slide-index="${index}"]`);

    // Hide all other slides
    document.querySelectorAll('.slide-container').forEach((el, idx) => {
      if (idx === index) {
        el.classList.add('active-slide');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      } else {
        el.classList.remove('active-slide');
      }
    });

    // Update Dots
    document.querySelectorAll('.slide-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });

    // Update Counter
    const counterEl = document.getElementById('hud-slide-counter');
    if (counterEl) {
      counterEl.textContent = `0${index + 1} / 0${this.totalSlides}`;
    }

    // 3D Visualizer Camera Choreography
    if (this.visualizer) {
      if (slideData.neuralMoEMode) {
        this.visualizer.setMode('neural');
        this.updateCameraButtons('neural');
        this.updateTelemetry({ name: "NEURAL MoE GATING MATRIX", capacityGW: "38B Active / 680B Total" });
      } else {
        this.visualizer.setMode('globe');
        if (slideData.id === 2) {
          this.visualizer.setPerspective('us');
          this.updateCameraButtons('us');
          this.updateTelemetry({ name: "US-EAST // DATA CENTER ALLEY", capacityGW: "6.2 GW (38% Share)" });
        } else {
          this.visualizer.setPerspective('global');
          this.updateCameraButtons('global');
          this.updateTelemetry({ name: "GLOBAL AI INFRASTRUCTURE", capacityGW: "22.8 GW Global Active" });
        }
      }
    }

    // Trigger Animations
    if (this.animator && slideEl) {
      this.animator.animateSlideIn(slideEl);
    }

    // Reset presenter timer
    if (this.isPresenterPlaying) {
      this.resetPresenterTimer();
    }
  }

  // --- Telemetry Display ---
  updateTelemetry(info) {
    const nameEl = document.getElementById('telemetry-hub-name');
    const gwEl = document.getElementById('telemetry-hub-gw');
    if (nameEl && info.name) nameEl.textContent = info.name.toUpperCase();
    if (gwEl && info.capacityGW) gwEl.textContent = typeof info.capacityGW === 'number' ? `${info.capacityGW} GW Capacity` : info.capacityGW;
  }

  // --- Presenter Auto-Play Mode ---
  togglePresenterMode() {
    this.isPresenterPlaying = !this.isPresenterPlaying;
    const btn = document.getElementById('btn-toggle-presenter');
    const timerBox = document.getElementById('presenter-timer-box');

    if (this.isPresenterPlaying) {
      if (btn) {
        btn.classList.add('active');
        btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> PAUSE AUTO`;
      }
      if (timerBox) timerBox.style.display = 'flex';
      this.resetPresenterTimer();
    } else {
      if (btn) {
        btn.classList.remove('active');
        btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> PRESENT`;
      }
      if (timerBox) timerBox.style.display = 'none';
      clearInterval(this.presenterTimer);
    }
  }

  resetPresenterTimer() {
    clearInterval(this.presenterTimer);
    this.remainingSec = this.slideDurationSec;
    this.updateTimerDisplay();

    this.presenterTimer = setInterval(() => {
      this.remainingSec -= 1;
      this.updateTimerDisplay();

      if (this.remainingSec <= 0) {
        this.nextSlide();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const el = document.getElementById('presenter-timer-val');
    if (el) {
      el.textContent = `${this.remainingSec}s`;
    }
  }

  // --- Theme / Palette Switcher ---
  switchPalette(paletteKey) {
    if (!this.data.palettes[paletteKey]) return;
    this.currentPaletteKey = paletteKey;
    document.body.setAttribute('data-palette', paletteKey);

    const palette = this.data.palettes[paletteKey];
    if (this.charts) {
      this.charts.setPalette(palette);
      this.renderAllSlideVisuals();
    }

    document.querySelectorAll('.palette-option-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-palette') === paletteKey);
    });
  }

  updateCameraButtons(presetName) {
    document.querySelectorAll('.camera-btn[data-cam]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-cam') === presetName);
    });
  }

  // --- Interactive Details ---
  showHubDetail(hub) {
    const drawer = document.getElementById('detail-drawer');
    if (!drawer) return;

    document.getElementById('drawer-title').textContent = hub.name;
    document.getElementById('drawer-content').innerHTML = `
      <div style="margin-bottom: 10px;">
        <span class="hud-badge">${hub.country}</span>
        <span style="font-size: 11px; color: var(--success); margin-left: 8px;">${hub.status}</span>
      </div>
      <div class="eff-item" style="margin-bottom: 5px;">
        <span style="color: var(--text-muted);">Cluster Scale:</span>
        <strong style="color: var(--primary);">${hub.capacityGW} GW Capacity (${hub.share}%)</strong>
      </div>
      <div class="eff-item" style="margin-bottom: 5px;">
        <span style="color: var(--text-muted);">Primary Silicon:</span>
        <span>${hub.chips}</span>
      </div>
      <div class="eff-item" style="margin-bottom: 5px;">
        <span style="color: var(--text-muted);">Power Source:</span>
        <span>${hub.powerType}</span>
      </div>
      <div style="margin-top: 8px; font-size: 11px; color: var(--text-muted);">
        <strong>Frontier Entities:</strong><br/>${hub.leadOrgs}
      </div>
    `;

    drawer.style.display = 'block';
    if (this.visualizer) this.visualizer.focusHub(hub.id);
    this.updateTelemetry(hub);
  }

  showExpertDetail(expert) {
    const drawer = document.getElementById('detail-drawer');
    if (!drawer) return;

    document.getElementById('drawer-title').textContent = `Expert: ${expert.expertName}`;
    document.getElementById('drawer-content').innerHTML = `
      <div style="margin-bottom: 10px;">
        <span class="hud-badge" style="border-color: var(--secondary); color: var(--secondary);">MoE SUB-NETWORK</span>
        <span style="font-size: 11px; color: var(--success); margin-left: 8px;">${expert.active ? 'ACTIVE ROUTING' : 'IDLE / SPECULATIVE'}</span>
      </div>
      <p style="font-size: 11.5px; color: #D1D5DB; line-height: 1.4;">
        Dynamic routing token dispatch active for specialized tasks: <strong>${expert.expertName}</strong>. Gated via 16-expert top-4 sparse MoE architecture keeping inference compute under 38B active parameters.
      </p>
    `;

    drawer.style.display = 'block';
  }

  onHubHover(hub) {
    if (hub) {
      this.updateTelemetry(hub);
    }
  }

  // --- Bind Event Listeners ---
  bindEvents() {
    // Next / Prev Buttons
    const prevBtn = document.getElementById('btn-prev-slide');
    const nextBtn = document.getElementById('btn-next-slide');

    if (prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); this.prevSlide(); };
    if (nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); this.nextSlide(); };

    // Slide Dots
    document.querySelectorAll('.slide-dot').forEach((dot) => {
      dot.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(dot.getAttribute('data-dot-index'), 10);
        this.goToSlide(idx);
      };
    });

    // Camera Preset Buttons
    document.querySelectorAll('.camera-btn[data-cam]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const cam = btn.getAttribute('data-cam');
        if (this.visualizer) {
          this.visualizer.setPerspective(cam);
          this.updateCameraButtons(cam);
        }
      };
    });

    // Quick Hub Fly-To Chips
    document.querySelectorAll('.hub-chip-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const hubId = btn.getAttribute('data-hub');
        const hub = this.data.globalHubs.find(h => h.id === hubId);
        if (hub) {
          this.showHubDetail(hub);
        }
      };
    });

    // 3D Stage Tool Buttons
    document.getElementById('btn-zoom-in')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.visualizer) this.visualizer.zoomIn();
    });

    document.getElementById('btn-zoom-out')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.visualizer) this.visualizer.zoomOut();
    });

    document.getElementById('btn-reset-cam')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.visualizer) this.visualizer.resetCamera();
    });

    const rotateBtn = document.getElementById('btn-toggle-rotate');
    if (rotateBtn) {
      rotateBtn.onclick = (e) => {
        e.stopPropagation();
        if (this.visualizer) {
          const isRotating = this.visualizer.toggleAutoRotate();
          rotateBtn.classList.toggle('active', isRotating);
        }
      };
    }

    // Presenter Mode Toggle
    const presBtn = document.getElementById('btn-toggle-presenter');
    if (presBtn) presBtn.onclick = (e) => { e.stopPropagation(); this.togglePresenterMode(); };

    // Palette Selector
    document.querySelectorAll('.palette-option-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const pal = btn.getAttribute('data-palette');
        this.switchPalette(pal);
      };
    });

    // Drawer Close
    const closeDrawerBtn = document.getElementById('drawer-close-btn');
    if (closeDrawerBtn) {
      closeDrawerBtn.onclick = (e) => {
        e.stopPropagation();
        const drawer = document.getElementById('detail-drawer');
        if (drawer) drawer.style.display = 'none';
      };
    }

    // Shortcuts Modal
    const shortBtn = document.getElementById('btn-shortcuts-toggle');
    if (shortBtn) {
      shortBtn.onclick = (e) => {
        e.stopPropagation();
        const m = document.getElementById('shortcuts-modal');
        if (m) m.style.display = m.style.display === 'block' ? 'none' : 'block';
      };
    }

    const shortClose = document.getElementById('shortcuts-close-btn');
    if (shortClose) {
      shortClose.onclick = (e) => {
        e.stopPropagation();
        const m = document.getElementById('shortcuts-modal');
        if (m) m.style.display = 'none';
      };
    }

    // Fullscreen Toggle
    const fsBtn = document.getElementById('btn-fullscreen-toggle');
    if (fsBtn) {
      fsBtn.onclick = (e) => {
        e.stopPropagation();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      };
    }

    // Global Keyboard Shortcuts
    window.onkeydown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          this.nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          this.prevSlide();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          const idx = parseInt(e.key, 10) - 1;
          this.goToSlide(idx);
          break;
        case 'p':
        case 'P':
          this.togglePresenterMode();
          break;
        case 'f':
        case 'F':
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
          break;
        case '+':
        case '=':
          if (this.visualizer) this.visualizer.zoomIn();
          break;
        case '-':
        case '_':
          if (this.visualizer) this.visualizer.zoomOut();
          break;
        case '?':
          const modal = document.getElementById('shortcuts-modal');
          if (modal) modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
          break;
        case 'h':
        case 'H':
          window.location.href = '../index.html';
          break;
        case 'Escape':
          const m = document.getElementById('shortcuts-modal');
          const d = document.getElementById('detail-drawer');
          if (m && m.style.display === 'block') {
            m.style.display = 'none';
          } else if (d && d.style.display === 'block') {
            d.style.display = 'none';
          } else {
            window.location.href = '../index.html';
          }
          break;
      }
    };
  }
}

// Global start
window.addEventListener('DOMContentLoaded', () => {
  window.app = new PresentationApp();
});
