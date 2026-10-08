import { useEffect, useMemo, useState } from 'react'

const LIVE_MODELS = [
  { id: 'ecmwf_ifs025', name: 'ECMWF IFS', kind: 'Global NWP', color: '#c9b99a', prior: 1.1 },
  { id: 'ecmwf_aifs025_single', name: 'ECMWF AIFS', kind: 'AI / ML', color: '#78d0c3', prior: 1.15 },
  { id: 'gfs_seamless', name: 'GFS', kind: 'Global NWP', color: '#8b95a1', prior: 0.9 },
  { id: 'icon_seamless', name: 'ICON', kind: 'Global NWP', color: '#9fb4d9', prior: 1 },
  { id: 'ukmo_seamless', name: 'UKMO · NCUM', kind: 'Unified Model', color: '#b69fd1', prior: 1.05 },
  { id: 'jma_seamless', name: 'JMA', kind: 'Global NWP', color: '#7fbf6a', prior: 0.9 },
]

const VARS = {
  rain: { key: 'precipitation_sum', label: 'Rainfall', unit: 'mm' },
  temp: { key: 'temperature_2m_max', label: 'Max temp', unit: '°C' },
  wind: { key: 'wind_speed_10m_max', label: 'Max wind', unit: 'km/h' },
} as const
type VarKey = keyof typeof VARS

type Place = { name: string; admin1?: string; country?: string; latitude: number; longitude: number }
type Series = Record<VarKey, (number | null)[][]> // [model][day]

const PRESETS: Place[] = [
  { name: 'Guwahati', admin1: 'Assam', country: 'India', latitude: 26.18, longitude: 91.75 },
  { name: 'Mumbai', admin1: 'Maharashtra', country: 'India', latitude: 19.07, longitude: 72.88 },
  { name: 'Chennai', admin1: 'Tamil Nadu', country: 'India', latitude: 13.08, longitude: 80.27 },
  { name: 'New Delhi', admin1: 'Delhi', country: 'India', latitude: 28.61, longitude: 77.21 },
  { name: 'Bhubaneswar', admin1: 'Odisha', country: 'India', latitude: 20.3, longitude: 85.82 },
]

const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2 }

// Consensus weighting: models that stay close to the ensemble median earn trust, scaled by a skill prior.
function blend(rows: (number | null)[][]) {
  const days = rows[0]?.length ?? 0
  const err = LIVE_MODELS.map(() => [] as number[])
  for (let d = 0; d < days; d++) {
    const vals = rows.map((r) => r[d]).filter((v): v is number => v != null)
    if (vals.length < 2) continue
    const med = median(vals)
    const scale = Math.max(median(vals.map((v) => Math.abs(v - med))), 0.5)
    rows.forEach((r, i) => r[d] != null && err[i].push(Math.abs(r[d]! - med) / scale))
  }
  const raw = LIVE_MODELS.map((m, i) => (err[i].length ? m.prior / (0.4 + err[i].reduce((a, b) => a + b, 0) / err[i].length) : 0))
  const t = raw.reduce((a, b) => a + b, 0) || 1
  const w = raw.map((r) => r / t)
  const series = Array.from({ length: days }, (_, d) => {
    let s = 0, ws = 0
    rows.forEach((r, i) => { if (r[d] != null) { s += r[d]! * w[i]; ws += w[i] } })
    const vals = rows.map((r) => r[d]).filter((v): v is number => v != null)
    return { v: ws ? s / ws : 0, lo: Math.min(...vals), hi: Math.max(...vals) }
  })
  return { w, series }
}

