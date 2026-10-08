<div align="center">

# 🌦️ MERIDIAN

### Hybrid AI–NWP Multi-Model Forecast Blending System

**From Many Weather Models to One Reliable, Explainable Forecast for India.**

<p>
  <img src="https://img.shields.io/badge/Smart%20India%20Hackathon-2026-0b6e4f?style=for-the-badge" alt="SIH 2026">
  <img src="https://img.shields.io/badge/Domain-Disaster%20Management-1565c0?style=for-the-badge" alt="Disaster Management">
  <img src="https://img.shields.io/badge/AI%20%2B%20NWP-Forecast%20Blending-6a1b9a?style=for-the-badge" alt="AI NWP">
  <img src="https://img.shields.io/badge/India-Focused-ff8f00?style=for-the-badge" alt="India">
</p>

<p>
  <b>Adaptive weighting</b> • <b>Multi-model fusion</b> • <b>Verification</b> • <b>Explainability</b> • <b>Extreme-weather decision support</b>
</p>

</div>

---

## 🌐 What is Meridian?

Meridian is a **hybrid AI–NWP multi-model forecast blending platform** designed to combine forecasts from multiple Numerical Weather Prediction (NWP), AI/ML, regional, and ensemble models into one adaptive and explainable forecast.

Instead of trusting one model or using a fixed average, Meridian asks a more useful question:

> **Which model should we trust most for this region, this season, this lead time, and this weather regime?**

The answer is learned from historical model skill and contextual information, producing a dynamically weighted consensus forecast.

---

<div align="center">

### ⚡ One Platform. Many Models. One Adaptive Forecast.

| 🌍 Context | 🧠 Intelligence | 🌦️ Forecast | 🔍 Trust |
|:---:|:---:|:---:|:---:|
| Region | Skill-aware weighting | Rainfall | Model weights |
| Season | Meta-learning | Temperature | Confidence |
| Lead time | Model fusion | Wind | Uncertainty |
| Weather regime | Verification | Pressure | SHAP insights |

</div>

---

## 🎯 The Problem

Weather models do not perform equally well everywhere or under every condition.

Their skill can change with:

- 📍 **Region**
- 🌤️ **Season**
- ⏱️ **Forecast lead time**
- 🌪️ **Weather regime**
- 🌧️ **Forecast variable**
- 🚨 **Extreme-weather conditions**

A single model can therefore be excellent in one situation and weaker in another. Static averaging also ignores this changing context.

### The gap

```text
Single Model
     │
     ▼
 One Forecast
     │
     ├── Regional skill varies
     ├── Seasonal skill varies
     ├── Lead-time skill varies
     └── Extreme events remain difficult
```

### Meridian's answer

```text
Many Forecast Models
        │
        ▼
Historical Skill
        │
        ▼
Context Awareness
        │
        ├── Region
        ├── Season
        ├── Lead Time
        └── Weather Regime
        │
        ▼
Adaptive AI Weighting
        │
        ▼
One Blended Forecast
        │
        ▼
Verification + Explanation
```

---

# 🛰️ Forecast Intelligence Pipeline

```mermaid
flowchart LR
    A["🌦️ Multi-Source Weather Data"] --> B["🧹 Alignment & Quality Control"]
    B --> C["📊 Historical Skill Engine"]
    C --> D["🌪️ Weather Regime Analysis"]
    D --> E["🧠 Adaptive AI Weighting"]
    E --> F["🔀 Multi-Model Fusion"]
    F --> G["🌤️ Consensus Forecast"]
    G --> H["✅ Verification"]
    H --> I["🚨 Extreme Weather Decision Support"]
    H --> C
    G --> J["🔍 Confidence & Explainability"]
```

---

## 🌦️ What Goes Into Meridian?

<div align="center">

| Source | Examples | Purpose |
|---|---|---|
| 🌍 **NWP** | IMD, ECMWF, GFS, WRF | Physics-based forecasts |
| 🤖 **AI / ML** | GraphCast, Pangu-Weather, LSTM, Transformers | Data-driven forecasts |
| 📦 **Ensembles** | GEFS and other ensembles | Spread & uncertainty |
| 🛰️ **Satellite** | INSAT, SAR | Observational context |
| 📡 **Radar** | Doppler radar | Short-range weather observations |
| 🌡️ **Ground** | Weather stations, AWS | Verification & observations |
| 🗺️ **Static Data** | DEM, land use, soil | Spatial context |
| 🌐 **Climate Indices** | ENSO, IOD, MJO | Large-scale climate context |

</div>

---

# 🧠 The Core Idea: Adaptive Weighting

Meridian does not simply average model outputs.

It dynamically learns the contribution of each model.

