// World State of AI (2026 Edition) - SVG Scientific Chart Generator
// Dense Card Fitting: Zero Wasted Space, Responsive ViewBoxes, Rich Neon Aesthetics

export class InfographicCharts {
  constructor(palette) {
    this.palette = palette || {
      accent: "#00F0FF",
      highlight: "#785EF0",
      warning: "#FFB000",
      success: "#00F5A0",
      text: "#F0F6FC",
      textMuted: "#8B949E",
      cardBg: "rgba(13, 20, 36, 0.85)"
    };
  }

  setPalette(palette) {
    this.palette = palette;
  }

  // --- 1. SVG Radar Chart (Benchmark Capabilities - Fits Card Perfectly) ---
  createRadarChart(containerId, metrics, width = 340, height = 180) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const numAxes = metrics.length;
    const cx = width / 2;
    const cy = height / 2 + 4;
    const radius = Math.min(width / 2 - 58, height / 2 - 18);
    const angleSlice = (Math.PI * 2) / numAxes;

    // Build Web Rings
    let webRings = '';
    const levels = 4;
    for (let l = 1; l <= levels; l++) {
      const r = (radius / levels) * l;
      let points = [];
      for (let a = 0; a < numAxes; a++) {
        const angle = a * angleSlice - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        points.push(`${x},${y}`);
      }
      webRings += `<polygon points="${points.join(' ')}" fill="${l === levels ? 'rgba(0, 240, 255, 0.03)' : 'none'}" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1"/>`;
    }

    // Build Axis Spokes & Labels
    let spokes = '';
    let labels = '';
    for (let a = 0; a < numAxes; a++) {
      const angle = a * angleSlice - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      spokes += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(255, 255, 255, 0.18)" stroke-dasharray="2,2"/>`;

      const lx = cx + (radius + 16) * Math.cos(angle);
      const ly = cy + (radius + 16) * Math.sin(angle);
      const textAnchor = Math.abs(angle + Math.PI/2) < 0.1 ? 'middle' : (lx > cx ? 'start' : 'end');
      const shortAxis = metrics[a].axis.split('(')[0].trim();
      labels += `<text x="${lx}" y="${ly + 3.5}" fill="${this.palette.textMuted}" font-size="8.5" font-family="'Outfit', sans-serif" font-weight="600" text-anchor="${textAnchor}">${shortAxis}</text>`;
    }

