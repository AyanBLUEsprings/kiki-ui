import clsx from 'clsx'

// ── StatCard ──────────────────────────────────────────────
export function StatCard({ label, value, delta, deltaType = 'neutral', icon, accent = 'indigo' }) {
  const accents = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    violet: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
  }
  const deltas = {
    up: 'text-emerald-600 dark:text-emerald-400',
    down: 'text-red-500 dark:text-red-400',
    neutral: 'text-slate-400 dark:text-slate-500',
  }
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase">{label}</span>
        {icon && <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center text-sm', accents[accent])}>{icon}</div>}
      </div>
      <div className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">{value}</div>
      {delta && <div className={clsx('text-xs font-medium', deltas[deltaType])}>{delta}</div>}
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────
export function Badge({ status, children }) {
  return <span className={clsx('badge', `badge-${status}`)}>{children ?? status}</span>
}

// ── Table ─────────────────────────────────────────────────
export function Table({ columns, rows, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            {columns.map(col => (
              <th key={col.key} className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-4 py-3 first:pl-5 last:pr-5">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              className={clsx(
                'border-b border-slate-50 dark:border-slate-800/60 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.02]'
              )}
            >
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 first:pl-5 last:pr-5 text-slate-700 dark:text-slate-300">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── ProgressBar ───────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = 'bg-indigo-500', className }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className={clsx('h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden', className)}>
      <div className={clsx('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
    </div>
  )
}

// ── ScoreBar ──────────────────────────────────────────────
export function ScoreBar({ value }) {
  const color = value >= 85 ? 'bg-red-500' : value >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={clsx('h-full rounded-full', color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{value}%</span>
    </div>
  )
}

// ── Toggle ─────────────────────────────────────────────────
export function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full p-0.5 transition-colors overflow-hidden',
        checked ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'
      )}
    >
      <span className={clsx(
        'block h-5 w-5 rounded-full bg-white shadow transition-transform',
        checked ? 'translate-x-5' : 'translate-x-0'
      )} />
    </button>
  )
}

// ── SectionHeader ─────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ── EmptyState ────────────────────────────────────────────
export function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
      {description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{description}</p>}
    </div>
  )
}
