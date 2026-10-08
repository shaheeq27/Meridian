import { useEffect, useMemo, useState } from 'react'
import { Analysis } from './Analysis'
import { Contact, NotFound, PagerFooter, Team } from './Pages'
import { Sidebar, useRoute } from './Sidebar'
import { APPS, BENEFITS, FEAS, FLOW, HERO_IMG, LEAD_FACTOR, MODELS, REGION_BIAS, SKILL, STATIONS, VERIFY, type ModelKey } from './data'

const levelColor: Record<string, string> = { Red: 'var(--color-storm)', Orange: 'var(--color-saffron)', Yellow: '#e8d36a' }

function Section({ id, index, kicker, title, children, className = '' }: { id: string; index: string; kicker: string; title: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`px-5 py-24 md:px-10 lg:py-32 ${className}`}>
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-14 grid gap-6 lg:grid-cols-[220px_1fr]">
          <div className="label flex gap-3 pt-3"><span className="text-saffron">{index}</span><span>{kicker}</span></div>
          <h2 className="font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.01em]">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  )
}

function Console() {
  const [sid, setSid] = useState('GAU')
  const s = STATIONS.find((x) => x.id === sid)!
  const w = [0.1, 0.17, 0.2, 0.19, 0.24, 0.1]
  const blend = s.rain.reduce((a, v, i) => a + v * w[i], 0)
  const max = Math.max(...s.rain, 1)
  const spread = Math.max(...s.rain) - Math.min(...s.rain)
  const conf = Math.round(96 - (spread / Math.max(blend, 8)) * 22)
  return (
    <div className="animate-rise relative overflow-hidden rounded-[22px] border border-line bg-ink-2/85 backdrop-blur-xl [animation-delay:250ms]">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="label flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tide" />Live blend · 00 UTC run</span>
        <span className="font-mono text-[11px] text-faint">+24 h</span>
      </div>
      <div className="flex gap-1 overflow-x-auto px-3 pt-3 [scrollbar-width:none]">
        {STATIONS.map((x) => (
          <button key={x.id} onClick={() => setSid(x.id)} className={`shrink-0 rounded-full px-3 py-1 font-mono text-[11px] tracking-wider transition ${x.id === sid ? 'bg-paper text-ink' : 'text-dim hover:text-paper'}`}>{x.id}</button>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_auto] items-end gap-4 px-5 pt-6">
        <div>
          <div className="text-sm text-dim">{s.city} · {s.region}</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-7xl leading-none tabular-nums">{blend.toFixed(1)}</span>
            <span className="font-mono text-sm text-dim">mm / 24 h</span>
          </div>
        </div>
        <div className="text-right">
          <div className="label">Confidence</div>
          <div className="font-mono text-2xl text-tide">{conf}%</div>
        </div>
      </div>
      <div className="mt-6 space-y-2.5 px-5">
        {MODELS.map((m, i) => (
          <div key={m.key} className="grid grid-cols-[76px_1fr_44px_36px] items-center gap-3 font-mono text-[11px]">
            <span className="text-dim">{m.name}</span>
            <div className="relative h-[6px] rounded-full bg-paper/5">
              <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${(s.rain[i] / max) * 100}%`, background: m.color, opacity: 0.85 }} />
              <div className="absolute -top-1 h-[14px] w-px bg-saffron transition-all duration-700" style={{ left: `${(blend / max) * 100}%` }} />
            </div>
            <span className="text-right tabular-nums">{s.rain[i]}</span>
            <span className="text-right text-faint">{Math.round(w[i] * 100)}%</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-line px-5 py-4">
        <div className="flex items-center gap-2.5 text-sm">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: levelColor[s.level] }} />
          {s.alert}
        </div>
        <span className="font-mono text-[11px] text-faint">{s.regime}</span>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden px-5 pb-16 pt-28 lg:pt-20 md:px-10">
      <img src={HERO_IMG} alt="Monsoon cloud bank lit by low golden sunlight" className="absolute inset-0 -z-20 h-full w-full object-cover " style={{ opacity: 'var(--hero-img)' }} />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--ink)_55%,transparent),color-mix(in_srgb,var(--ink)_35%,transparent)_40%,var(--ink))]" />
      <div className="isobars absolute inset-0 -z-10 opacity-70" />
      <div className="mx-auto grid max-w-[1320px] items-end gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <div className="animate-rise">
          <div className="label mb-8 flex flex-wrap gap-x-5 gap-y-2">
            <span className="text-saffron">Forecast intelligence</span><span>Disaster management</span><span>India</span>
          </div>
          <h1 className="font-display text-[clamp(3.2rem,8.4vw,8rem)] leading-[0.88] tracking-[-0.02em]">
            Six forecasts<br />disagree. <em className="text-saffron">One</em><br />tells you why.
          </h1>
          <p className="mt-10 max-w-[34rem] text-lg leading-relaxed text-paper/75">
            Meridian is a hybrid AI–NWP blending system. It learns where, when and in which weather regime each model is trustworthy — then fuses them into a single, explainable forecast for every district in India.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#/weighting" className="group rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition hover:bg-saffron">Open the weighting engine <span className="inline-block transition group-hover:translate-x-1">→</span></a>
            <a href="#/system" className="px-2 py-3 text-sm text-paper/70 underline decoration-paper/20 underline-offset-8 transition hover:text-paper hover:decoration-saffron">How the blend works</a>
          </div>
        </div>
        <Console />
      </div>
      <div className="mx-auto mt-20 grid max-w-[1320px] grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
        {[['−38%', 'RMSE vs. best single model'], ['6', 'Physical, ensemble & AI sources'], ['0.25°', 'Common analysis grid'], ['6–72 h', 'Operational lead times']].map(([v, l]) => (
          <div key={l} className="bg-ink/90 px-6 py-6">
            <div className="font-display text-4xl">{v}</div>
            <div className="mt-1 text-sm text-dim">{l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Gap() {
  const items = ['Single models perform well in some regions, but not all', 'Static averaging ignores context', 'Regional & lead-time skill varies significantly', 'Operations need adaptive, explainable, automated blending']
  return (
    <div className="border-y border-line bg-ink-2 py-5">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-4 px-5 md:flex-row md:items-center md:gap-10 md:px-10">
        <span className="label shrink-0 text-storm">The existing gap</span>
        <div className="grid flex-1 gap-3 text-sm text-paper/80 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t, i) => <div key={t} className="flex gap-3"><span className="font-mono text-faint">{String(i + 1).padStart(2, '0')}</span>{t}</div>)}
        </div>
      </div>
    </div>
  )
}

function Problem() {
  const rows = [
    ['Different models show varying skill', 'Adaptive multi-model blending instead of single-model reliance'],
    ['Skill varies by region', 'Region-specific model weighting'],
    ['Skill varies by season and lead time', 'Dynamic weights conditioned on season and forecast horizon'],
    ['Extreme weather events are difficult', 'Enhanced detection from blended forecasts and AI/ML indicators'],
    ['Lack of confidence in any single model', 'Explainable forecasts with model contribution and verification'],
  ]
  return (
    <Section id="problem" index="§ 01" kicker="Problem → Solution" title={<>No model is right everywhere.<br /><span className="text-dim">So stop picking one.</span></>}>
      <div className="lg:ml-[244px]">
        {rows.map(([p, s], i) => (
          <div key={p} className="group grid items-baseline gap-2 border-t border-line py-6 transition-colors hover:bg-paper/[0.02] md:grid-cols-[48px_1fr_40px_1.2fr] md:gap-6">
            <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, '0')}</span>
            <span className="text-lg text-dim line-through decoration-storm/50 decoration-1">{p}</span>
            <span className="hidden text-saffron transition group-hover:translate-x-1 md:block">→</span>
            <span className="font-display text-2xl leading-tight md:text-[1.7rem]">{s}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Flow() {
  const [a, setA] = useState(2)
  const f = FLOW[a]
  return (
    <Section id="flow" index="§ 02" kicker="Proposed solution" title={<>From five sources<br />to one <em>consensus.</em></>}>
      <div className="grid grid-cols-5 gap-1.5">
        {FLOW.map((x, i) => (
          <button key={x.n} onClick={() => setA(i)} className={`group relative overflow-hidden rounded-xl border px-3 py-4 text-left transition md:px-5 md:py-6 ${i === a ? 'border-saffron/60 bg-saffron/[0.07]' : 'border-line hover:border-paper/25'}`}>
            <div className={`font-mono text-xs ${i === a ? 'text-saffron' : 'text-faint'}`}>{x.n}</div>
            <div className="mt-6 hidden text-base font-medium md:block">{x.title}</div>
            <div className="label mt-1 hidden md:block">{x.sub}</div>
            <div className={`absolute bottom-0 left-0 h-[2px] bg-saffron transition-all duration-500 ${i <= a ? 'w-full' : 'w-0'}`} />
          </button>
        ))}
      </div>
      <div key={a} className="animate-rise mt-4 grid gap-10 rounded-2xl border border-line bg-ink-2 p-8 md:p-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <div className="label">Stage {f.n} / 05</div>
          <h3 className="mt-4 font-display text-5xl">{f.title}</h3>
          <p className="mt-6 max-w-sm text-dim">{f.note}</p>
        </div>
        <ul className="grid gap-px self-start overflow-hidden rounded-xl bg-line sm:grid-cols-2">
          {f.items.map((it) => <li key={it} className="bg-ink-2 p-5 text-[15px] leading-snug"><span className="mb-3 block h-1 w-4 bg-saffron" />{it}</li>)}
        </ul>
      </div>
    </Section>
  )
}

function Engine() {
  const [region, setRegion] = useState('North-East')
  const [season, setSeason] = useState('Monsoon')
  const [lead, setLead] = useState(48)
  const weights = useMemo(() => {
    const lf = LEAD_FACTOR(lead)
    const raw = MODELS.map((m) => SKILL[season][m.key] * (REGION_BIAS[region][m.key] ?? 1) * (lf[m.key] ?? 1))
    const sq = raw.map((r) => r ** 2)
    const t = sq.reduce((a, b) => a + b, 0)
    return sq.map((v) => v / t)
  }, [region, season, lead])
  const top = MODELS[weights.indexOf(Math.max(...weights))]
  let acc = 0
  const Pill = ({ opts, v, set }: { opts: string[]; v: string; set: (s: string) => void }) => (
    <div className="flex flex-wrap gap-1.5">
      {opts.map((o) => (
        <button key={o} onClick={() => set(o)} className={`rounded-full border px-3.5 py-1.5 text-sm transition ${o === v ? 'border-paper bg-paper text-ink' : 'border-line text-dim hover:border-paper/30 hover:text-paper'}`}>{o}</button>
      ))}
    </div>
  )
  return (
    <Section id="engine" index="§ 03" kicker="Adaptive AI weighting" title={<>Weights that move<br />with the <em className="text-tide">weather.</em></>} className="bg-ink-2 grain">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-8 rounded-2xl border border-line bg-ink p-7">
          <div><div className="label mb-3">Region</div><Pill opts={Object.keys(REGION_BIAS)} v={region} set={setRegion} /></div>
          <div><div className="label mb-3">Season</div><Pill opts={Object.keys(SKILL)} v={season} set={setSeason} /></div>
          <div>
            <div className="label mb-3 flex justify-between"><span>Lead time</span><span className="text-paper">+{lead} h</span></div>
            <input type="range" min={6} max={168} step={6} value={lead} onChange={(e) => setLead(+e.target.value)} className="w-full accent-[var(--saffron)]" aria-label="Lead time in hours" />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-faint"><span>6 h</span><span>72 h</span><span>7 d</span></div>
          </div>
          <div className="border-t border-line pt-6 font-display text-3xl">
            F<sub className="font-mono text-xs">blend</sub> = <span className="text-saffron">Σ</span> w<sub className="font-mono text-xs">i</sub> · F<sub className="font-mono text-xs">i</sub>
            <p className="mt-3 font-sans text-sm text-dim">XGBoost meta-learner over location, season, lead time, regime, recent skill and model spread.</p>
          </div>
        </div>
        <div className="flex flex-col rounded-2xl border border-line bg-ink p-7 md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="label">Dominant contributor</div>
              <div className="mt-2 font-display text-6xl" style={{ color: top.color }}>{top.name}</div>
            </div>
            <p className="max-w-xs text-sm text-dim">Trusted most for <span className="text-paper">{region}</span> in <span className="text-paper">{season.toLowerCase()}</span> at <span className="text-paper">+{lead} h</span> — based on rolling-window RMSE, MAE and bias.</p>
          </div>
          <div className="mt-10 flex h-14 overflow-hidden rounded-lg">
            {MODELS.map((m, i) => <div key={m.key} className="transition-all duration-700 ease-out" style={{ width: `${weights[i] * 100}%`, background: m.color }} title={`${m.name} ${(weights[i] * 100).toFixed(1)}%`} />)}
          </div>
          <div className="mt-8 grid flex-1 gap-x-10 sm:grid-cols-2">
            {MODELS.map((m, i) => {
              acc += weights[i]
              return (
                <div key={m.key} className="flex items-center justify-between border-t border-line py-4">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
                    <div><div className="text-[15px]">{m.name}</div><div className="label !text-[10px]">{m.kind}</div></div>
                  </div>
                  <span className="font-mono text-lg tabular-nums">{(weights[i] * 100).toFixed(1)}<span className="text-faint">%</span></span>
                </div>
              )
            })}
          </div>
          <div className="sr-only">{acc}</div>
        </div>
      </div>
    </Section>
  )
}

function Verify() {
  const [metric, setMetric] = useState<keyof typeof VERIFY>('RMSE')
  const data = VERIFY[metric]
  const keys = [...MODELS.map((m) => m.key), 'BLEND'] as (ModelKey | 'BLEND')[]
  const isBias = metric === 'Bias'
  const max = isBias ? 0.8 : 5
  const H = 260
  return (
    <Section id="verify" index="§ 04" kicker="Model skill & verification" title={<>Measured, not <em>claimed.</em></>}>
      <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-line p-6 md:p-10">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex rounded-full border border-line p-1">
              {(Object.keys(VERIFY) as (keyof typeof VERIFY)[]).map((k) => (
                <button key={k} onClick={() => setMetric(k)} className={`rounded-full px-4 py-1.5 font-mono text-xs transition ${k === metric ? 'bg-paper text-ink' : 'text-dim hover:text-paper'}`}>{k}</button>
              ))}
            </div>
            <span className="label">{isBias ? 'closer to 0 is better' : 'lower is better'} · rainfall, mm</span>
          </div>
          <div className="relative" style={{ height: H }}>
            {isBias && <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-paper/25" />}
            {!isBias && [0, 1, 2, 3, 4].map((g) => <div key={g} className="absolute inset-x-0 border-t border-line" style={{ bottom: `${(g / max) * 100}%` }}><span className="absolute -top-2 -left-1 -translate-x-full font-mono text-[10px] text-faint">{g}</span></div>)}
            <div className="relative grid h-full grid-cols-7 gap-2 pl-4 md:gap-5">
              {keys.map((k) => {
                const v = data[k]
                const blend = k === 'BLEND'
                const color = blend ? 'var(--color-saffron)' : MODELS.find((m) => m.key === k)!.color
                const h = (Math.abs(v) / max) * (isBias ? 50 : 100)
                return (
                  <div key={k} className="relative h-full">
                    <div className="absolute inset-x-0 rounded-[3px] transition-all duration-700 ease-out" style={{ height: `${h}%`, background: color, opacity: blend ? 1 : 0.55, ...(isBias ? (v >= 0 ? { bottom: '50%' } : { top: '50%' }) : { bottom: 0 }) }} />
                    <div className="absolute inset-x-0 text-center font-mono text-[11px] transition-all duration-700" style={isBias ? (v >= 0 ? { bottom: `calc(50% + ${h}% + 6px)` } : { top: `calc(50% + ${h}% + 6px)` }) : { bottom: `calc(${h}% + 6px)` }}>{v > 0 && isBias ? '+' : ''}{v}</div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2 pl-4 md:gap-5">
            {keys.map((k) => <div key={k} className={`text-center font-mono text-[10px] md:text-[11px] ${k === 'BLEND' ? 'text-saffron' : 'text-dim'}`}>{k === 'BLEND' ? 'Blended' : k === 'AI' ? 'AI' : k}</div>)}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-10">
          <div>
            <div className="font-display text-[7rem] leading-none text-saffron">{metric === 'Bias' ? '≈0' : `${Math.round((1 - data.BLEND / data.AI) * 100)}%`}</div>
            <p className="mt-4 text-dim">{metric === 'Bias' ? 'Blended bias collapses toward zero as over- and under-predicting models cancel under learned weights.' : `lower ${metric} than the strongest individual model — and ${Math.round((1 - data.BLEND / data.GFS) * 100)}% lower than GFS.`}</p>
          </div>
          <div className="border-t border-line pt-6">
            <div className="label mb-3">Evaluation framework</div>
            <p className="text-sm leading-relaxed text-paper/75">Blended output is verified against IMD station, satellite and radar observations using RMSE, MAE, bias and correlation — across regions, seasons and lead times. Skill scores feed back into the weight database on a rolling window.</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

function Apply() {
  return (
    <Section id="apply" index="§ 05" kicker="Practical applications" title={<>Where a better forecast<br /><em>changes the outcome.</em></>}>
      <div className="grid auto-rows-[260px] gap-3 md:grid-cols-6">
        {APPS.map((a, i) => (
          <figure key={a.t} className={`group relative overflow-hidden rounded-2xl bg-ink-3 ${i < 2 ? 'md:col-span-3 md:row-span-1' : 'md:col-span-2'} ${i === 0 ? 'md:row-span-2' : ''}`}>
            <img src={a.img} alt={a.t} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale-[35%] transition duration-700 group-hover:scale-[1.04] group-hover:opacity-90 group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <span className={`font-display leading-tight ${i === 0 ? 'text-4xl' : 'text-2xl'}`}>{a.t}</span>
              <span className="label shrink-0 !text-paper/70">{a.tag}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}

function Viability() {
  const tabs = Object.keys(FEAS) as (keyof typeof FEAS)[]
  const [t, setT] = useState<keyof typeof FEAS>('Feasibility')
  const [open, setOpen] = useState(0)
  const tone = t === 'Risks' ? 'text-storm' : t === 'Strategies' ? 'text-leaf' : 'text-tide'
  return (
    <Section id="viability" index="§ 06" kicker="Feasibility & viability" title={<>Built on what India<br />already <em>operates.</em></>} className="bg-ink-2">
      <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-6">
        <div className="flex gap-2 lg:flex-col">
          {tabs.map((k, i) => (
            <button key={k} onClick={() => { setT(k); setOpen(0) }} className={`flex items-baseline gap-3 text-left transition ${k === t ? 'text-paper' : 'text-faint hover:text-dim'}`}>
              <span className="font-mono text-xs">{i + 1}.</span><span className="font-display text-2xl lg:text-3xl">{k === 'Feasibility' ? 'Feasibility' : k === 'Risks' ? 'Challenges' : 'Strategies'}</span>
            </button>
          ))}
        </div>
        <div>
          {FEAS[t].map(([h, b], i) => (
            <button key={h} onClick={() => setOpen(i)} className="block w-full border-t border-line py-6 text-left last:border-b">
              <div className="flex items-center justify-between gap-6">
                <span className="flex items-baseline gap-5"><span className={`font-mono text-xs ${tone}`}>{String(i + 1).padStart(2, '0')}</span><span className="text-xl">{h}</span></span>
                <span className={`font-mono text-lg text-faint transition-transform ${open === i ? 'rotate-45' : ''}`}>+</span>
              </div>
              <div className={`grid transition-all duration-500 ${open === i ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <p className="max-w-2xl overflow-hidden pl-9 leading-relaxed text-dim">{b}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Impact() {
  return (
    <Section id="impact" index="§ 07" kicker="Impact & benefits" title={<>For a safer, more resilient<br /><em className="text-saffron">India.</em></>}>
      <p className="mb-16 max-w-3xl text-xl leading-relaxed text-paper/80 lg:ml-[244px]">
        Empowers government agencies, disaster-management authorities, researchers, planners and citizens with accurate, location-specific and timely forecasts — for disaster response, agriculture, infrastructure and environmental conservation.
      </p>
      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((b) => (
          <div key={b.k} className="bg-ink p-8 transition-colors hover:bg-ink-2">
            <div className="h-px w-10" style={{ background: b.c }} />
            <h3 className="mt-6 font-display text-3xl">{b.k}</h3>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-dim">
              {b.pts.map((p) => <li key={p} className="flex gap-3"><span style={{ color: b.c }}>—</span>{p}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Overview() {
  return (
    <>
      <Hero />
      <Gap />
      <Problem />
      <section className="border-t border-line px-5 py-24 md:px-10">
        <div className="mx-auto grid max-w-[1320px] gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {[['live', 'Live analysis', 'Search any location and blend six real model runs.'], ['weighting', 'Weighting engine', 'See how trust shifts with region, season and lead time.'], ['verification', 'Verification', 'RMSE, MAE and bias against every single model.']].map(([id, t, d]) => (
            <a key={id} href={`#/${id}`} className="group bg-ink p-8 transition hover:bg-ink-2">
              <div className="label text-saffron">Explore</div>
              <div className="mt-6 font-display text-4xl">{t}</div>
              <p className="mt-3 text-sm text-dim">{d}</p>
              <div className="mt-10 text-2xl transition group-hover:translate-x-2 group-hover:text-saffron">→</div>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}

const ROUTES: Record<string, () => React.ReactNode> = {
  overview: Overview,
  live: Analysis,
  system: Flow,
  weighting: Engine,
  verification: Verify,
  applications: Apply,
  viability: Viability,
  impact: Impact,
  team: Team,
  contact: Contact,
}

export default function App() {
  const route = useRoute()
  const Page = ROUTES[route] ?? NotFound
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('meridian-nav') === 'collapsed')
  useEffect(() => localStorage.setItem('meridian-nav', collapsed ? 'collapsed' : 'open'), [collapsed])
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Sidebar route={route} collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={`pt-16 transition-[padding] duration-300 lg:pt-0 ${collapsed ? 'lg:pl-[76px]' : 'lg:pl-[264px]'}`}>
        <div key={route} className="animate-rise">
          <Page />
        </div>
        <PagerFooter route={route} />
      </main>
    </div>
  )
}
