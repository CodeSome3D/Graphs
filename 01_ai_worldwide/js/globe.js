// High Performance Three.js 3D Visualizer: Holographic Earth & Neural MoE Engine
// Real Geographic Continent Shapes (Masked from user map), Artifact-Free Beacons, Jitter-Free Collision

import { continentPoints } from './continent_points.js';

export class HolographicVisualizer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.THREE = window.THREE;
    this.options = Object.assign({
      radius: 36,
      onHubSelect: null,
      onHubHover: null,
      onExpertSelect: null,
      onTelemetryUpdate: null
    }, options);

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globeGroup = null;
    this.neuralGroup = null;
    this.satellitesGroup = null;
    this.beacons = [];
    this.collisionMeshes = [];
    this.shockwaves = [];
    this.arcs = [];
    this.arcPulses = [];
    this.satelliteObjects = [];
    this.expertNodes = [];
    this.currentMode = 'globe'; // 'globe' or 'neural'
    
    this.targetCameraPos = null;
    this.targetLookAt = null;
    this.cameraDistance = 92;
    this.minDistance = 50;
    this.maxDistance = 180;

    this.isUserInteracting = false;
    this.autoRotate = true;
    this.autoRotateSpeed = 0.0016;
    this.rotVelocityX = 0;
    this.rotVelocityY = 0;
    this.raycaster = null;
    this.mouse = null;
    this.hoveredBeacon = null;
    this.hoveredExpert = null;

    if (this.THREE) {
      this.init();
    } else {
      console.error("Three.js not available in global window context");
    }
  }

  // --- Generate Soft Glowing Circular Particle Texture ---
  createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.45, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.35)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();

    const texture = new this.THREE.CanvasTexture(canvas);
    return texture;
  }

  // --- Generate Radial Contact Disc Texture (Artifact-free, no Z-fighting) ---
  createContactDiscTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Outer soft glow ring
    const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.95)');
    grad.addColorStop(0.35, 'rgba(0, 240, 255, 0.6)');
    grad.addColorStop(0.7, 'rgba(0, 240, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0.0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fill();

    // Solid inner core
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.arc(64, 64, 8, 0, Math.PI * 2);
    ctx.fill();

    const texture = new this.THREE.CanvasTexture(canvas);
    return texture;
  }

  init() {
    const THREE = this.THREE;

    this.targetCameraPos = new THREE.Vector3(0, 18, this.cameraDistance);
    this.targetLookAt = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);

    this.globeGroup = new THREE.Group();
    this.neuralGroup = new THREE.Group();
    this.satellitesGroup = new THREE.Group();

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060913, 0.0035);

    // 2. Camera
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 600;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 18, this.cameraDistance);
    this.camera.lookAt(0, 0, 0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x5a7aa8, 2.0);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 3.4);
    dirLight1.position.set(120, 80, 100);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x785ef0, 2.8);
    dirLight2.position.set(-120, -50, -80);
    this.scene.add(dirLight2);

    // 5. Build Sub-systems
    this.buildStarfield();
    this.buildHolographicGlobe();
    this.buildSatellitesConstellation();
    this.buildNeuralMoEScene();

    this.globeGroup.add(this.satellitesGroup);
    this.scene.add(this.globeGroup);
    this.scene.add(this.neuralGroup);
    this.neuralGroup.visible = false;

    // 6. Bind events
    this.bindEvents();

    // 7. Start render loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // --- Background Starfield ---
  buildStarfield() {
    const THREE = this.THREE;
    const count = 1600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 110 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const isCyan = Math.random() > 0.45;
      const isGold = Math.random() > 0.85;
      if (isGold) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.72; colors[i * 3 + 2] = 0.0;
      } else if (isCyan) {
        colors[i * 3] = 0.0; colors[i * 3 + 1] = 0.94; colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 0.47; colors[i * 3 + 1] = 0.37; colors[i * 3 + 2] = 0.94;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.4,
      map: this.createCircleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.starfield = new THREE.Points(geometry, material);
    this.scene.add(this.starfield);
  }

  // --- Holographic Globe with Real Continental Shapes ---
  buildHolographicGlobe() {
    const THREE = this.THREE;
    const R = this.options.radius;

    // 1. Dark Glass Core
    const innerGeo = new THREE.SphereGeometry(R * 0.985, 48, 48);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x050914,
      roughness: 0.65,
      metalness: 0.35,
      transparent: true,
      opacity: 0.94
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    this.globeGroup.add(innerSphere);

    // 2. Latitude/Longitude Grid
    const wireGeo = new THREE.SphereGeometry(R, 36, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x143050,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    this.globeGroup.add(wireSphere);

    // 3. Dense Digital Continent Point Cloud (Exact shapes from Desenio map)
    this.buildContinentDots();

    // 4. Volumetric Atmosphere Rim Shader
    const glowGeo = new THREE.SphereGeometry(R * 1.15, 36, 36);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
          gl_FragColor = vec4(0.0, 0.94, 1.0, 1.0) * intensity * 0.75;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosphere = new THREE.Mesh(glowGeo, glowMat);
    this.globeGroup.add(atmosphere);

    // 5. Equatorial AI Data Ring
    const ringGeo = new THREE.RingGeometry(R * 1.32, R * 1.42, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI * 0.38;
    this.globeGroup.add(ringMesh);
    this.equatorialRing = ringMesh;
  }

  // Real Continental Point Cloud (29,000+ points sampled from real map)
  buildContinentDots() {
    const THREE = this.THREE;
    const positions = new Float32Array(continentPoints);
    const count = positions.length / 3;
    const colors = new Float32Array(positions.length);

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];

      const isHub = (x < -10 && x > -30 && y > 15 && z > 15) || (x > 10 && x > 20 && y > 10);
      if (isHub) {
        colors[i * 3] = 0.0; colors[i * 3 + 1] = 0.96; colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 0.22; colors[i * 3 + 1] = 0.48; colors[i * 3 + 2] = 0.82;
      }
    }

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    dotGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const dotMat = new THREE.PointsMaterial({
      size: 0.72, // 2x smaller round dots
      map: this.createCircleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.96,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const dotCloud = new THREE.Points(dotGeo, dotMat);
    this.globeGroup.add(dotCloud);
  }

  latLonToVector3(lat, lon, radius = this.options.radius) {
    const THREE = this.THREE;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }

  // --- Orbital AI Satellites Constellation ---
  buildSatellitesConstellation() {
    const THREE = this.THREE;
    const R = this.options.radius * 1.28;
    const satCount = 18;

    for (let i = 0; i < satCount; i++) {
      const satGroup = new THREE.Group();
      
      const bodyGeo = new THREE.BoxGeometry(0.7, 0.35, 0.35);
      const bodyMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      satGroup.add(body);

      const wingGeo = new THREE.PlaneGeometry(1.5, 0.45);
      const wingMat = new THREE.MeshBasicMaterial({
        color: 0x785ef0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const wing = new THREE.Mesh(wingGeo, wingMat);
      wing.rotation.x = Math.PI / 2;
      satGroup.add(wing);

      this.satellitesGroup.add(satGroup);

      this.satelliteObjects.push({
        group: satGroup,
        orbitRadius: R + (i % 3) * 3,
        speed: 0.0035 + (i % 4) * 0.001,
        angle: (i / satCount) * Math.PI * 2,
        inclination: (i % 2 === 0 ? 0.45 : -0.55) + Math.random() * 0.2
      });
    }
  }

  // --- 3D Billboard Sprite Label ---
  createBillboardSprite(text, subtext, color = '#00f0ff') {
    const THREE = this.THREE;
    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 130;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(10, 16, 32, 0.90)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(6, 6, 348, 118, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, 180, 52);

    ctx.fillStyle = color;
    ctx.font = 'bold 21px "Orbitron", monospace';
    ctx.fillText(subtext, 180, 92);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(5.2, 1.9, 1);
    return sprite;
  }

  // --- Populate Global AI Hubs (Artifact-Free, 2x Shorter, Zero Jitter) ---
  populateHubs(hubsData) {
    const THREE = this.THREE;
    const R = this.options.radius;
    const discTexture = this.createContactDiscTexture();

    hubsData.forEach((hub) => {
      // Elevate slightly above globe surface to 100% prevent Z-fighting!
      const pos = this.latLonToVector3(hub.lat, hub.lon, R * 1.008);

      const hubGroup = new THREE.Group();
      hubGroup.position.copy(pos);
      hubGroup.lookAt(pos.clone().multiplyScalar(2)); // Local +Z points outward

      // 1. Single Clean High-Tech Glowing Contact Disc (No Z-fighting!)
      const discGeo = new THREE.PlaneGeometry(5.2, 5.2);
      const discMat = new THREE.MeshBasicMaterial({
        map: discTexture,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        polygonOffset: true,
        polygonOffsetFactor: -1.0,
        polygonOffsetUnits: -4.0
      });
      const disc = new THREE.Mesh(discGeo, discMat);
      hubGroup.add(disc);

      // 2. Animated Expanding Shockwave Ring (Single clean mesh above surface)
      const shockGeo = new THREE.RingGeometry(1.2, 1.6, 32);
      const shockMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const shockMesh = new THREE.Mesh(shockGeo, shockMat);
      shockMesh.position.set(0, 0, 0.05);
      hubGroup.add(shockMesh);
      this.shockwaves.push({
        mesh: shockMesh,
        scale: 1.0,
        speed: 0.02 + Math.random() * 0.01
      });

      // 3. 2x Shorter Antenna Pillar (Extending straight out along local +Z)
      const height = 2.0 + (hub.capacityGW || 1) * 0.6;
      const pillarGeo = new THREE.CylinderGeometry(0.12, 0.22, height, 12);
      pillarGeo.translate(0, height / 2, 0);
      pillarGeo.rotateX(Math.PI / 2); // Align with local +Z

      const pillarMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      hubGroup.add(pillar);

      // 4. Glowing Beacon Tip Sphere
      const tipGeo = new THREE.SphereGeometry(0.48, 16, 16);
      const tipMat = new THREE.MeshBasicMaterial({
        color: 0xff007a,
        blending: THREE.AdditiveBlending
      });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.set(0, 0, height);
      hubGroup.add(tip);

      // 5. Floating 3D Billboard Sprite Label (Elevated above tip so it NEVER overlaps)
      const shortName = hub.name.split('&')[0].split('-')[0].trim();
      const labelSprite = this.createBillboardSprite(shortName, `${hub.capacityGW} GW // ${hub.share}%`, '#00f0ff');
      labelSprite.position.set(0, 0, height + 3.6);
      hubGroup.add(labelSprite);

      // 6. Dedicated Fixed Collision Sphere (Zero Jitter Raycasting)
      const colGeo = new THREE.SphereGeometry(4.2, 12, 12);
      const colMat = new THREE.MeshBasicMaterial({ visible: false });
      const collisionMesh = new THREE.Mesh(colGeo, colMat);
      collisionMesh.position.set(0, 0, height / 2);
      hubGroup.add(collisionMesh);

      collisionMesh.userData = {
        hubData: hub,
        isBeaconCollision: true,
        parentGroup: hubGroup,
        tipMesh: tip,
        pillarMesh: pillar,
        labelSprite: labelSprite,
        discMesh: disc
      };

      this.collisionMeshes.push(collisionMesh);

      hubGroup.userData = {
        hubData: hub,
        isBeacon: true,
        tipMesh: tip,
        pillarMesh: pillar,
        labelSprite: labelSprite,
        discMesh: disc
      };

      this.globeGroup.add(hubGroup);
      this.beacons.push(hubGroup);
    });
  }

  // --- Populate Intercontinental AI Fiber Arcs ---
  populateArcs(arcsData, hubsData) {
    const THREE = this.THREE;
    const hubMap = new Map(hubsData.map(h => [h.id, h]));
    const R = this.options.radius;

    arcsData.forEach((arc) => {
      const fromHub = hubMap.get(arc.from);
      const toHub = hubMap.get(arc.to);
      if (!fromHub || !toHub) return;

      const v1 = this.latLonToVector3(fromHub.lat, fromHub.lon, R * 1.01);
      const v2 = this.latLonToVector3(toHub.lat, toHub.lon, R * 1.01);

      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const distance = v1.distanceTo(v2);
      const elevation = R + distance * 0.32;
      mid.normalize().multiplyScalar(elevation);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(60);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      const arcMat = new THREE.LineBasicMaterial({
        color: 0x648fff,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      });

      const arcLine = new THREE.Line(arcGeo, arcMat);
      this.globeGroup.add(arcLine);
      this.arcs.push(arcLine);

      // High-speed photon particle packet
      const pulseGeo = new THREE.SphereGeometry(0.55, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        blending: THREE.AdditiveBlending
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      this.globeGroup.add(pulseMesh);

      this.arcPulses.push({
        mesh: pulseMesh,
        curve: curve,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.003
      });
    });
  }

  // --- 3D Neural MoE Architecture Scene ---
  buildNeuralMoEScene() {
    const THREE = this.THREE;

    // Central Gating Dispatcher Core
    const centerGeo = new THREE.IcosahedronGeometry(6.5, 2);
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0072b2,
      wireframe: true,
      roughness: 0.2
    });
    this.moeCenter = new THREE.Mesh(centerGeo, centerMat);
    this.neuralGroup.add(this.moeCenter);

    const coreGeo = new THREE.SphereGeometry(4.0, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffb000,
      blending: THREE.AdditiveBlending
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    this.moeCenter.add(core);

    // 16 Specialized Expert Nodes
    const expertNames = [
      "Code Synthesis", "PRM Verifier", "Formal Math", "Spatial 3D",
      "Multimodal Audio", "Context RAG", "Causal Logic", "Safety Filter",
      "Refusal Gating", "Speculative Drafting", "Tool Planner", "Memory KV",
      "Physics Sim", "Bio Chemist", "API Router", "Self-Play Critic"
    ];

    const numExperts = 16;
    for (let i = 0; i < numExperts; i++) {
      const angle = (i / numExperts) * Math.PI * 2;
      const ringRadius = 26 + (i % 2 === 0 ? 4 : -4);
      const yOffset = Math.sin(i * 1.5) * 8;

      const x = Math.cos(angle) * ringRadius;
      const z = Math.sin(angle) * ringRadius;
      const y = yOffset;

      const expGeo = new THREE.DodecahedronGeometry(2.5, 1);
      const isHighlighted = i < 4;
      const expColor = isHighlighted ? 0x00f5a0 : 0x785ef0;

      const expMat = new THREE.MeshStandardMaterial({
        color: expColor,
        emissive: isHighlighted ? 0x00a060 : 0x2a1a70,
        wireframe: false,
        roughness: 0.3
      });
      const expMesh = new THREE.Mesh(expGeo, expMat);
      expMesh.position.set(x, y, z);
      expMesh.userData = {
        isExpert: true,
        expertName: expertNames[i],
        active: isHighlighted
      };
      this.neuralGroup.add(expMesh);

      // Synaptic lines
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z)
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: isHighlighted ? 0x00f0ff : 0x3a4a75,
        transparent: true,
        opacity: isHighlighted ? 0.85 : 0.25,
        blending: THREE.AdditiveBlending
      });
      const line = new THREE.Line(lineGeo, lineMat);
      this.neuralGroup.add(line);

      this.expertNodes.push({
        mesh: expMesh,
        name: expertNames[i],
        active: isHighlighted,
        origPos: new THREE.Vector3(x, y, z)
      });
    }

    // Outer Ring
    const tensorRing1 = new THREE.RingGeometry(36, 37.5, 48);
    const tensorMat = new THREE.MeshBasicMaterial({
      color: 0x785ef0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });
    const tMesh1 = new THREE.Mesh(tensorRing1, tensorMat);
    tMesh1.rotation.x = Math.PI * 0.5;
    this.neuralGroup.add(tMesh1);
    this.tensorRing = tMesh1;
  }

  // --- Mode Switching ---
  setMode(modeName) {
    if (modeName === 'neural') {
      this.currentMode = 'neural';
      this.globeGroup.visible = false;
      this.neuralGroup.visible = true;
      this.targetCameraPos.set(0, 16, 75);
    } else {
      this.currentMode = 'globe';
      this.globeGroup.visible = true;
      this.neuralGroup.visible = false;
      this.targetCameraPos.set(0, 18, this.cameraDistance);
    }
  }

  // --- Zoom Controls ---
  zoomIn() {
    this.cameraDistance = Math.max(this.minDistance, this.cameraDistance - 15);
    this.targetCameraPos.setLength(this.cameraDistance);
  }

  zoomOut() {
    this.cameraDistance = Math.min(this.maxDistance, this.cameraDistance + 15);
    this.targetCameraPos.setLength(this.cameraDistance);
  }

  resetCamera() {
    this.cameraDistance = 92;
    this.targetCameraPos.set(0, 18, this.cameraDistance);
    this.targetLookAt.set(0, 0, 0);
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
    return this.autoRotate;
  }

  // --- Camera Navigation Presets ---
  focusHub(hubId) {
    if (this.currentMode !== 'globe') {
      this.setMode('globe');
    }

    const beacon = this.beacons.find(b => b.userData.hubData.id === hubId);
    if (!beacon) return;

    const hub = beacon.userData.hubData;
    if (hub.cameraPos) {
      this.targetCameraPos.set(hub.cameraPos.x * 0.82, hub.cameraPos.y * 0.82, hub.cameraPos.z * 0.82);
    }

    if (beacon.userData.tipMesh) {
      beacon.userData.tipMesh.scale.set(1.8, 1.8, 1.8);
      setTimeout(() => {
        if (beacon.userData.tipMesh) beacon.userData.tipMesh.scale.set(1, 1, 1);
      }, 1000);
    }

    if (this.options.onTelemetryUpdate) {
      this.options.onTelemetryUpdate(hub);
    }
  }

  setPerspective(preset) {
    if (preset === 'neural') {
      this.setMode('neural');
      return;
    }

    this.setMode('globe');
    switch (preset) {
      case 'us':
        this.targetCameraPos.set(-85, 60, 115);
        break;
      case 'europe':
        this.targetCameraPos.set(25, 75, 128);
        break;
      case 'asia':
        this.targetCameraPos.set(125, 45, 90);
        break;
      case 'global':
      default:
        this.targetCameraPos.set(0, 18, this.cameraDistance);
        break;
    }
  }

  // --- Interaction & Orbit Dragging ---
  bindEvents() {
    window.addEventListener('resize', () => this.onWindowResize());

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (clientX, clientY) => {
      isDragging = true;
      prevMouseX = clientX;
      prevMouseY = clientY;
      this.isUserInteracting = true;
      this.rotVelocityX = 0;
      this.rotVelocityY = 0;
    };

    const onMouseMove = (clientX, clientY) => {
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        prevMouseX = clientX;
        prevMouseY = clientY;

        this.rotVelocityY = deltaX * 0.005;
        this.rotVelocityX = deltaY * 0.005;

        if (this.currentMode === 'globe') {
          this.globeGroup.rotation.y += this.rotVelocityY;
          this.globeGroup.rotation.x += this.rotVelocityX;
        } else {
          this.neuralGroup.rotation.y += this.rotVelocityY;
          this.neuralGroup.rotation.x += this.rotVelocityX;
        }
      } else {
        this.checkRaycastHover();
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => { this.isUserInteracting = false; }, 2500);
    };

    this.container.addEventListener('mousedown', (e) => onMouseDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onMouseMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', () => onMouseUp());

    this.container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) onMouseDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) onMouseMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchend', () => onMouseUp());

    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.cameraDistance = Math.max(this.minDistance, Math.min(this.maxDistance, this.cameraDistance + e.deltaY * 0.08));
      this.targetCameraPos.setLength(this.cameraDistance);
    }, { passive: false });

    this.container.addEventListener('click', (e) => {
      if (this.currentMode === 'globe' && this.hoveredBeacon && this.options.onHubSelect) {
        this.options.onHubSelect(this.hoveredBeacon.userData.hubData);
      } else if (this.currentMode === 'neural' && this.hoveredExpert && this.options.onExpertSelect) {
        this.options.onExpertSelect(this.hoveredExpert.userData);
      }
    });
  }

  // Jitter-Free Raycasting with Fixed Collision Meshes
  checkRaycastHover() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.currentMode === 'globe') {
      const intersects = this.raycaster.intersectObjects(this.collisionMeshes, false);
      if (intersects.length > 0) {
        const colMesh = intersects[0].object;
        const targetGroup = colMesh.userData.parentGroup;

        if (targetGroup && this.hoveredBeacon !== targetGroup) {
          this.resetBeaconHover();
          this.hoveredBeacon = targetGroup;
          if (targetGroup.userData.tipMesh) {
            targetGroup.userData.tipMesh.scale.set(1.5, 1.5, 1.5);
          }
          this.container.style.cursor = 'pointer';
          if (this.options.onHubHover) this.options.onHubHover(targetGroup.userData.hubData);
        }
        return;
      }
      this.resetBeaconHover();
    } else {
      const expertMeshes = this.expertNodes.map(n => n.mesh);
      const intersects = this.raycaster.intersectObjects(expertMeshes);
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (this.hoveredExpert !== obj) {
          if (this.hoveredExpert) this.hoveredExpert.scale.set(1, 1, 1);
          this.hoveredExpert = obj;
          this.hoveredExpert.scale.set(1.35, 1.35, 1.35);
          this.container.style.cursor = 'pointer';
        }
        return;
      }
      if (this.hoveredExpert) {
        this.hoveredExpert.scale.set(1, 1, 1);
        this.hoveredExpert = null;
        this.container.style.cursor = 'default';
      }
    }
  }

  resetBeaconHover() {
    if (this.hoveredBeacon) {
      if (this.hoveredBeacon.userData.tipMesh) {
        this.hoveredBeacon.userData.tipMesh.scale.set(1, 1, 1);
      }
      this.hoveredBeacon = null;
      this.container.style.cursor = 'default';
      if (this.options.onHubHover) this.options.onHubHover(null);
    }
  }

  onWindowResize() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 600;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // --- Animation Loop ---
  animate() {
    requestAnimationFrame(this.animate);

    // Camera Lerping
    this.camera.position.lerp(this.targetCameraPos, 0.05);
    this.camera.lookAt(this.targetLookAt);

    // Auto-Rotation
    if (this.autoRotate && !this.isUserInteracting) {
      if (this.currentMode === 'globe') {
        this.globeGroup.rotation.y += this.autoRotateSpeed;
      } else {
        this.neuralGroup.rotation.y += this.autoRotateSpeed * 1.5;
        this.neuralGroup.rotation.x = Math.sin(Date.now() * 0.0008) * 0.12;
      }
    } else if (this.isUserInteracting) {
      this.rotVelocityX *= 0.92;
      this.rotVelocityY *= 0.92;
    }

    if (this.starfield) {
      this.starfield.rotation.y -= 0.0003;
    }

    if (this.currentMode === 'globe') {
      // 1. Update Shockwaves
      this.shockwaves.forEach((shock) => {
        shock.scale += shock.speed;
        if (shock.scale > 2.8) shock.scale = 1.0;
        shock.mesh.scale.set(shock.scale, shock.scale, 1.0);
        shock.mesh.material.opacity = Math.max(0, 0.85 * (1 - (shock.scale - 1) / 1.8));
      });

      // 2. Update Satellites
      this.satelliteObjects.forEach((sat) => {
        sat.angle += sat.speed;
        const x = sat.orbitRadius * Math.cos(sat.angle);
        const z = sat.orbitRadius * Math.sin(sat.angle);
        const y = Math.sin(sat.angle + sat.inclination) * (sat.orbitRadius * 0.35);
        sat.group.position.set(x, y, z);
        sat.group.rotation.y = sat.angle + Math.PI / 2;
      });

      // 3. Update Arc Pulses
      this.arcPulses.forEach((pulse) => {
        pulse.progress += pulse.speed;
        if (pulse.progress > 1) pulse.progress = 0;
        const pt = pulse.curve.getPoint(pulse.progress);
        pulse.mesh.position.copy(pt);
      });

      // 4. Pulse Beacon Tips
      const time = Date.now() * 0.004;
      this.beacons.forEach((b, idx) => {
        if (b.userData.tipMesh && b !== this.hoveredBeacon) {
          const s = 1.0 + Math.sin(time + idx) * 0.18;
          b.userData.tipMesh.scale.set(s, s, s);
        }
      });

      if (this.equatorialRing) {
        this.equatorialRing.rotation.z += 0.002;
      }
    } else {
      if (this.moeCenter) {
        this.moeCenter.rotation.x += 0.015;
        this.moeCenter.rotation.y += 0.02;
      }
      if (this.tensorRing) {
        this.tensorRing.rotation.z -= 0.008;
      }
      this.expertNodes.forEach((node, idx) => {
        const time = Date.now() * 0.002;
        node.mesh.rotation.y += 0.02;
        node.mesh.position.y = node.origPos.y + Math.sin(time + idx) * 1.5;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}
