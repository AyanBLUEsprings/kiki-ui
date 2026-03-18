import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { ShieldAlert } from 'lucide-react'
import { piiTypes } from '../../data/mockData.js'
import AnalyticsHeader from '../../components/layout/AnalyticsHeader.jsx'
import clsx from 'clsx'

const VIEWS = ['chart', 'table']

const COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
      <p style={{ color: p.fill }}>{p.value} entities detected · {p.payload.pct}% of PII tickets</p>
    </div>
  )
}

export default function PII({ page, onNavigate, analyticsFilters, onAnalyticsFilterChange, onAnalyticsFilterReset }) {
  const [view, setView] = useState('chart')
  const totalEntities = piiTypes.reduce((s, r) => s + r.count, 0)

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
        <div className="card p-4">
          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-3">
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">84</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Tickets with PII</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">detected this week</p>
        </div>
        <div className="card p-4">
          <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center mb-3">
            <ShieldAlert className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">26.8%</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">PII Rate</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">of all tickets</p>
        </div>
        <div className="card p-4">
          <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center mb-3">
            <ShieldAlert className="w-4 h-4 text-violet-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{piiTypes.length}</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">PII Types Found</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">distinct entity types</p>
        </div>
        <div className="card p-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-3">
            <ShieldAlert className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalEntities.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Total Entities Masked</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">across all tickets</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">PII Type Breakdown</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Keep chart and table views aligned while reviewing exposure by entity type.</p>
        </div>
        <div className="inline-grid grid-flow-col auto-cols-fr gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          {VIEWS.map(v => (
            <button key={v} onClick={() => setView(v)} className={clsx(
              'w-full px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all',
              view === v ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm' : 'text-slate-400 dark:text-slate-500'
            )}>{v}</button>
          ))}
        </div>
      </div>

      {view === 'chart' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Entities Found by Type</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">{totalEntities} total entities masked</span>
          </div>
          <div className="p-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={piiTypes} margin={{ top: 4, right: 4, left: -16, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
                  {piiTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
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
                  {['PII Type', 'Entities Found', '% of PII Tickets'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {piiTypes.map((r, i) => (
                  <tr key={r.type} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="font-medium text-slate-700 dark:text-slate-200">{r.type}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono font-semibold" style={{ color: COLORS[i % COLORS.length] }}>{r.count}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-red-500" style={{ width: `${Math.min(r.pct, 100)}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-red-600 dark:text-red-400">{r.pct}%</span>
                      </div>
                    </td>
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
