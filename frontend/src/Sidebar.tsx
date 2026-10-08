import { useEffect, useState } from 'react'

export const PAGES = [
  { id: 'overview', label: 'Overview', group: 'Product' },
  { id: 'live', label: 'Live analysis', group: 'Product', badge: 'Live' },
  { id: 'system', label: 'System flow', group: 'Product' },
  { id: 'weighting', label: 'Weighting engine', group: 'Product' },
  { id: 'verification', label: 'Verification', group: 'Evidence' },
  { id: 'applications', label: 'Applications', group: 'Evidence' },
  { id: 'viability', label: 'Feasibility', group: 'Evidence' },
  { id: 'impact', label: 'Impact', group: 'Evidence' },
  { id: 'team', label: 'Team', group: 'Company' },
  { id: 'contact', label: 'Contact & FAQ', group: 'Company' },
] as const

export type PageId = (typeof PAGES)[number]['id']

export function useRoute() {
  const read = () => window.location.hash.replace(/^#\/?/, '') || 'overview'
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const f = () => { setRoute(read()); window.scrollTo({ top: 0 }) }
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return route
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [light, setLight] = useState(() => localStorage.getItem('meridian-theme') === 'light')
  useEffect(() => {
    document.documentElement.dataset.theme = light ? 'light' : 'dark'
    localStorage.setItem('meridian-theme', light ? 'light' : 'dark')
  }, [light])
  if (compact) return (
    <button onClick={() => setLight(!light)} aria-label={`Switch to ${light ? 'dark' : 'light'} theme`} title="Toggle theme" className="flex w-full justify-center rounded-xl border border-line py-2.5 text-dim transition hover:text-paper">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">{light ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></> : <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />}</svg>
    </button>
  )
  return (
    <button onClick={() => setLight(!light)} aria-label={`Switch to ${light ? 'dark' : 'light'} theme`} className="group flex w-full items-center justify-between rounded-xl border border-line px-3 py-2.5 text-sm text-dim transition hover:border-paper/25 hover:text-paper">
      <span>{light ? 'Light' : 'Dark'} theme</span>
      <span className="relative flex h-6 w-11 items-center rounded-full bg-paper/10 px-0.5">
        <span className={`flex h-5 w-5 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-500 ${light ? 'translate-x-5' : ''}`}>
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2">
            {light ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></> : <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />}
          </svg>
        </span>
      </span>
    </button>
  )
}

function Links({ route, onNav, collapsed = false }: { route: string; onNav?: () => void; collapsed?: boolean }) {
  const groups = [...new Set(PAGES.map((p) => p.group))]
  return (
    <nav className="space-y-7">
      {groups.map((g) => (
        <div key={g}>
          {collapsed ? <div className="mx-3 mb-2 h-px bg-line" /> : <div className="label mb-2 px-3 !text-[10px] !text-faint">{g}</div>}
          <ul className="space-y-0.5">
            {PAGES.filter((p) => p.group === g).map((p) => {
              const n = PAGES.findIndex((x) => x.id === p.id) + 1
              const active = route === p.id
              return (
                <li key={p.id}>
                  <a href={`#/${p.id}`} onClick={onNav} title={collapsed ? p.label : undefined} aria-current={active ? 'page' : undefined}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] transition ${collapsed ? 'justify-center' : ''} ${active ? 'bg-paper/[0.06] text-paper' : 'text-dim hover:bg-paper/[0.03] hover:text-paper'}`}>
                    <span className={`absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-saffron transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
                    <span className={`font-mono text-[10px] ${active ? 'text-saffron' : 'text-faint'}`}>{String(n).padStart(2, '0')}</span>
                    {!collapsed && <span className="flex-1">{p.label}</span>}
                    {!collapsed && 'badge' in p && <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-tide"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tide" />{p.badge}</span>}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

const Brand = ({ compact = false }: { compact?: boolean }) => (
  <a href="#/overview" className="flex items-center gap-3">
    <svg viewBox="0 0 32 32" className="h-8 w-8 text-saffron" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="16" cy="16" r="14" opacity=".35" /><circle cx="16" cy="16" r="9" opacity=".6" /><path d="M16 2v28M2 16c5-4 23-4 28 0" />
    </svg>
    {!compact && (
      <div className="leading-none">
        <div className="font-display text-[1.6rem] italic">Meridian</div>
        <div className="label mt-1 !text-[9px]">by Sensor Vision</div>
      </div>
    )}
  </a>
)

export function Sidebar({ route, collapsed, setCollapsed }: { route: string; collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const [open, setOpen] = useState(false)
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [])
  const footer = <ThemeToggle />
  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-line bg-ink/95 backdrop-blur-xl transition-[width] duration-300 lg:flex ${collapsed ? 'w-[76px]' : 'w-[264px]'}`}>
        <div className={`flex items-center pb-6 pt-7 ${collapsed ? 'justify-center px-2' : 'px-6'}`}><Brand compact={collapsed} /></div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 [scrollbar-width:none]"><Links route={route} collapsed={collapsed} /></div>
        <div className="space-y-2 p-3">
          {collapsed ? <ThemeToggle compact /> : footer}
          <button onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-dim transition hover:bg-paper/[0.04] hover:text-paper ${collapsed ? 'justify-center' : ''}`}>
            <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M9 4v16M15 10l-2 2 2 2" /></svg>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-line bg-ink/85 px-5 backdrop-blur-xl lg:hidden">
        <Brand />
        <button onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open} className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-line">
          <span className={`h-px w-4 bg-paper transition ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`h-px w-4 bg-paper transition ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </header>
      <div className={`fixed inset-0 z-40 bg-ink/97 px-5 pb-6 pt-24 backdrop-blur-xl transition duration-300 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="flex-1"><Links route={route} onNav={() => setOpen(false)} /></div>
          <div className="mt-8">{footer}</div>
        </div>
      </div>
    </>
  )
}
