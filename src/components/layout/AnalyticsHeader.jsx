import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { CalendarRange, Check, ChevronDown, ChevronRight, Filter, Layers3, Globe2 } from 'lucide-react'
import AnalyticsTabs from './AnalyticsTabs.jsx'

const PAGE_META = {
  'analytics:overview':   { label: 'Overview',         description: 'Executive KPIs and operational health across support automation.', accent: 'Executive pulse' },
  'analytics:volume':     { label: 'Volume',           description: 'Demand, resolution throughput, and arrival patterns over time.', accent: 'Traffic patterns' },
  'analytics:latency':    { label: 'Response Time',    description: 'Processing speed, percentile spread, and tail-latency behavior.', accent: 'Performance timing' },
  'analytics:tokens':     { label: 'Tokens',           description: 'Prompt and response usage, efficiency, and token spend footprint.', accent: 'Usage economics' },
  'analytics:resolution': { label: 'Resolution Types', description: 'How tickets close: automation, escalation, manual handling, or spam.', accent: 'Outcome mix' },
  'analytics:revisions':  { label: 'Revisions',        description: 'Where humans intervene most and where draft quality needs attention.', accent: 'Quality friction' },
  'analytics:pii':        { label: 'PII Detection',    description: 'Masked entity trends and sensitive-data exposure across ticket flows.', accent: 'Risk visibility' },
}

const FILTERS = [
  { key: 'range', icon: CalendarRange, label: 'Range', options: ['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Quarter to date'] },
  { key: 'channel', icon: Layers3, label: 'Channel', options: ['All channels', 'Email + Chat + Voice + Webforms', 'Email only', 'Chat only', 'Voice only', 'Webforms only'] },
  { key: 'language', icon: Globe2, label: 'Language', options: ['All languages', 'Arabic priority', 'English only', 'High-volume locales'] },
]

export default function AnalyticsHeader({ active, onNavigate, filters, onFilterChange, onFilterReset }) {
  const meta = PAGE_META[active] ?? PAGE_META['analytics:overview']
  const [openMenu, setOpenMenu] = useState(null)
  const rootRef = useRef(null)

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpenMenu(null)
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  return (
    <div ref={rootRef} className="space-y-4">
      <section className="relative rounded-2xl border border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.92))] p-5 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_28%),linear-gradient(135deg,_rgba(23,23,28,0.96),_rgba(13,13,16,0.98))]">
        <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl" />
        <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)] xl:items-start">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              <span>Analytics</span>
              <ChevronRight className="h-3 w-3" />
              <span>{meta.label}</span>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur dark:border-white/5 dark:bg-white/[0.03]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Analytics Workspace</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{meta.label}</h1>
                <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
                  {meta.accent}
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{meta.description}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/30">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              <Filter className="h-3.5 w-3.5" />
              <span>Filters</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {FILTERS.map(({ key, icon: Icon, label, options }) => (
                <div key={key} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenu((current) => current === key ? null : key)}
                    className="inline-flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
                  >
                    <span className="min-w-0">
                      <span className="mb-0.5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </span>
                      <span className="block truncate text-sm text-slate-700 dark:text-slate-200">{filters[key]}</span>
                    </span>
                    <ChevronDown className={clsx('h-4 w-4 flex-shrink-0 text-slate-300 transition-transform dark:text-slate-600', openMenu === key && 'rotate-180')} />
                  </button>

                  {openMenu === key && (
                    <div className="absolute left-0 right-0 top-[calc(100%+0.45rem)] z-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                      {options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            onFilterChange(key, option)
                            setOpenMenu(null)
                          }}
                          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                          <span>{option}</span>
                          {filters[key] === option && <Check className="h-3.5 w-3.5 text-indigo-500" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={onFilterReset}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2.5 text-xs font-medium text-slate-500 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-500/40 dark:hover:text-indigo-300"
            >
              <Filter className="h-3.5 w-3.5" />
              Reset filters
            </button>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-10 -mx-1 bg-slate-50/90 px-1 py-2 backdrop-blur dark:bg-[#0d0d10]/90">
        <AnalyticsTabs active={active} onNavigate={onNavigate} />
      </div>
    </div>
  )
}
