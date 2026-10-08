const u = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&fit=crop&auto=format`

export const MODELS = [
  { key: 'GFS', name: 'GFS', kind: 'Global NWP', color: '#8b95a1' },
  { key: 'ECMWF', name: 'ECMWF', kind: 'Global NWP', color: '#c9b99a' },
  { key: 'NCUM', name: 'NCUM', kind: 'Regional NWP', color: '#9fb4d9' },
  { key: 'WRF', name: 'WRF', kind: 'Regional NWP', color: '#b69fd1' },
  { key: 'AI', name: 'GraphCast', kind: 'AI / ML', color: '#78d0c3' },
  { key: 'ENS', name: 'GEFS·ENS', kind: 'Ensemble', color: '#7fbf6a' },
] as const

export type ModelKey = (typeof MODELS)[number]['key']

export const STATIONS = [
  { id: 'BOM', city: 'Mumbai', region: 'Konkan coast', lat: '19.07°N', lon: '72.88°E', regime: 'Active monsoon', rain: [62, 71, 48, 55, 90, 58], alert: 'Heavy rainfall', level: 'Orange' },
  { id: 'MAA', city: 'Chennai', region: 'Coromandel', lat: '13.08°N', lon: '80.27°E', regime: 'Cyclonic circulation', rain: [34, 41, 29, 52, 47, 38], alert: 'Cyclone watch', level: 'Yellow' },
  { id: 'GAU', city: 'Guwahati', region: 'Brahmaputra valley', lat: '26.14°N', lon: '91.74°E', regime: 'Break-monsoon', rain: [88, 104, 79, 95, 121, 97], alert: 'Flash flood', level: 'Red' },
  { id: 'DEL', city: 'New Delhi', region: 'Indo-Gangetic plain', lat: '28.61°N', lon: '77.21°E', regime: 'Heat wave', rain: [2, 0, 4, 1, 0, 2], alert: 'Heat wave · 45.8°C', level: 'Orange' },
  { id: 'BBI', city: 'Bhubaneswar', region: 'Odisha coast', lat: '20.30°N', lon: '85.82°E', regime: 'Depression, Bay of Bengal', rain: [45, 58, 40, 66, 61, 52], alert: 'Strong winds', level: 'Yellow' },
]

// relative skill per model by regime-ish context; weights are normalised from these
export const SKILL: Record<string, Record<ModelKey, number>> = {
  Monsoon: { GFS: 0.6, ECMWF: 1.0, NCUM: 1.15, WRF: 0.9, AI: 1.2, ENS: 0.75 },
  'Pre-monsoon': { GFS: 0.8, ECMWF: 1.1, NCUM: 0.85, WRF: 1.05, AI: 1.0, ENS: 0.7 },
  'Post-monsoon': { GFS: 0.7, ECMWF: 1.2, NCUM: 0.9, WRF: 0.8, AI: 1.1, ENS: 0.9 },
  Winter: { GFS: 0.9, ECMWF: 1.25, NCUM: 0.8, WRF: 0.7, AI: 1.05, ENS: 0.8 },
}
export const REGION_BIAS: Record<string, Partial<Record<ModelKey, number>>> = {
  'North-East': { WRF: 1.3, NCUM: 1.2, GFS: 0.7 },
  'West coast': { NCUM: 1.25, AI: 1.1 },
  'East coast': { ECMWF: 1.2, ENS: 1.2 },
  'Indo-Gangetic': { AI: 1.25, GFS: 1.1 },
  Peninsula: { ECMWF: 1.1, WRF: 1.1 },
}
// short leads favour high-res regional models, long leads favour global + ensemble
export const LEAD_FACTOR = (lead: number): Partial<Record<ModelKey, number>> =>
  lead <= 24 ? { WRF: 1.35, NCUM: 1.2, ENS: 0.7 } : lead <= 72 ? { AI: 1.15 } : { ECMWF: 1.25, ENS: 1.5, WRF: 0.55, NCUM: 0.8 }

export const VERIFY = {
  RMSE: { GFS: 4.4, ECMWF: 3.1, NCUM: 2.7, WRF: 2.6, AI: 1.9, ENS: 2.9, BLEND: 1.6 },
  MAE: { GFS: 4.2, ECMWF: 3.0, NCUM: 2.6, WRF: 2.4, AI: 1.7, ENS: 2.6, BLEND: 1.5 },
  Bias: { GFS: 0.6, ECMWF: -0.3, NCUM: 0.4, WRF: -0.5, AI: -0.3, ENS: 0.25, BLEND: -0.05 },
}

export const FLOW = [
  { n: '01', title: 'Forecast inputs', sub: 'Multiple models', items: ['Global NWP — ECMWF, GFS', 'Regional NWP — NCUM, WRF', 'AI weather — GraphCast, Pangu, FourCastNet', 'Ensembles — GEFS, ENS'], note: 'Rainfall · Temperature · 10 m wind · 6 / 24 / 48 / 72 h leads' },
  { n: '02', title: 'Alignment & validation', sub: 'Common grid', items: ['Spatial & temporal alignment to 0.25°', 'Forecast-cycle synchronisation', 'Regridding & interpolation (ESMF)', 'QC for gaps, outliers, physical consistency'], note: 'Variables & units standardised across every source' },
  { n: '03', title: 'Adaptive AI weighting', sub: 'Meta-learner', items: ['Historical skill — RMSE, MAE, bias, correlation', 'Region-specific performance', 'Season & lead-time context', 'Current weather regime'], note: 'XGBoost / PyTorch learner assigns a dynamic weight per model' },
  { n: '04', title: 'Consensus forecast', sub: 'Weighted fusion', items: ['Optimised rainfall, temperature, wind', 'Extreme-weather indicators', 'Uncertainty & confidence score', 'Per-model contribution — why each is trusted'], note: 'Unified, explainable guidance for every Indian district' },
  { n: '05', title: 'Risk & decision support', sub: 'Operational', items: ['Heavy rainfall — urban & rural floods', 'Heat waves & extreme temperature', 'Cyclones & strong winds', 'Explainable alerts with confidence'], note: 'Dashboard + API for IMD, NDMA and state agencies' },
]

export const APPS = [
  { t: 'Heavy rainfall & flood early warning', img: u('1657069345471-c54f2432b79c'), tag: 'Urban · Rural' },
  { t: 'Heat-wave monitoring & public advisories', img: u('1770353985048-c4d04d779667'), tag: 'Temperature' },
  { t: 'Cyclone & severe weather alerts', img: u('1454789476662-53eb23ba5907'), tag: 'Wind · Surge' },
  { t: 'Agriculture & crop planning', img: u('1698150098242-cc61d0df20eb'), tag: 'Kharif · Rabi' },
  { t: 'Water resource management', img: u('1606050309588-741702cceb9b'), tag: 'Reservoirs' },
]

export const HERO_IMG = u('1769755494233-cfaeaa210b93', 2000)

export const FEAS = {
  Feasibility: [
    ['Technical', 'Builds on existing NWP (IMD, GFS, ECMWF, WRF), satellite, radar and ground observations, with proven XGBoost / LSTM / Transformer models on an open-source stack.'],
    ['Data', 'Public NWP, INSAT satellite and reanalysis archives, IMD Doppler radar and AWS feeds — enough history to train and validate, extensible to real-time streams.'],
    ['Operational', 'Automated ingestion pipeline, web dashboard and API service; scheduled and real-time runs on cloud or on-premise infrastructure.'],
    ['Financial', 'Open-source tooling and public datasets on existing government infrastructure. Modular, cost-effective, grant-ready.'],
    ['Scalability', 'Add models and variables without re-architecture. National to district scale, extensible to agriculture and urban planning.'],
  ],
  Risks: [
    ['Data limitations', 'Sparse or low-resolution regions, inconsistent formats, latency in real-time availability, quality issues in historical archives.'],
    ['Model reliability', 'Individual-model biases, uncertainty in extremes, regional & seasonal variance, overfitting in AI/ML components.'],
    ['Compute', 'Large multi-modal datasets (NWP, satellite, radar) and real-time inference demand scalable GPU/CPU resources.'],
    ['Privacy & security', 'Sensitive geospatial and station data, unauthorised access risk, compliance with government data policy.'],
    ['Adoption', 'Probabilistic output needs interpretation; farmers, researchers and agencies each need different views.'],
  ],
  Strategies: [
    ['Data integration', 'Harmonise NWP, satellite, radar and ground data through regridding, bias correction and continuous real-time updates.'],
    ['Accuracy', 'Adaptive weighting by region, season, lead time and regime, continuously verified against observations.'],
    ['Infrastructure', 'Containerised Docker / Kubernetes deployment on cloud HPC with GPU, and optimised high-volume pipelines.'],
    ['Security', 'Encryption, access controls, authenticated APIs and regular audits aligned with government standards.'],
    ['User-centric design', 'Intuitive maps, charts and alerts, training for each user group, and a feedback loop with IMD and NDMA.'],
  ],
} as const

export const BENEFITS = [
  { k: 'Social', c: 'var(--color-storm)', pts: ['Earlier disaster preparedness and warning', 'Safer communities through timely alerts', 'Interpretable weather information for all', 'Protects lives and livelihoods in vulnerable regions'] },
  { k: 'Economic', c: 'var(--color-leaf)', pts: ['Better resource use and cost efficiency', 'Precision agriculture and fisheries', 'Lower losses from extreme events', 'Resilient infrastructure planning'] },
  { k: 'Environmental', c: 'var(--color-saffron)', pts: ['Monitors land use and ecosystem health', 'Supports biodiversity conservation', 'Climate-change impact assessment', 'Progress toward net-zero goals'] },
  { k: 'Strategic', c: 'var(--color-tide)', pts: ['National disaster & weather resilience', 'Evidence-based policy and governance', 'Monitoring of critical infrastructure', 'Indian leadership in AI + Earth observation'] },
]