function Chart({ rows, series, unit, labels }: { rows: (number | null)[][]; series: { v: number; lo: number; hi: number }[]; unit: string; labels: string[] }) {
  const W = 720, H = 280, P = { l: 40, r: 16, t: 16, b: 32 }
  const all = rows.flat().filter((v): v is number => v != null)
  const lo = Math.min(0, ...all), hi = Math.max(...all, 1) * 1.1
  const x = (d: number) => P.l + (d / Math.max(series.length - 1, 1)) * (W - P.l - P.r)
  const y = (v: number) => P.t + (1 - (v - lo) / (hi - lo)) * (H - P.t - P.b)
  const path = (pts: (number | null)[]) => pts.map((v, d) => (v == null ? '' : `${d && pts[d - 1] != null ? 'L' : 'M'}${x(d)},${y(v)}`)).join('')
  const band = series.map((s, d) => `${d ? 'L' : 'M'}${x(d)},${y(s.hi)}`).join('') + [...series].reverse().map((s, i) => `L${x(series.length - 1 - i)},${y(s.lo)}`).join('') + 'Z'
  const ticks = Array.from({ length: 5 }, (_, i) => lo + ((hi - lo) * i) / 4)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`7-day multi-model forecast in ${unit}`}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke="var(--line)" />
          <text x={P.l - 8} y={y(t) + 3} textAnchor="end" className="fill-faint font-mono text-[10px]">{Math.round(t)}</text>
        </g>
      ))}
      <path d={band} fill="var(--saffron)" opacity="0.1" />
      {rows.map((r, i) => <path key={i} d={path(r)} fill="none" stroke={LIVE_MODELS[i].color} strokeWidth="1.25" opacity="0.6" />)}
      <path d={path(series.map((s) => s.v))} fill="none" stroke="var(--saffron)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {series.map((s, d) => (
        <g key={d}>
          <circle cx={x(d)} cy={y(s.v)} r="4" fill="var(--ink)" stroke="var(--saffron)" strokeWidth="2" />
          <text x={x(d)} y={H - 10} textAnchor="middle" className="fill-dim font-mono text-[10px]">{labels[d]}</text>
        </g>
      ))}
    </svg>
  )
}

