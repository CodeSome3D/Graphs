// World State of AI (2026 Edition) - Verified Presentation Dataset & Infographic Metadata

export const presentationData = {
  meta: {
    year: 2026,
    quarter: "Q3",
    title: "World State of AI (2026 Edition)",
    subtitle: "Frontier Compute, Agentic Autonomy & Infrastructure Economics",
    heroMetrics: {
      globalCapEx: "$1.42 Trillion",
      frontierTrainingScale: "10²⁷ FLOPs",
      dailyAgentInvocations: "3.2 Billion",
      enterpriseCodeAssisted: "84.6%",
      activeDatacenterPowerGW: "22.8 GW"
    }
  },

  // Infographic Color Palettes (60-30-10 rule compliance)
  palettes: {
    cyber: {
      id: "cyber",
      name: "Cyber Neon 2026",
      dominant: "#060913",
      secondary: "#0d1527",
      accent: "#00F0FF",
      accentGlow: "rgba(0, 240, 255, 0.4)",
      highlight: "#785EF0",
      warning: "#FFB000",
      success: "#00F5A0",
      text: "#F0F6FC",
      textMuted: "#8B949E"
    },
    ibm: {
      id: "ibm",
      name: "IBM Accessible (Colorblind Safe)",
      dominant: "#070B14",
      secondary: "#0F172A",
      accent: "#648FFF",
      accentGlow: "rgba(100, 143, 255, 0.4)",
      highlight: "#785EF0",
      warning: "#FE6100",
      success: "#FFB000",
      text: "#F8FAFC",
      textMuted: "#94A3B8"
    },
    wong: {
      id: "wong",
      name: "Wong Scientific Palette",
      dominant: "#080D18",
      secondary: "#0F1C30",
      accent: "#56B4E9",
      accentGlow: "rgba(86, 180, 233, 0.4)",
      highlight: "#0072B2",
      warning: "#E69F00",
      success: "#009E73",
      text: "#F8FAFC",
      textMuted: "#94A3B8"
    }
  },

  // 6 Core Presentation Sections
  slides: [
    {
      id: 1,
      tag: "SECTION 01 // MACRO PULSE",
      title: "Global AI State & Macro Economics",
      subtitle: "The transition from conversational LLMs to autonomous cognitive infrastructure",
      narrative: "In 2026, artificial intelligence shifted from prompt-driven tools to autonomous background agent fleets. Frontier training runs surpass 10²⁷ FLOPs, with cumulative infrastructure CapEx reaching $1.42 Trillion.",
      heroNumber: "1.42",
      heroUnit: "T",
      heroPrefix: "$",
      heroLabel: "Cumulative AI CapEx & Datacenter Spend",
      heroGrowth: "+48% YoY Acceleration",
      heroNote: "Global capital allocation across custom ASICs, gigawatt datacenter campuses, nuclear SMRs, and optical switching fabrics.",
      metrics: [
        { value: "10²⁷ FLOPs", label: "Frontier Training Scale", desc: "Current compute ceiling for next-gen reasoning models (100× expansion vs 2023)." },
        { value: "3.2B", label: "Daily Autonomous Agent Calls", desc: "Multi-step agent executions across code synthesis, deep research, and enterprise tooling.", num: 3.2, decimals: 1, suffix: "B" },
        { value: "84.6%", label: "Enterprise Code Assisted", desc: "Production Pull Requests authored or co-piloted by agentic developer environments.", num: 84.6, decimals: 1, suffix: "%" },
        { value: "-94.2%", label: "Inference Cost Deflation", desc: "Token price drop since 2024 via distilled speculative decoding and FP4 silicon efficiency.", num: -94.2, decimals: 1, prefix: "-", suffix: "%" }
      ]
    },
    {
      id: 2,
      tag: "SECTION 02 // COMPUTE GEOGRAPHY",
      title: "Global Datacenters & The Energy Frontier",
      subtitle: "Gigawatt-scale AI campuses and the race for dedicated clean power",
      narrative: "Frontier model serving is bounded by grid capacity. Global AI datacenter power demand consumes 380+ TWh annually, driving direct co-location with nuclear plants, geothermal fields, and ultra-high-voltage DC lines.",
      regionalCapacity: [
        { region: "North America (US East & West)", share: 48, capacityGW: 11.0, growth: "+42% YoY", silicon: "GB200 NVL72 & Custom ASICs • 800G InfiniBand Fabric • PUE 1.09" },
        { region: "East Asia (China & Taiwan)", share: 26, capacityGW: 5.9, growth: "+58% YoY", silicon: "Ascend 910C & B200 Superclusters • Dual-die packaging • Direct liquid cooling" },
        { region: "Europe (UK, Nordics, France)", share: 13, capacityGW: 3.0, growth: "+31% YoY", silicon: "Sovereign AI Enclaves • Hydroelectric & nuclear grid interconnects" },
        { region: "Middle East (UAE & Saudi)", share: 8, capacityGW: 1.8, growth: "+95% YoY", silicon: "Dedicated Gigawatt Solar Parks • Liquid immersion cooling architectures" },
        { region: "Rest of World (India, JP, SG)", share: 5, capacityGW: 1.1, growth: "+64% YoY", silicon: "Regional low-latency edge clusters • High-throughput inference nodes" }
      ],
      energyBreakdown: [
        { source: "Nuclear (Base Load & SMRs)", percentage: 38, color: "var(--primary)", note: "Direct 15-yr on-site SMR power purchase agreements (PPAs) with utility co-location" },
        { source: "Hydro & Geothermal", percentage: 27, color: "var(--secondary)", note: "24/7 continuous baseload across Nordic and Pacific Northwest fiber corridors" },
        { source: "Dedicated Solar + BESS", percentage: 22, color: "var(--warning)", note: "Southwest US & Gulf Desert multi-gigawatt solar arrays with 8h battery storage" },
        { source: "Grid Mixed Interconnects", percentage: 13, color: "var(--text-muted)", note: "Ultra-High-Voltage (UHV) DC peaking lines with natural gas spinning reserve" }
      ]
    },
    {
      id: 3,
      tag: "SECTION 03 // ARCHITECTURE & REASONING",
      title: "The 2026 Frontier Paradigm: Test-Time Compute",
      subtitle: "From passive next-token prediction to dynamic Monte-Carlo reasoning & self-verification",
      narrative: "Capability scaling transitioned from raw pre-training parameters to inference-time search—allocating compute dynamically via Process Reward Models (PRMs) to deliberate, verify, and self-correct.",
      neuralMoEMode: true,
      paradigms: [
        { step: "01", name: "Test-Time Compute Scaling", tag: "Breakthrough", desc: "Dynamic Monte-Carlo tree search allocating compute budgets adaptively from 100ms to 5 minutes per step. Process Reward Models score 1,000+ candidate rollouts." },
        { step: "02", name: "Sparse Mixture-of-Agents (MoA)", tag: "Efficiency", desc: "Dynamic routing across 16 specialized sub-networks (38B active params) achieving >1T dense cognitive parity with sub-4ms expert switching." },
        { step: "03", name: "Autonomous Synthetic Self-Play", tag: "Data Ceiling", desc: "Hermetic execution sandboxes generating verifiable mathematical proofs (Lean 4) and regression code tests for autonomous self-improvement." },
        { step: "04", name: "Embodied Multimodal World Models", tag: "Physical AI", desc: "Joint spatial 3D Gaussian tokenization and continuous physical dynamics enabling zero-shot robotic manipulation in complex environments." }
      ]
    },
    {
      id: 4,
      tag: "SECTION 04 // BENCHMARK MATRIX",
      title: "Frontier Intelligence & Open vs Closed Pareto",
      subtitle: "Capability benchmarks and the collapsing open-weights performance gap",
      narrative: "The capability delta between closed proprietary APIs and open-weights models narrowed to under 3 months in 2026. Speculative distillation and FP4 quantized execution allow workstation-level local deployment.",
      radarMetrics: [
        { axis: "Complex Reasoning (GPQA)", closedScore: 89.4, openScore: 86.2, baselineHuman: 65.0 },
        { axis: "Software Synthesis (SWE-bench)", closedScore: 78.6, openScore: 74.8, baselineHuman: 48.0 },
        { axis: "Formal Math (AIME 2026)", closedScore: 96.2, openScore: 92.5, baselineHuman: 30.0 },
        { axis: "Multimodal 3D Vision", closedScore: 84.5, openScore: 81.0, baselineHuman: 70.0 },
        { axis: "Long Context Recall (10M)", closedScore: 99.8, openScore: 98.4, baselineHuman: 40.0 },
        { axis: "Agentic Tool Use & Orchestration", closedScore: 88.0, openScore: 83.5, baselineHuman: 55.0 }
      ],
      paretoPoints: [
        { model: "Frontier Reasoner (Closed)", score: 94.5, costPerM: 8.50, type: "closed", size: 14 },
        { model: "Open Dense Reasoner (680B)", score: 91.8, costPerM: 0.85, type: "open", size: 12 },
        { model: "Distilled MoE (38B/8B)", score: 86.4, costPerM: 0.12, type: "open", size: 10 },
        { model: "Workstation Local (14B-Q4)", score: 80.2, costPerM: 0.02, type: "local", size: 8 },
        { model: "Legacy 2024 Frontier", score: 72.0, costPerM: 15.00, type: "legacy", size: 7 }
      ]
    },
    {
      id: 5,
      tag: "SECTION 05 // ECONOMIC VELOCITY",
      title: "Industry Transformation & Agent Autonomy",
      subtitle: "Real-world productivity gains across key vertical sectors in 2026",
      narrative: "Enterprise deployments transitioned from conversational chatbots to autonomous agent swarms with direct P&L impact. R&D cycles in biotechnology, chip engineering, and materials discovery shrank from years to weeks.",
      sectors: [
        {
          name: "🧬 Biomedical & De Novo Proteins",
          gain: "+340% Clinical Speed",
          metricValue: "14 Days",
          metricLabel: "Target to Validated Candidate",
          desc: "AlphaFold 3 and co-folding diffusion architectures designed 48 active Phase-1 drug candidates currently in human clinical trials.",
          subpoint: "Target binding affinity prediction accuracy reached 94.6%; de novo synthetic peptide yield up 5.8×."
        },
        {
          name: "💻 Autonomous Software Swarms",
          gain: "6.2× Developer Output",
          metricValue: "72% Auto-Fix",
          metricLabel: "End-to-End Bug Resolutions",
          desc: "Multi-agent developer swarms ingest codebases, write unit tests, verify regression suites, and auto-deploy canary fixes.",
          subpoint: "Full-stack framework migrations (e.g. React 19 / Python 3.14) completed in hours with 99.8% test coverage."
        },
        {
          name: "⚡ 2nm Silicon Tape-Out Floorplan",
          gain: "45% Tape-Out Speedup",
          metricValue: "18.4%",
          metricLabel: "PPA Floorplan Efficiency Gain",
          desc: "Reinforcement learning agents route 2nm chip interconnects and optimize macro placement beyond human layout team baselines.",
          subpoint: "Backside power delivery network (BSPDN) voltage drops cut by 22%; clock tree synthesis runtime reduced by 60%."
        },
        {
          name: "🔋 Solid-State Battery Crystals",
          gain: "12,000+ Crystals",
          metricValue: "3.5× Density",
          metricLabel: "Solid-State Electrolyte Gain",
          desc: "Autonomous closed-loop robotic synthesis labs identified stable non-lithium solid electrolytes for next-gen energy storage.",
          subpoint: "Room-temperature ionic conductivity surpassed 12.4 mS/cm; degradation under 3% after 2,500 fast-charge cycles."
        }
      ]
    },
    {
      id: 6,
      tag: "SECTION 06 // ROADMAP & GOVERNANCE",
      title: "Governance Treaties & The 2026–2030 Horizon",
      subtitle: "Compute verification, safety thresholds, and the trajectory toward general cognitive parity",
      narrative: "Global accords formalized hardware-level compute telemetry for training runs exceeding 10²⁶ FLOPs, as the scientific frontier advances toward unified multimodal embodiment and self-improving scientific agents.",
      timeline: [
        { year: "2024", title: "Multimodal Foundation & 1M Context", desc: "Omni-modal text/vision/voice unification, initial test-time search prototypes and FlashAttention-3." },
        { year: "2025", title: "Reasoning Models & Open Distillation", desc: "o1/DeepSeek-R1 release, open-weights parity, $100B hyperscale datacenter campus commitments." },
        { year: "2026 (PRESENT)", title: "Agentic Fleets & Gigawatt Nuclear Campuses", desc: "85% assisted coding, self-verifying PRMs, 10²⁶ FLOPs international safety treaty, FP4 silicon standard.", active: true },
        { year: "2027–2028", title: "Embodied Robotics & Automated Chemistry", desc: "Humanoid factory deployment, closed-loop autonomous wet labs, 10M token zero-loss context standards." },
        { year: "2029–2030", title: "General Scientific Cognitive Parity", desc: "Autonomous mathematical theorem proving, theoretical physics breakthroughs, and unified agentic OS." }
      ],
      governancePillars: [
        { title: "📡 Compute Telemetry", detail: "Hardware-level cryptographically signed audit telemetry on all multi-cluster runs exceeding 10²⁶ FLOPs.", tag: "ISO/IEC 42001-AI" },
        { title: "🧬 Biosecurity Sandboxing", detail: "Cryptographic DNA synthesis screening, air-gapped wet lab APIs, and automated dual-use pathogen blocking.", tag: "G7 BioSafety Accord" },
        { title: "🔒 Media Provenance (C2PA)", detail: "Universal cryptographic watermarking and manifest validation embedded directly into hardware silicon enc-dec pipelines.", tag: "C2PA v2.2 Mandate" },
        { title: "⚡ Zero-Fossil Mandate", detail: "Binding hyperscale agreements requiring 100% dedicated clean baseload power additions for any cluster >100MW.", tag: "Clean Compute 2028" }
      ]
    }
  ],

  // 8 Verified Global AI Superhubs (Exact Lat/Lon & Precise Camera Targets)
  globalHubs: [
    {
      id: "us-east",
      name: "US-East (Virginia Data Center Alley)",
      country: "United States",
      lat: 39.0438,
      lon: -77.4874,
      capacityGW: 6.2,
      share: 38,
      chips: "NVIDIA GB200, AWS Trainium 2, Google TPU v6",
      powerType: "Nuclear (Constellation Energy) + Solar",
      leadOrgs: "Amazon Web Services, Microsoft Azure, Google Cloud, Meta",
      status: "HYPERSCALE ACTIVE",
      cameraPos: { x: 13.8, y: 51.7, z: 62.2 }
    },
    {
      id: "us-west",
      name: "Silicon Valley & Pacific Northwest",
      country: "United States",
      lat: 37.3861,
      lon: -122.0839,
      capacityGW: 4.8,
      share: 32,
      chips: "Blackwell Ultra, Custom Silicon Labs, Apple Private Cloud",
      powerType: "Hydroelectric (Columbia River Basin) + Solar",
      leadOrgs: "OpenAI, Anthropic, Apple, Google DeepMind, Meta AI",
      status: "FRONTIER R&D CORE",
      cameraPos: { x: -34.6, y: 49.8, z: 55.2 }
    },
    {
      id: "eu-west",
      name: "Europe (London & Paris Hub)",
      country: "United Kingdom & France",
      lat: 51.5074,
      lon: -0.1278,
      capacityGW: 2.4,
      share: 15,
      chips: "NVIDIA H200/B200, Mistral Enterprise Clusters",
      powerType: "EDF Nuclear + Offshore Wind",
      leadOrgs: "Google DeepMind London, Mistral AI, Kyutai, CERN",
      status: "SOVEREIGN FRONTIER",
      cameraPos: { x: 51.0, y: 64.2, z: 0.1 }
    },
    {
      id: "asia-east",
      name: "East Asia Hub (Beijing & Shanghai)",
      country: "China",
      lat: 39.9042,
      lon: 116.4074,
      capacityGW: 4.2,
      share: 26,
      chips: "Huawei Ascend 910C, Kunlunxin, DeepSeek Cluster",
      powerType: "UHVDC Western Hydro + Nuclear",
      leadOrgs: "DeepSeek, Alibaba Cloud, Baidu, Tsinghua, Zhipu AI",
      status: "OPEN-WEIGHTS CORE",
      cameraPos: { x: -28.0, y: 52.6, z: -56.3 }
    },
    {
      id: "asia-japan",
      name: "Tokyo AI Innovation Zone",
      country: "Japan",
      lat: 35.6762,
      lon: 139.6503,
      capacityGW: 1.1,
      share: 7,
      chips: "Fugaku-Next, NVIDIA GB200 Systems",
      powerType: "Clean Grid + Geothermal",
      leadOrgs: "SoftBank AI, RIKEN, Preferred Networks, NTT",
      status: "EMBODIED ROBOTICS HUB",
      cameraPos: { x: -50.8, y: 47.8, z: -43.1 }
    },
    {
      id: "asia-south",
      name: "India AI Frontier (Bengaluru)",
      country: "India",
      lat: 12.9716,
      lon: 77.5946,
      capacityGW: 0.9,
      share: 6,
      chips: "IndiaAI Sovereign GPU Cloud, NVIDIA B200",
      powerType: "Solar Park Grid Interconnect",
      leadOrgs: "Yotta Data Services, Sarvam AI, Krutrim, Tata AI",
      status: "AGENTIC INFERENCE ACCELERATOR",
      cameraPos: { x: 17.2, y: 18.4, z: -78.0 }
    },
    {
      id: "me-uae",
      name: "Abu Dhabi / UAE Sovereign AI",
      country: "United Arab Emirates",
      lat: 24.4539,
      lon: 54.3773,
      capacityGW: 1.6,
      share: 10,
      chips: "G42 Stargate Supercluster, Cerebras CS-3",
      powerType: "Barakah Nuclear + Al Dhafra Solar",
      leadOrgs: "G42, TII (Falcon), MGX Global AI Fund",
      status: "GLOBAL INFRASTRUCTURE ACCORD",
      cameraPos: { x: 43.5, y: 33.9, z: -60.7 }
    },
    {
      id: "asia-taiwan",
      name: "Taiwan Foundry AI Ecosystem (Taipei & Hsinchu)",
      country: "Taiwan",
      lat: 25.0330,
      lon: 121.5654,
      capacityGW: 1.4,
      share: 9,
      chips: "TSMC 2nm/A16 Wafer Foundries, CoWoS Packaging",
      powerType: "Dedicated Clean Grid + Offshore Wind",
      leadOrgs: "TSMC, Foxconn AI Factory, MediaTek, ASUS",
      status: "GLOBAL SILICON HEARTBEAT",
      cameraPos: { x: -38.9, y: 34.7, z: -63.3 }
    }
  ],

  // High-Speed Transcontinental Fiber Arcs
  dataArcs: [
    { from: "us-west", to: "us-east", bandwidthTbps: 1800, trafficType: "Model Checkpoint Sync" },
    { from: "us-east", to: "eu-west", bandwidthTbps: 1200, trafficType: "Transatlantic Reasoning Stream" },
    { from: "us-west", to: "asia-japan", bandwidthTbps: 980, trafficType: "Pacific Edge Dispatch" },
    { from: "asia-japan", to: "asia-taiwan", bandwidthTbps: 1400, trafficType: "Foundry Silicon Telemetry" },
    { from: "asia-taiwan", to: "asia-east", bandwidthTbps: 1100, trafficType: "East Asia High-Speed Interconnect" },
    { from: "eu-west", to: "me-uae", bandwidthTbps: 850, trafficType: "EMEA Sovereign Corridor" },
    { from: "me-uae", to: "asia-south", bandwidthTbps: 760, trafficType: "Indian Ocean Fiber Highway" },
    { from: "asia-south", to: "asia-east", bandwidthTbps: 620, trafficType: "Regional Model Inference Edge" }
  ]
};
