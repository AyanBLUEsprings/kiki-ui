import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Timer } from 'lucide-react'
import { latencyTrend } from '../../data/mockData.js'
import AnalyticsHeader from '../../components/layout/AnalyticsHeader.jsx'
import clsx from 'clsx'

const VIEWS  = ['line', 'bar', 'table']
const UNITS  = ['ms', 's']
const SERIES = [
  { key: 'avg', label: 'Avg / Ticket', color: '#6366f1' },
  { key: 'p50', label: 'p50',          color: '#10b981' },
  { key: 'p95', label: 'p95',          color: '#f59e0b' },
  { key: 'p99', label: 'p99',          color: '#ef4444' },
]

const KPI = [
  { label: 'p50',           value: '1.1s',  sub: 'median — half are faster', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { label: 'p95',           value: '3.7s',  sub: '95% finish under this',    color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-500/10' },
  { label: 'p99',           value: '6.1s',  sub: 'slowest 1% ceiling',       color: 'text-red-500',     bg: 'bg-red-50 dark:bg-red-500/10' },
  { label: 'Avg / Ticket',  value: '1.6s',  sub: 'across all runs',          color: 'text-indigo-500',  bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="flex items-center gap-2 mt-0.5" style={{ color: p.color }}>
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function Latency({ page, onNavigate, analyticsFilters, onAnalyticsFilterChange, onAnalyticsFilterReset }) {
  const [view, setView] = useState('line')
  const [unit, setUnit] = useState('s')

  const toUnit = v => unit === 'ms' ? Math.round(v * 1000) : v
  const fmtUnit = v => unit === 'ms' ? `${v}ms` : `${v}s`

  const chartData = latencyTrend.map(r => ({
    day: r.day,
    avg: toUnit(r.avg),
    p50: toUnit(r.p50),
    p95: toUnit(r.p95),
    p99: toUnit(r.p99),
  }))

  const ChartEl = view === 'bar' ? BarChart : LineChart

  return (
    <div className="page-container">
      <AnalyticsHeader
        active={page}
        onNavigate={onNavigate}
        filters={analyticsFilters}
        onFilterChange={onAnalyticsFilterChange}
        onFilterReset={onAnalyticsFilterReset}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {KPI.map(k => (
          <div key={k.label} className="card p-4">
            <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center mb-3', k.bg)}>
              <Timer className={clsx('w-4 h-4', k.color)} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{k.value}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{k.label}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Latency Analysis</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Switch units and chart mode while keeping percentile context visible.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Unit toggle */}
          <div className="inline-grid grid-flow-col auto-cols-fr gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
            {UNITS.map(u => (
              <button key={u} onClick={() => setUnit(u)} className={clsx(
                'w-full px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                unit === u ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm' : 'text-slate-400 dark:text-slate-500'
              )}>{u}</button>
            ))}
          </div>
          {/* View toggle */}
          <div className="inline-grid grid-flow-col auto-cols-fr gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
            {VIEWS.map(v => (
              <button key={v} onClick={() => setView(v)} className={clsx(
                'w-full px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all',
                view === v ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm' : 'text-slate-400 dark:text-slate-500'
              )}>{v}</button>
            ))}
          </div>
        </div>
      </div>

      {view !== 'table' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Percentile Trends</span>
            <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
              {SERIES.map(s => (
                <span key={s.key} className="flex items-center gap-1">
                  <span className="w-4 h-0.5 inline-block" style={{ background: s.color }} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>
          <div className="p-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ChartEl data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}${unit}`} />
                <Tooltip content={<CustomTooltip />} formatter={v => [`${v}${unit}`]} />
                {SERIES.map(s =>
                  view === 'bar'
                    ? <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[3, 3, 0, 0]} maxBarSize={20} />
                    : <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2}
                        dot={false} activeDot={{ r: 4 }} strokeDasharray={s.key === 'p99' ? '4 2' : undefined} />
                )}
              </ChartEl>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === 'table' && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 dark:border-slate-800">
                  {['Day', 'p50', 'p95', 'p99', 'Avg / Ticket'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chartData.map(r => (
                  <tr key={r.day} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-semibold text-slate-700 dark:text-slate-200">{r.day}</td>
                    <td className="px-5 py-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{fmtUnit(r.p50)}</td>
                    <td className="px-5 py-3 font-mono text-amber-600 dark:text-amber-400 font-semibold">{fmtUnit(r.p95)}</td>
                    <td className="px-5 py-3 font-mono text-red-600 dark:text-red-400 font-semibold">{fmtUnit(r.p99)}</td>
                    <td className="px-5 py-3 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{fmtUnit(r.avg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
