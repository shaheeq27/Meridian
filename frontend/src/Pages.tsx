import { useState } from 'react'
import { PAGES } from './Sidebar'

export function PageHead({ index, kicker, title, lede }: { index: string; kicker: string; title: React.ReactNode; lede?: string }) {
  return (
    <div className="mb-14 grid gap-6 lg:grid-cols-[220px_1fr]">
      <div className="label flex gap-3 pt-3"><span className="text-saffron">{index}</span><span>{kicker}</span></div>
      <div>
        <h1 className="font-display text-[clamp(2.6rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.01em]">{title}</h1>
        {lede && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-dim">{lede}</p>}
      </div>
    </div>
  )
}

const TEAM = [
  { n: 'Team Lead', r: 'Product & ML architecture', f: 'Owns the meta-learner and blending strategy.', i: 'TL' },
  { n: 'Data Engineer', r: 'Ingestion & preprocessing', f: 'GRIB/NetCDF pipelines, ESMF regridding, QC.', i: 'DE' },
  { n: 'ML Engineer', r: 'Skill & weighting models', f: 'XGBoost / PyTorch weighting and verification.', i: 'ML' },
  { n: 'Atmospheric Analyst', r: 'NWP & regime analysis', f: 'Monsoon regimes, IMD thresholds, validation.', i: 'AA' },
  { n: 'Backend Engineer', r: 'APIs & infrastructure', f: 'FastAPI, PostGIS, Docker / Kubernetes.', i: 'BE' },
  { n: 'Frontend Engineer', r: 'Dashboard & visualisation', f: 'Maps, charts, alerts and this interface.', i: 'FE' },
]

const STACK = [
  ['Data sources', 'IMD, ECMWF, GFS, WRF, INSAT, Doppler radar, AWS'],
  ['Processing', 'Python, xarray, pandas, Rasterio, GDAL, ESMF'],
  ['Models', 'NWP + LSTM, Transformer, XGBoost ensembles'],
  ['Backend & API', 'FastAPI, NetCDF / GRIB handling'],
  ['Storage', 'PostgreSQL / PostGIS, MinIO object storage'],
  ['Interface', 'React, Leaflet / Mapbox, Recharts / Plotly'],
  ['Deployment', 'Docker, Kubernetes · AWS / GCP / on-prem'],
]

export function Team() {
  return (
    <div className="px-5 py-24 md:px-10 lg:py-28">
      <div className="mx-auto max-w-[1320px]">
        <PageHead index="§ 09" kicker="Team" title={<>The people behind<br /><em className="text-saffron">Meridian.</em></>} lede="Six people across meteorology, data engineering and machine learning, building operational forecast guidance for India." />
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m) => (
            <div key={m.n} className="group bg-ink p-8 transition hover:bg-ink-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line font-mono text-sm text-saffron transition group-hover:border-saffron">{m.i}</div>
              <h3 className="mt-8 font-display text-3xl">{m.n}</h3>
              <div className="label mt-2">{m.r}</div>
              <p className="mt-5 text-sm leading-relaxed text-dim">{m.f}</p>
            </div>
          ))}
        </div>
        <div className="mt-24 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-6">
          <div className="label pt-2">Technology stack</div>
          <div>
            {STACK.map(([k, v]) => (
              <div key={k} className="grid gap-2 border-t border-line py-5 md:grid-cols-[240px_1fr]">
                <span className="text-lg">{k}</span><span className="font-mono text-sm text-dim">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const FAQ = [
  ['What is forecast blending?', 'Instead of trusting one weather model, Meridian combines several (physical NWP, ensembles and AI models), giving each a weight based on how well it has performed for that region, season, lead time and weather regime.'],
  ['Is the live analysis using real data?', 'Yes. The Live analysis page pulls current 7-day forecasts from six operational models via Open-Meteo. The blend shown there uses consensus-based weights as a stand-in for the trained meta-learner.'],
  ['Who is it for?', 'IMD forecasters, NDMA and state disaster authorities, agricultural planners, water-resource managers, researchers, and ultimately citizens through advisories.'],
  ['How are alerts decided?', 'Blended values are checked against IMD operational thresholds: 64.5 mm/day for heavy and 115.6 mm/day for very heavy rainfall, 40 °C and above for heat-wave conditions, and 62 km/h or more for gales.'],
  ['Can it run on government infrastructure?', 'Yes. The stack is open-source and containerised, and runs on cloud HPC or on-premise with scheduled and real-time pipelines.'],
]

export function Contact() {
  const [open, setOpen] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', org: 'Government agency', msg: '' })
  const [err, setErr] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const x: Record<string, string> = {}
    if (!form.name.trim()) x.name = 'Please enter your name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) x.email = 'Enter a valid email'
    if (form.msg.trim().length < 10) x.msg = 'Tell us a little more (10+ characters)'
    setErr(x)
    if (!Object.keys(x).length) setSent(true)
  }
  const field = 'w-full rounded-xl border border-line bg-transparent px-4 py-3 text-[15px] outline-none transition placeholder:text-faint focus:border-saffron'
  return (
    <div className="px-5 py-24 md:px-10 lg:py-28">
      <div className="mx-auto max-w-[1320px]">
        <PageHead index="§ 10" kicker="Contact & FAQ" title={<>Let's make forecasts<br /><em>people can act on.</em></>} lede="Request a pilot for your region, access to the API, or a walkthrough of the system." />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-line bg-ink-2 p-7 md:p-10">
            {sent ? (
              <div className="flex h-full min-h-[360px] flex-col items-start justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-saffron text-ink">✓</div>
                <h3 className="mt-6 font-display text-4xl">Thank you, {form.name.split(' ')[0]}.</h3>
                <p className="mt-3 max-w-sm text-dim">We'll reply to {form.email} within two working days.</p>
                <button onClick={() => { setSent(false); setForm({ ...form, msg: '' }) }} className="mt-8 text-sm text-saffron underline underline-offset-4">Send another message</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
                {(['name', 'email'] as const).map((k) => (
                  <label key={k} className="block">
                    <span className="label mb-2 block">{k === 'name' ? 'Full name' : 'Work email'}</span>
                    <input type={k === 'email' ? 'email' : 'text'} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} placeholder={k === 'name' ? 'Ananya Rao' : 'you@organisation.gov.in'} className={field} aria-invalid={!!err[k]} />
                    {err[k] && <span className="mt-1.5 block text-xs text-storm">{err[k]}</span>}
                  </label>
                ))}
                <label className="block sm:col-span-2">
                  <span className="label mb-2 block">Organisation type</span>
                  <div className="flex flex-wrap gap-2">
                    {['Government agency', 'Research', 'Agriculture', 'Industry', 'Other'].map((o) => (
                      <button type="button" key={o} onClick={() => setForm({ ...form, org: o })} className={`rounded-full border px-3.5 py-1.5 text-sm transition ${form.org === o ? 'border-paper bg-paper text-ink' : 'border-line text-dim hover:text-paper'}`}>{o}</button>
                    ))}
                  </div>
                </label>
                <label className="block sm:col-span-2">
                  <span className="label mb-2 block">Message</span>
                  <textarea rows={5} value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} placeholder="We'd like to pilot blended rainfall guidance for…" className={`${field} resize-none`} aria-invalid={!!err.msg} />
                  {err.msg && <span className="mt-1.5 block text-xs text-storm">{err.msg}</span>}
                </label>
                <button className="rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition hover:bg-saffron sm:col-span-2 sm:justify-self-start">Send message →</button>
              </form>
            )}
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {[['Email', 'hello@meridian-forecast.in'], ['Coverage', 'All Indian districts'], ['Theme', 'Disaster Management'], ['Response time', 'Within 2 working days']].map(([k, v]) => (
              <div key={k} className="bg-ink p-6"><div className="label">{k}</div><div className="mt-2 text-lg">{v}</div></div>
            ))}
          </div>
        </div>
        <div className="mt-24 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-6">
          <div className="label pt-2">Frequently asked</div>
          <div>
            {FAQ.map(([q, a], i) => (
              <button key={q} onClick={() => setOpen(open === i ? -1 : i)} className="block w-full border-t border-line py-6 text-left last:border-b">
                <div className="flex items-center justify-between gap-6"><span className="text-xl">{q}</span><span className={`font-mono text-lg text-faint transition-transform ${open === i ? 'rotate-45' : ''}`}>+</span></div>
                <div className={`grid transition-all duration-500 ${open === i ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><p className="max-w-2xl overflow-hidden leading-relaxed text-dim">{a}</p></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-start justify-center px-5 md:px-10">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="label text-saffron">Error 404</div>
        <h1 className="mt-4 font-display text-[clamp(4rem,12vw,10rem)] leading-none">Off the <em>map.</em></h1>
        <p className="mt-6 max-w-md text-dim">This page drifted out of the forecast domain.</p>
        <a href="#/overview" className="mt-10 inline-block rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition hover:bg-saffron">Back to overview →</a>
      </div>
    </div>
  )
}

export function PagerFooter({ route }: { route: string }) {
  const i = PAGES.findIndex((p) => p.id === route)
  const prev = PAGES[i - 1], next = PAGES[i + 1]
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-line px-5 md:px-10">
      <div className="mx-auto max-w-[1320px]">
        {i >= 0 && (
          <div className="grid grid-cols-2 gap-px border-b border-line">
            {prev ? <a href={`#/${prev.id}`} className="group py-10 pr-4"><div className="label">← Previous</div><div className="mt-2 font-display text-2xl transition group-hover:text-saffron md:text-4xl">{prev.label}</div></a> : <span />}
            {next ? <a href={`#/${next.id}`} className="group py-10 pl-4 text-right"><div className="label">Next →</div><div className="mt-2 font-display text-2xl transition group-hover:text-saffron md:text-4xl">{next.label}</div></a> : <span />}
          </div>
        )}
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display text-4xl italic">Meridian</div>
            <p className="mt-3 max-w-xs text-sm text-dim">Hybrid AI–NWP multi-model forecast blending for a safer, more resilient India.</p>
          </div>
          {[['Product', ['overview', 'live', 'system', 'weighting']], ['Evidence', ['verification', 'applications', 'viability', 'impact']], ['Company', ['team', 'contact']]].map(([g, ids]) => (
            <div key={g as string}>
              <div className="label mb-4">{g as string}</div>
              <ul className="space-y-2 text-sm">
                {(ids as string[]).map((id) => <li key={id}><a href={`#/${id}`} className="text-dim transition hover:text-paper">{PAGES.find((p) => p.id === id)!.label}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-4 border-t border-line py-6 font-mono text-[11px] text-faint">
          <span>© {year} Meridian · Sensor Vision</span>
          <span>Forecast data: Open-Meteo (CC BY 4.0) · Imagery: Unsplash</span>
        </div>
      </div>
    </footer>
  )
}
