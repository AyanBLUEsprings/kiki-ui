import clsx from 'clsx'
import { Activity, BarChart2, Timer, Zap, PieChart, RefreshCcw, Shield } from 'lucide-react'

const TABS = [
  { id: 'analytics:overview',   label: 'Overview',         icon: Activity },
  { id: 'analytics:volume',     label: 'Volume',           icon: BarChart2 },
  { id: 'analytics:latency',    label: 'Response Time',    icon: Timer },
  { id: 'analytics:tokens',     label: 'Tokens',           icon: Zap },
  { id: 'analytics:resolution', label: 'Resolution Types', icon: PieChart },
  { id: 'analytics:revisions',  label: 'Revisions',        icon: RefreshCcw },
  { id: 'analytics:pii',        label: 'PII Detection',    icon: Shield },
]

export default function AnalyticsTabs({ active, onNavigate }) {
  return (
    <div className="grid w-full grid-cols-2 gap-1 rounded-2xl border border-slate-200/80 bg-white/90 p-1 shadow-sm sm:grid-cols-3 xl:grid-cols-7 dark:border-slate-800 dark:bg-[#111116]/90">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={clsx(
            'flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all',
            active === id
              ? 'border border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400'
              : 'border border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/[0.03] dark:hover:text-slate-200'
          )}
        >
          <Icon className="w-4 h-4" />
          <span className="whitespace-nowrap">{label}</span>
        </button>
      ))}
    </div>
  )
}