export function Analysis() {
  const [place, setPlace] = useState<Place>(PRESETS[0])
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<Place[]>([])
  const [data, setData] = useState<{ time: string[]; s: Series; elev: number } | null>(null)
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  const [v, setV] = useState<VarKey>('rain')

  useEffect(() => {
    if (q.trim().length < 2) return setHits([])
    const c = new AbortController()
    const t = setTimeout(() => {
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=en`, { signal: c.signal })
        .then((r) => r.json()).then((j) => setHits(j.results ?? [])).catch(() => {})
    }, 250)
    return () => { clearTimeout(t); c.abort() }
  }, [q])

  useEffect(() => {
    const c = new AbortController()
    setState('loading')
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&daily=${Object.values(VARS).map((x) => x.key).join(',')}&models=${LIVE_MODELS.map((m) => m.id).join(',')}&timezone=auto&forecast_days=7`
    fetch(url, { signal: c.signal })
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then((j) => {
        const s = {} as Series
        for (const k of Object.keys(VARS) as VarKey[]) s[k] = LIVE_MODELS.map((m) => j.daily[`${VARS[k].key}_${m.id}`] ?? j.daily.time.map(() => null))
        setData({ time: j.daily.time, s, elev: j.elevation })
        setState('ok')
      })
      .catch((e) => e.name !== 'AbortError' && setState('error'))
    return () => c.abort()
  }, [place])

  const res = useMemo(() => {
    if (!data) return null
    const out = {} as Record<VarKey, ReturnType<typeof blend>>
    for (const k of Object.keys(VARS) as VarKey[]) out[k] = blend(data.s[k])
    return out
  }, [data])

  const labels = data?.time.map((t) => new Date(t).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })) ?? []

  const insights = useMemo(() => {
    if (!res || !data) return null
    const rain = res.rain.series, temp = res.temp.series, wind = res.wind.series
    const total = rain.reduce((a, s) => a + s.v, 0)
    const peak = rain.reduce((b, s, i) => (s.v > rain[b].v ? i : b), 0)
    const tmax = Math.max(...temp.map((s) => s.v))
    const wmax = Math.max(...wind.map((s) => s.v))
    const cur = res[v].series
    const spread = cur.reduce((a, s) => a + (s.hi - s.lo), 0) / cur.length
    const ref = Math.max(cur.reduce((a, s) => a + Math.abs(s.v), 0) / cur.length, v === 'rain' ? 5 : 1)
    const agree = Math.max(5, Math.min(99, Math.round(100 - (spread / ref) * (v === 'rain' ? 25 : 60))))
    // IMD operational thresholds
    const alerts: { level: string; color: string; text: string }[] = []
    rain.forEach((s, i) => {
      if (s.v >= 115.6) alerts.push({ level: 'Red', color: 'var(--color-storm)', text: `Very heavy rainfall · ${s.v.toFixed(0)} mm on ${labels[i]}` })
      else if (s.v >= 64.5) alerts.push({ level: 'Orange', color: 'var(--saffron)', text: `Heavy rainfall · ${s.v.toFixed(0)} mm on ${labels[i]}` })
      else if (s.hi >= 64.5) alerts.push({ level: 'Watch', color: '#d8c35a', text: `Heavy rain possible on ${labels[i]} — ${data.s.rain.filter((r) => (r[i] ?? 0) >= 64.5).length} model(s) exceed 64.5 mm` })
    })
    temp.forEach((s, i) => { if (s.v >= 40) alerts.push({ level: s.v >= 45 ? 'Red' : 'Orange', color: s.v >= 45 ? 'var(--color-storm)' : 'var(--saffron)', text: `Heat-wave conditions · ${s.v.toFixed(1)}°C on ${labels[i]}` }) })
    wind.forEach((s, i) => { if (s.v >= 62) alerts.push({ level: 'Orange', color: 'var(--saffron)', text: `Gale-force winds · ${s.v.toFixed(0)} km/h on ${labels[i]}` }) })
    const wetDays = rain.filter((s) => s.v >= 2.5).length
    const summary = total < 5
      ? `A largely dry week, with ${total.toFixed(1)} mm expected in total. Highs peak near ${tmax.toFixed(0)}°C.`
      : `${wetDays} rainy day${wetDays === 1 ? '' : 's'} ahead (IMD ≥ 2.5 mm), ${total.toFixed(0)} mm in total, heaviest on ${labels[peak]} at ${rain[peak].v.toFixed(0)} mm. Highs up to ${tmax.toFixed(0)}°C, gusty winds to ${wmax.toFixed(0)} km/h.`
    return { total, peak, tmax, wmax, agree, alerts, summary }
  }, [res, data, v])

  const pick = (p: Place) => { setPlace(p); setQ(''); setHits([]) }
  const cur = res?.[v]
  const top = cur ? cur.w.indexOf(Math.max(...cur.w)) : 0

  return (
    <section id="live" className="border-t border-line px-5 py-24 md:px-10 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 grid gap-6 lg:grid-cols-[220px_1fr]">
          <div className="label flex gap-3 pt-3"><span className="text-saffron">Live</span><span>Location analysis</span></div>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <h2 className="font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.01em]">Any place. Six models.<br /><em>One blended answer.</em></h2>
            <div className="relative w-full max-w-sm">
              <label className="label mb-2 block" htmlFor="loc">Enter a location</label>
              <input id="loc" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && hits[0] && pick(hits[0])} placeholder="Search a city, town or district…" autoComplete="off"
                className="w-full rounded-full border border-paper/20 bg-transparent px-5 py-3 text-[15px] outline-none transition placeholder:text-faint focus:border-saffron" />
              {hits.length > 0 && (
                <ul className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-line bg-ink-2 shadow-2xl">
                  {hits.map((h, i) => (
                    <li key={i}><button onClick={() => pick(h)} className="flex w-full justify-between gap-4 px-5 py-3 text-left text-sm transition hover:bg-paper/5">
                      <span>{h.name}<span className="text-dim">{h.admin1 ? `, ${h.admin1}` : ''}</span></span>
                      <span className="font-mono text-[11px] text-faint">{h.country}</span>
                    </button></li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2 lg:ml-[244px]">
          {PRESETS.map((p) => (
            <button key={p.name} onClick={() => pick(p)} className={`rounded-full border px-3.5 py-1.5 text-sm transition ${p.name === place.name ? 'border-paper bg-paper text-ink' : 'border-line text-dim hover:text-paper'}`}>{p.name}</button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-ink-2">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5 md:px-8">
            <div>
              <div className="font-display text-3xl md:text-4xl">{place.name}<span className="text-dim">{place.admin1 ? `, ${place.admin1}` : ''}</span></div>
              <div className="mt-1 font-mono text-[11px] text-faint">{place.latitude.toFixed(2)}°, {place.longitude.toFixed(2)}° {data ? `· ${data.elev.toFixed(0)} m elev.` : ''} · 7-day · Open-Meteo</div>
            </div>
            <div className="flex rounded-full border border-line p-1">
              {(Object.keys(VARS) as VarKey[]).map((k) => (
                <button key={k} onClick={() => setV(k)} className={`rounded-full px-4 py-1.5 text-xs transition ${k === v ? 'bg-paper text-ink' : 'text-dim hover:text-paper'}`}>{VARS[k].label}</button>
              ))}
            </div>
          </div>

          {state === 'error' && <div className="px-8 py-24 text-center text-dim">Couldn't reach the forecast service. Check your connection and try another location.</div>}
          {state === 'loading' && !data && <div className="px-8 py-24 text-center"><span className="label animate-pulse">Fetching six model runs…</span></div>}

          {data && res && cur && insights && (
            <div className={`transition-opacity duration-300 ${state === 'loading' ? 'opacity-40' : ''}`}>
              <div className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
                {[
                  ['7-day rainfall', `${insights.total.toFixed(1)}`, 'mm blended'],
                  ['Peak rain day', labels[insights.peak], `${res.rain.series[insights.peak].v.toFixed(1)} mm`],
                  ['Hottest', insights.tmax.toFixed(1), '°C max'],
                  ['Model agreement', `${insights.agree}%`, VARS[v].label.toLowerCase()],
                ].map(([k, val, s]) => (
                  <div key={k} className="bg-ink-2 px-6 py-6 md:px-8">
                    <div className="label">{k}</div>
                    <div className="mt-2 font-display text-4xl md:text-5xl">{val}</div>
                    <div className="mt-1 text-sm text-dim">{s}</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-px bg-line lg:grid-cols-[1.6fr_1fr]">
                <div className="bg-ink-2 p-6 md:p-8">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="label">{VARS[v].label} · {VARS[v].unit}</span>
                    <span className="flex items-center gap-4 text-xs text-dim">
                      <span className="flex items-center gap-2"><span className="h-[3px] w-5 rounded bg-saffron" />Blended</span>
                      <span className="flex items-center gap-2"><span className="h-3 w-5 rounded-sm bg-saffron/15" />Model spread</span>
                    </span>
                  </div>
                  <Chart rows={data.s[v]} series={cur.series} unit={VARS[v].unit} labels={labels} />
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[560px] font-mono text-[11px]">
                      <thead><tr className="text-faint"><th className="py-2 text-left font-normal">Model</th>{labels.map((l) => <th key={l} className="py-2 text-right font-normal">{l.split(' ')[0]}</th>)}</tr></thead>
                      <tbody>
                        {LIVE_MODELS.map((m, i) => (
                          <tr key={m.id} className="border-t border-line text-dim">
                            <td className="py-2"><span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: m.color }} />{m.name}</td>
                            {data.s[v][i].map((x, d) => <td key={d} className="py-2 text-right tabular-nums">{x == null ? '—' : x.toFixed(v === 'rain' ? 1 : 0)}</td>)}
                          </tr>
                        ))}
                        <tr className="border-t border-saffron/40 text-saffron">
                          <td className="py-2">Blended</td>
                          {cur.series.map((s, d) => <td key={d} className="py-2 text-right tabular-nums">{s.v.toFixed(v === 'rain' ? 1 : 0)}</td>)}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex flex-col bg-ink-2">
                  <div className="border-b border-line p-6 md:p-8">
                    <div className="label mb-3">Analyst summary</div>
                    <p className="text-[15px] leading-relaxed text-paper/85">{insights.summary}</p>
                  </div>
                  <div className="border-b border-line p-6 md:p-8">
                    <div className="label mb-4 flex justify-between"><span>Learned weights</span><span>{VARS[v].label}</span></div>
                    <div className="space-y-3">
                      {LIVE_MODELS.map((m, i) => (
                        <div key={m.id} className="grid grid-cols-[96px_1fr_44px] items-center gap-3 text-xs">
                          <span className={i === top ? 'text-paper' : 'text-dim'}>{m.name}</span>
                          <div className="h-1.5 rounded-full bg-paper/5"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${(cur.w[i] / Math.max(...cur.w)) * 100}%`, background: m.color }} /></div>
                          <span className="text-right font-mono tabular-nums">{(cur.w[i] * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-faint">{LIVE_MODELS[top].name} leads this week: it tracks the ensemble consensus most closely, adjusted by prior skill.</p>
                  </div>
                  <div className="flex-1 p-6 md:p-8">
                    <div className="label mb-4">Risk & alerts · IMD thresholds</div>
                    {insights.alerts.length ? (
                      <ul className="space-y-3">
                        {insights.alerts.slice(0, 5).map((a, i) => (
                          <li key={i} className="flex gap-3 text-sm"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-sm" style={{ background: a.color }} /><span><span className="font-mono text-[11px] uppercase tracking-wider text-dim">{a.level} · </span>{a.text}</span></li>
                        ))}
                      </ul>
                    ) : <p className="text-sm text-dim">No heavy-rain, heat-wave or gale thresholds crossed in the blended forecast.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
