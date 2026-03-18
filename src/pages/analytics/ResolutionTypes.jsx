import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { CheckCircle2, AlertCircle, HelpCircle, ShieldOff } from 'lucide-react'
import { resolutionTypes } from '../../data/mockData.js'
import AnalyticsHeader from '../../components/layout/AnalyticsHeader.jsx'
import clsx from 'clsx'

const VIEWS = ['donut', 'chart', 'table']

const DESCRIPTIONS = {
  'Auto-Resolved':   'AI resolved the ticket automatically without human involvement',
  'Needs Human':     'AI determined a human needs to take action (e.g. process a refund)',
  'Escalated':       'Ticket was escalated to a specialist or manager',
  'Needs More Info': 'AI needs additional information from the customer before resolving',
  'Spam':            'Tickets identified as spam or junk',
}

const ICONS = {
  'Auto-Resolved':   CheckCircle2,
  'Needs Human':     AlertCircle,
  'Escalated':       AlertCircle,
  'Needs More Info': HelpCircle,
  'Spam':            ShieldOff,
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{d.name}</p>
      <p style={{ color: d.payload?.color ?? d.fill }}>{d.value} tickets · {d.payload?.pct}%</p>
    </div>
  )
}

export default function ResolutionTypes({ page, onNavigate, analyticsFilters, onAnalyticsFilterChange, onAnalyticsFilterReset }) {
  const [view, setView] = useState('donut')
  const total = resolutionTypes.reduce((s, r) => s + r.count, 0)

  return (
    <div className="page-container">
      <AnalyticsHeader
        active={page}
        onNavigate={onNavigate}
        filters={analyticsFilters}
        onFilterChange={onAnalyticsFilterChange}
        onFilterReset={onAnalyticsFilterReset}
      />

      {/* KPI cards — one per type */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {resolutionTypes.map(r => {
          const Icon = ICONS[r.type] ?? CheckCircle2
          return (
            <div key={r.type} className="card p-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${r.color}18` }}>
                <Icon className="w-4 h-4" style={{ color: r.color }} />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{r.count}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{r.type}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">{r.pct}% of total</p>
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Resolution Breakdown</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Move between share, counts, and raw rows using one consistent control bar.</p>
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

      {view === 'donut' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Distribution of Resolution Types</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">{total} total tickets</span>
          </div>
          <div className="p-5 h-80 flex flex-col gap-4">
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={resolutionTypes} cx="50%" cy="50%" innerRadius={76} outerRadius={112}
                    paddingAngle={3} dataKey="count" nameKey="type">
                    {resolutionTypes.map((r, i) => <Cell key={i} fill={r.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {resolutionTypes.map((r) => (
                <div key={r.type} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                  <span>{r.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'chart' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Ticket Count by Resolution Type</span>
          </div>
          <div className="p-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resolutionTypes} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip formatter={(v, n, { payload }) => [`${v} tickets (${payload.pct}%)`, 'Count']} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
                  {resolutionTypes.map((r, i) => <Cell key={i} fill={r.color} />)}
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
                  {['Resolution Type', 'Description', 'Tickets', '% of Total'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resolutionTypes.map(r => (
                  <tr key={r.type} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
                        <span className="font-medium text-slate-700 dark:text-slate-200">{r.type}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-400 dark:text-slate-500 text-xs max-w-xs">{DESCRIPTIONS[r.type] ?? '—'}</td>
                    <td className="px-5 py-3 font-mono font-semibold" style={{ color: r.color }}>{r.count}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.color }} />
                        </div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{r.pct}%</span>
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