    // Closed, Open, and Human PhD Polygons
    const closedPoints = metrics.map((m, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const r = (m.closedScore / 100) * radius;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');

    const openPoints = metrics.map((m, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const r = (m.openScore / 100) * radius;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');

    const humanPoints = metrics.map((m, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const r = (m.baselineHuman / 100) * radius;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');

    const svg = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
        <g>
          ${webRings}
          ${spokes}
          <polygon points="${humanPoints}" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.45)" stroke-width="1.2" stroke-dasharray="3,3"/>
          <polygon points="${openPoints}" fill="rgba(120, 94, 240, 0.3)" stroke="${this.palette.highlight}" stroke-width="2.2"/>
          <polygon points="${closedPoints}" fill="rgba(0, 240, 255, 0.32)" stroke="${this.palette.accent}" stroke-width="2.4"/>
          ${labels}
        </g>
      </svg>
    `;

    container.innerHTML = svg;
  }

  // --- 2. SVG Pareto Scatter Plot (Intelligence vs Cost - Full Card Width) ---
  createParetoPlot(containerId, points, width = 340, height = 180) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const pad = { top: 12, right: 18, bottom: 22, left: 32 };
    const w = width - pad.left - pad.right;
    const h = height - pad.top - pad.bottom;

    const minScore = 65, maxScore = 100;
    const minCost = 0.01, maxCost = 25.0;

    const mapX = (cost) => {
      const logMin = Math.log10(minCost);
      const logMax = Math.log10(maxCost);
      const logVal = Math.log10(cost);
      return pad.left + ((logVal - logMin) / (logMax - logMin)) * w;
    };

    const mapY = (score) => {
      return pad.top + h - ((score - minScore) / (maxScore - minScore)) * h;
    };

    // Grid lines
    let grid = '';
    [70, 80, 90, 100].forEach(score => {
      const y = mapY(score);
      grid += `<line x1="${pad.left}" y1="${y}" x2="${pad.left + w}" y2="${y}" stroke="rgba(255, 255, 255, 0.08)"/>`;
      grid += `<text x="${pad.left - 5}" y="${y + 3}" fill="${this.palette.textMuted}" font-size="8" font-family="'Orbitron', monospace" text-anchor="end">${score}</text>`;
    });

    [0.1, 1.0, 10.0].forEach(cost => {
      const x = mapX(cost);
      grid += `<line x1="${x}" y1="${pad.top}" x2="${x}" y2="${pad.top + h}" stroke="rgba(255, 255, 255, 0.08)"/>`;
      grid += `<text x="${x}" y="${pad.top + h + 13}" fill="${this.palette.textMuted}" font-size="8" font-family="'Orbitron', monospace" text-anchor="middle">$${cost}</text>`;
    });

    // Plot Points & Labels
    let circles = '';
    points.forEach(p => {
      const cx = mapX(p.costPerM);
      const cy = mapY(p.score);
      let color = this.palette.accent;
      if (p.type === 'open') color = this.palette.highlight;
      if (p.type === 'local') color = this.palette.success;
      if (p.type === 'legacy') color = '#6B7280';

      const shortName = p.model.split('(')[0].trim();
      circles += `
        <g>
          <circle cx="${cx}" cy="${cy}" r="${p.size * 0.5}" fill="${color}" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="1.2"/>
          <text x="${cx + 8}" y="${cy - 3}" fill="#FFFFFF" font-size="8.5" font-family="'Outfit', sans-serif" font-weight="700">${shortName}</text>
        </g>
      `;
    });

    const svg = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
        <g>
          ${grid}
          <line x1="${pad.left}" y1="${pad.top + h}" x2="${pad.left + w}" y2="${pad.top + h}" stroke="rgba(255,255,255,0.2)"/>
          <line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + h}" stroke="rgba(255,255,255,0.2)"/>
          ${circles}
        </g>
      </svg>
    `;

    container.innerHTML = svg;
  }

  // --- 3. SVG Open-Closed Lag Timeline (Zero Empty Space) ---
  createGapEvolutionPlot(containerId, width = 340, height = 180) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const pad = { top: 16, right: 20, bottom: 22, left: 32 };
    const w = width - pad.left - pad.right;
    const h = height - pad.top - pad.bottom;

    const data = [
      { quarter: "23-Q1", lagMonths: 18.5, milestone: "LLaMA 1" },
      { quarter: "23-Q3", lagMonths: 14.2, milestone: "Llama 2" },
      { quarter: "24-Q2", lagMonths: 8.6, milestone: "Llama 3" },
      { quarter: "25-Q1", lagMonths: 4.1, milestone: "DeepSeek-R1" },
      { quarter: "26-Q3", lagMonths: 2.4, milestone: "Frontier MoA" }
    ];

    const maxLag = 20;
    const numPoints = data.length;

    const mapX = (i) => pad.left + (i / (numPoints - 1)) * w;
    const mapY = (lag) => pad.top + h - (lag / maxLag) * h;

    // Grid lines
    let grid = '';
    [0, 5, 10, 15, 20].forEach(lag => {
      const y = mapY(lag);
      grid += `<line x1="${pad.left}" y1="${y}" x2="${pad.left + w}" y2="${y}" stroke="rgba(255, 255, 255, 0.08)"/>`;
      grid += `<text x="${pad.left - 5}" y="${y + 3}" fill="${this.palette.textMuted}" font-size="8" font-family="'Orbitron', monospace" text-anchor="end">${lag}m</text>`;
    });

    // Area and Line path
    let pathD = `M ${mapX(0)} ${mapY(data[0].lagMonths)}`;
    let areaD = `M ${mapX(0)} ${pad.top + h} L ${mapX(0)} ${mapY(data[0].lagMonths)}`;

    for (let i = 1; i < numPoints; i++) {
      const x = mapX(i);
      const y = mapY(data[i].lagMonths);
      pathD += ` L ${x} ${y}`;
      areaD += ` L ${x} ${y}`;
    }
    areaD += ` L ${mapX(numPoints - 1)} ${pad.top + h} Z`;

    // Markers and Labels
    let markers = '';
    data.forEach((d, i) => {
      const x = mapX(i);
      const y = mapY(d.lagMonths);
      markers += `
        <circle cx="${x}" cy="${y}" r="4.5" fill="${this.palette.accent}" stroke="#FFFFFF" stroke-width="1.5"/>
        <text x="${x}" y="${y - 8}" fill="#FFFFFF" font-size="8.5" font-family="'Orbitron', monospace" font-weight="700" text-anchor="middle">${d.lagMonths}mo</text>
        <text x="${x}" y="${pad.top + h + 13}" fill="${this.palette.textMuted}" font-size="8" font-family="'Outfit', sans-serif" text-anchor="middle">${d.quarter}</text>
      `;
    });

    const svg = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="gapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#00F0FF" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#785EF0" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <g>
          ${grid}
          <path d="${areaD}" fill="url(#gapGradient)"/>
          <path d="${pathD}" fill="none" stroke="${this.palette.accent}" stroke-width="2.6"/>
          ${markers}
        </g>
      </svg>
    `;

    container.innerHTML = svg;
  }

  // --- 4. SVG Test-Time Compute Scaling Curve (Zero Empty Space) ---
  createInferenceScalingPlot(containerId, width = 340, height = 180) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const pad = { top: 16, right: 20, bottom: 22, left: 32 };
    const w = width - pad.left - pad.right;
    const h = height - pad.top - pad.bottom;

    const scalingPoints = [
      { tokens: "Direct (1)", accuracy: 68.4, label: "Zero-Shot" },
      { tokens: "100", accuracy: 79.2, label: "Short CoT" },
      { tokens: "1k", accuracy: 89.6, label: "MCTS" },
      { tokens: "5k", accuracy: 94.8, label: "PRM" },
      { tokens: "10k+", accuracy: 97.1, label: "Proof" }
    ];

    const minAcc = 60, maxAcc = 100;
    const numPoints = scalingPoints.length;

    const mapX = (i) => pad.left + (i / (numPoints - 1)) * w;
    const mapY = (acc) => pad.top + h - ((acc - minAcc) / (maxAcc - minAcc)) * h;

    // Grid lines
    let grid = '';
    [60, 70, 80, 90, 100].forEach(acc => {
      const y = mapY(acc);
      grid += `<line x1="${pad.left}" y1="${y}" x2="${pad.left + w}" y2="${y}" stroke="rgba(255, 255, 255, 0.08)"/>`;
      grid += `<text x="${pad.left - 5}" y="${y + 3}" fill="${this.palette.textMuted}" font-size="8" font-family="'Orbitron', monospace" text-anchor="end">${acc}%</text>`;
    });

    // Spline Curve Path
    let pathD = `M ${mapX(0)} ${mapY(scalingPoints[0].accuracy)}`;
    let areaD = `M ${mapX(0)} ${pad.top + h} L ${mapX(0)} ${mapY(scalingPoints[0].accuracy)}`;

    for (let i = 1; i < numPoints; i++) {
      const prevX = mapX(i - 1);
      const prevY = mapY(scalingPoints[i - 1].accuracy);
      const currX = mapX(i);
      const currY = mapY(scalingPoints[i].accuracy);
      const cpx = prevX + (currX - prevX) * 0.5;

      pathD += ` C ${cpx} ${prevY}, ${cpx} ${currY}, ${currX} ${currY}`;
      areaD += ` C ${cpx} ${prevY}, ${cpx} ${currY}, ${currX} ${currY}`;
    }
    areaD += ` L ${mapX(numPoints - 1)} ${pad.top + h} Z`;

    // Markers and Labels
    let markers = '';
    scalingPoints.forEach((d, i) => {
      const x = mapX(i);
      const y = mapY(d.accuracy);
      markers += `
        <circle cx="${x}" cy="${y}" r="4.5" fill="${this.palette.success}" stroke="#FFFFFF" stroke-width="1.5"/>
        <text x="${x}" y="${y - 8}" fill="${this.palette.success}" font-size="8.5" font-family="'Orbitron', monospace" font-weight="700" text-anchor="middle">${d.accuracy}%</text>
        <text x="${x}" y="${pad.top + h + 13}" fill="${this.palette.textMuted}" font-size="8" font-family="'Outfit', sans-serif" text-anchor="middle">${d.tokens}</text>
      `;
    });

    const svg = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="scalingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#00F5A0" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#785EF0" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <g>
          ${grid}
          <path d="${areaD}" fill="url(#scalingGradient)"/>
          <path d="${pathD}" fill="none" stroke="${this.palette.success}" stroke-width="2.6"/>
          ${markers}
        </g>
      </svg>
    `;

    container.innerHTML = svg;
  }

  // --- 5. Regional Capacity Progress Bars ---
  createCapacityBars(containerId, regionalData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '<div class="regional-bars-list">';
    regionalData.forEach(item => {
      html += `
        <div class="regional-bar-item">
          <div class="bar-header">
            <span>${item.region}</span>
            <div class="region-metrics">
              <span class="region-gw">${item.capacityGW} GW (${item.share}%)</span>
              <span class="region-growth">${item.growth}</span>
            </div>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${item.share * 2}%"></div>
          </div>
          <div class="region-silicon-note">${item.silicon}</div>
        </div>
      `;
    });
    html += '</div>';

    container.innerHTML = html;
  }

  // --- 6. Clean Energy Mix Grid ---
  createEnergyBreakdown(containerId, energyData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '<div class="energy-cards-grid">';
    energyData.forEach(item => {
      html += `
        <div class="glassmorphism-subcard energy-card">
          <div class="energy-top">
            <span class="energy-pct" style="color: ${item.color};">${item.percentage}%</span>
            <span class="energy-source-title">${item.source}</span>
          </div>
          <div class="energy-note">${item.note}</div>
        </div>
      `;
    });
    html += '</div>';

    container.innerHTML = html;
  }
}