```text
                    ┌──────────────────────┐
                    │   Context Features   │
                    ├──────────────────────┤
                    │ Location             │
                    │ Season               │
                    │ Lead Time            │
                    │ Weather Regime       │
                    │ Recent Model Skill   │
                    │ Model Agreement      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Meta-Learner       │
                    │ XGBoost / PyTorch    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Dynamic Model Weights│
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
          ECMWF              GFS               AI Model
             │                 │                 │
             └─────────────────┼─────────────────┘
                               ▼
                    ┌──────────────────────┐
                    │  Blended Forecast    │
                    └──────────────────────┘
```

### Blending Formula

```text
F_blend = Σ (wi × Fi)
```

Where:

- `Fi` = forecast produced by model `i`
- `wi` = dynamically learned weight for model `i`

The goal is to **learn which model should be trusted under the current forecasting context**.

---

# 📊 Skill & Verification Engine

Meridian continuously evaluates model performance against observations.

### Core Metrics

| Metric | What it tells us |
|---|---|
| **RMSE** | Overall forecast error |
| **MAE** | Average absolute error |
| **Bias** | Systematic over / under prediction |
| **Correlation** | Agreement with observed variation |
| **POD** | Probability of detecting an event |
| **False Alarm Ratio** | Frequency of incorrect event alerts |
| **Threat Score** | Overall extreme-event detection skill |

```mermaid
flowchart LR
    A["Forecast"] --> C["📏 Compare with Observations"]
    B["Observations"] --> C
    C --> D["RMSE / MAE / Bias / Correlation"]
    C --> E["POD / FAR / Threat Score"]
    D --> F["📚 Skill Database"]
    E --> F
    F --> G["🔄 Refresh Model Weights"]
    G --> H["🧠 Improved Future Blending"]
```

---

# 🌪️ Extreme Weather Decision Support

Meridian is designed to turn forecast information into actionable weather-risk guidance.

<div align="center">

| 🚨 Event | 🔎 Analysis | 📢 Decision Support |
|---|---|---|
| 🌧️ **Heavy Rainfall** | Probability, threshold, spatial extent | Flood advisories |
| 🌀 **Cyclones** | Track, intensity, landfall risk | Cyclone guidance |
| 💨 **High Winds** | Wind probability & affected areas | High-wind alerts |
| 🔥 **Heat Waves** | Temperature anomalies | Heat-risk guidance |
| ❄️ **Cold Waves** | Temperature anomalies | Cold-risk guidance |
| 🏜️ **Drought** | Rainfall deficit, dry spells | Water & agriculture support |

</div>

---

# 🔍 Explainability

A forecast is more useful when users can understand **why** it was produced.

Meridian can expose:

```text
Model Skill
    +
Dynamic Weights
    +
Model Contribution
    +
Confidence
    +
Uncertainty
    +
SHAP Explanations
    ↓
Understandable Forecast Guidance
```

### Explainability Views

- 🧮 Model contribution
- 🗺️ Model weight maps
- 📈 Skill comparisons
- 🎯 Confidence estimates
- 🌫️ Forecast uncertainty
- 🔬 SHAP-based explanations
- ⏱️ Lead-time reliability

---

# 🖥️ Decision Dashboard

The proposed interface brings the forecasting workflow into one place.

<div align="center">

| 🗺️ Forecast Map | 📈 Time Series | ⚖️ Model Weights |
|:---:|:---:|:---:|
| Spatial forecast visualization | Location-based forecast trends | Which model is trusted? |

| 🚨 Alert Panel | 🎯 Confidence | 🔬 Model Comparison |
|:---:|:---:|:---:|
| Extreme-weather risks | Forecast reliability | Model vs blended forecast |

</div>

### Dashboard Capabilities

- Interactive weather maps
- Forecast timelines
- Model comparison
- Model weight maps
- Time-series charts
- Confidence bands
- Uncertainty visualization
- Extreme-weather alerts
- Reports and downloads
- Custom analysis and user queries

---

# 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph INPUT["🌍 INPUT LAYER"]
        NWP["NWP Models"]
        AI["AI / ML Models"]
        SAT["Satellite"]
        RAD["Radar"]
        OBS["Ground Observations"]
        STATIC["DEM / Land Use / Soil / Climate"]
    end

    subgraph PROCESS["⚙️ PROCESSING & INTELLIGENCE"]
        QC["Data Validation & QC"]
        SKILL["Historical Skill Engine"]
        REGIME["Weather Regime Analysis"]
        WEIGHT["Adaptive AI Weighting"]
        FUSION["Multi-Model Fusion"]
    end

    subgraph OUTPUT["📊 OUTPUT & DECISION SUPPORT"]
        FORECAST["Blended Forecast"]
        VERIFY["Verification"]
        EXTREME["Extreme Weather Module"]
        EXPLAIN["Explainability"]
        DASH["Decision Dashboard"]
    end

    NWP --> QC
    AI --> QC
    SAT --> QC
    RAD --> QC
    OBS --> QC
    STATIC --> QC

    QC --> SKILL
    QC --> REGIME
    SKILL --> WEIGHT
    REGIME --> WEIGHT
    WEIGHT --> FUSION
    FUSION --> FORECAST

    FORECAST --> VERIFY
    OBS --> VERIFY
    VERIFY --> SKILL

    FORECAST --> EXTREME
    FORECAST --> EXPLAIN
    EXTREME --> DASH
    EXPLAIN --> DASH
    FORECAST --> DASH
