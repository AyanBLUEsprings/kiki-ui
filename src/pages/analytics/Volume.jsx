import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Ticket, CheckCircle2, AlertCircle, ShieldOff, Percent } from 'lucide-react'
import { volumeTrend, resolutionTypes } from '../../data/mockData.js'
import AnalyticsHeader from '../../components/layout/AnalyticsHeader.jsx'
import clsx from 'clsx'

const VIEWS = ['chart', 'donut', 'table']

const SERIES = [
  { key: 'auto_resolved', label: 'Auto-Resolved', color: '#10b981' },
  { key: 'escalated',     label: 'Escalated',     color: '#f59e0b' },
  { key: 'failed',        label: 'Failed',        color: '#ef4444' },
  { key: 'spam',          label: 'Spam',          color: '#94a3b8' },
]

const KPI = [
  { label: 'Total Tickets',       value: '313',   sub: 'this week',         icon: Ticket,       color: 'text-indigo-500',  bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  { label: 'Auto-Resolved',       value: '224',   sub: '71.6% of non-spam', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { label: 'Escalated',           value: '55',    sub: '15.2% rate',        icon: AlertCircle,  color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-500/10' },
  { label: 'Failed',              value: '4',     sub: '1.4% error rate',   icon: AlertCircle,  color: 'text-red-500',     bg: 'bg-red-50 dark:bg-red-500/10' },
  { label: 'Spam Blocked',        value: '12',    sub: '3.8% spam rate',    icon: ShieldOff,    color: 'text-slate-500',   bg: 'bg-slate-100 dark:bg-slate-800' },
  { label: 'Auto-Resolution Rate','value': '71.6%', sub: 'of non-spam',     icon: Percent,      color: 'text-violet-500',  bg: 'bg-violet-50 dark:bg-violet-500/10' },
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

export default function Volume({ page, onNavigate, analyticsFilters, onAnalyticsFilterChange, onAnalyticsFilterReset }) {
  const [view, setView] = useState('chart')

  const donutData = resolutionTypes.map(r => ({ name: r.type, value: r.count, color: r.color }))

  return (
    <div className="page-container">
      <AnalyticsHeader
        active={page}
        onNavigate={onNavigate}
        filters={analyticsFilters}
        onFilterChange={onAnalyticsFilterChange}
        onFilterReset={onAnalyticsFilterReset}
      />

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {KPI.map(k => (
          <div key={k.label} className="card p-4">
            <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center mb-3', k.bg)}>
              <k.icon className={clsx('w-4 h-4', k.color)} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{k.value}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{k.label}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Volume Analysis</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Compare demand shape against outcome mix without leaving the workspace.</p>
        </div>
        <div className="inline-grid grid-flow-col auto-cols-fr gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          {VIEWS.map(v => (
            <button key={v} onClick={() => setView(v)} className={clsx(
              'w-full px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all',
              view === v ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            )}>{v}</button>
          ))}
        </div>
      </div>

      {view === 'chart' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Weekly Volume Breakdown</span>
            <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
              {SERIES.map(s => (
                <span key={s.key} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm inline-block" style={{ background: s.color }} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>
          <div className="p-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeTrend} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                {SERIES.map(s => (
                  <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} stackId="vol" radius={s.key === 'spam' ? [3, 3, 0, 0] : [0, 0, 0, 0]} maxBarSize={40} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === 'donut' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Resolution Mix</span>
          </div>
          <div className="p-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value">
                  {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} tickets`, n]} />
                <Legend iconType="circle" iconSize={8} formatter={v => <span className="text-xs text-slate-500 dark:text-slate-400">{v}</span>} />
              </PieChart>
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
                  {['Day', 'Total', 'Auto-Resolved', 'Escalated', 'Failed', 'Spam'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {volumeTrend.map(r => (
                  <tr key={r.day} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-semibold text-slate-700 dark:text-slate-200">{r.day}</td>
                    <td className="px-5 py-3 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{r.total}</td>
                    <td className="px-5 py-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{r.auto_resolved}</td>
                    <td className="px-5 py-3 font-mono text-amber-600 dark:text-amber-400 font-semibold">{r.escalated}</td>
                    <td className="px-5 py-3 font-mono text-red-600 dark:text-red-400 font-semibold">{r.failed}</td>
                    <td className="px-5 py-3 font-mono text-slate-500 dark:text-slate-400 font-semibold">{r.spam}</td>
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