```

---

# 🧩 Technology Stack

<div align="center">

### 🐍 Data & Processing

<img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white">
<img src="https://img.shields.io/badge/xarray-0F4C81?style=flat-square">
<img src="https://img.shields.io/badge/pandas-150458?style=flat-square&logo=pandas&logoColor=white">
<img src="https://img.shields.io/badge/Rasterio-2D6A4F?style=flat-square">
<img src="https://img.shields.io/badge/GDAL-5C8A3D?style=flat-square">
<img src="https://img.shields.io/badge/xESMF-4C78A8?style=flat-square">

### 🤖 Machine Learning

<img src="https://img.shields.io/badge/XGBoost-EC6B2D?style=flat-square">
<img src="https://img.shields.io/badge/LightGBM-2E7D32?style=flat-square">
<img src="https://img.shields.io/badge/Random%20Forest-1B5E20?style=flat-square">
<img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white">

### ⚡ Backend

<img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white">
<img src="https://img.shields.io/badge/Celery-37814A?style=flat-square">
<img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white">

### 🗄️ Data & Storage

<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white">
<img src="https://img.shields.io/badge/PostGIS-4169E1?style=flat-square">
<img src="https://img.shields.io/badge/MinIO-C72E29?style=flat-square">

### 💻 Frontend

<img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white">
<img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB">
<img src="https://img.shields.io/badge/Leaflet-199900?style=flat-square&logo=leaflet&logoColor=white">
<img src="https://img.shields.io/badge/Mapbox-000000?style=flat-square&logo=mapbox&logoColor=white">

### ☁️ Deployment & Monitoring

<img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white">
<img src="https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white">
<img src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=white">
<img src="https://img.shields.io/badge/Prometheus-E6522C?style=flat-square&logo=prometheus&logoColor=white">
<img src="https://img.shields.io/badge/Grafana-F46800?style=flat-square&logo=grafana&logoColor=white">

</div>

---

# 🚀 Phased Roadmap

```mermaid
flowchart LR
    A["🟢 MVP<br/>2 Models + Rainfall"] --> B["🔵 Multi-Variable<br/>Rain + Temperature + Wind"]
    B --> C["🟣 Adaptive Weighting<br/>Context-Aware Fusion"]
    C --> D["🟠 Continuous Verification<br/>Skill Feedback"]
    D --> E["🔴 Operational System<br/>Alerts + Decision Support"]
```

### Future Extensions

- 🛰️ Satellite and radar nowcasting
- 📍 Hyper-local district-level downscaling
- 🧠 Online learning from verification feedback
- 🌀 Cyclone track and intensity prediction
- 🌫️ Air-quality forecasting
- 🔌 Open API services
- 📱 SMS / WhatsApp alerts
- 🏛️ Integration with IMD and NDMA portals

---

# 🌍 Potential Impact

Meridian is designed to support decision-making across:

| Area | Potential Use |
|---|---|
| 🚨 Disaster Management | Early warning and extreme-weather guidance |
| 🌾 Agriculture | Weather-aware agricultural planning |
| 💧 Water Management | Rainfall and drought monitoring |
| 🌊 Coastal Management | Cyclone and high-wind risk |
| 🏗️ Infrastructure | Weather-aware planning and resilience |
| 🌱 Environment | Monitoring and climate-related analysis |
| 🔬 Research | Model verification and comparison |

The intended reach is **pan-India**, with the architecture designed to support regional and national-scale forecasting workflows.

---

# 🔬 Research Foundation

The system builds upon research and established approaches in:

- Multi-model ensemble rainfall prediction
- AI-based weather forecasting
- GraphCast
- Pangu-Weather
- WeatherBench 2
- Statistical forecast post-processing
- Bayesian model averaging

---

# 📁 Project Structure

```text
Meridian/
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .Meridian/
│   └── make/
│
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# ⚙️ Getting Started

### Prerequisites

- Node.js
- pnpm
- Git

### Clone

    git clone https://github.com/shaheeq27/Meridian.git
    cd Meridian

### Install

    pnpm install

### Development

    pnpm dev

### Production Build

    pnpm build

### Preview

    pnpm preview

---

# 📌 Project Status

Meridian is being developed through a phased implementation strategy:

**MVP → Initial Model Integration → Rainfall Forecasting → Multi-Variable Forecasting → Adaptive Weighting → Continuous Verification → Operational Forecasting & Decision Support**

---

<div align="center">

## 🌦️ Smarter Forecasts. Safer Tomorrow.

### Built for Smart India Hackathon 2026.

<br>

<img src="https://img.shields.io/badge/MERIDIAN-Weather%20Intelligence-0b6e4f?style=for-the-badge">

</div>
