import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { RefreshCcw } from 'lucide-react'
import { revisionsByCategory } from '../../data/mockData.js'
import AnalyticsHeader from '../../components/layout/AnalyticsHeader.jsx'
import clsx from 'clsx'

const VIEWS = ['chart', 'donut', 'table']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="flex items-center gap-2 mt-0.5" style={{ color: p.color ?? p.fill }}>
          <span className="w-2 h-2 rounded-sm" style={{ background: p.color ?? p.fill }} />
          {p.name}: {p.value}{p.name.includes('Rate') ? '%' : ''}
        </p>
      ))}
    </div>
  )
}

export default function Revisions({ page, onNavigate, analyticsFilters, onAnalyticsFilterChange, onAnalyticsFilterReset }) {
  const [view, setView] = useState('chart')

  const totalRevised = revisionsByCategory.reduce((s, r) => s + r.revised, 0)
  const totalTickets  = revisionsByCategory.reduce((s, r) => s + r.total, 0)
  const overallRate   = Math.round((totalRevised / totalTickets) * 100)

  const donutData = [
    { name: 'With Revisions',    value: totalRevised,            color: '#f59e0b' },
    { name: 'Without Revisions', value: totalTickets - totalRevised, color: '#6366f1' },
  ]

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
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-3">
            <RefreshCcw className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{overallRate}%</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Overall Revision Rate</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">across all categories</p>
        </div>
        <div className="card p-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-3">
            <RefreshCcw className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalRevised}</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Tickets Revised</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">of {totalTickets} total</p>
        </div>
        <div className="card p-4 lg:col-span-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Highest revision rate</p>
          {[...revisionsByCategory].sort((a, b) => b.rate - a.rate).slice(0, 2).map(r => (
            <div key={r.category} className="flex items-center gap-3 mb-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 w-36 truncate">{r.category}</span>
              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${r.rate}%` }} />
              </div>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 w-8 text-right">{r.rate}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Revisions by Category</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Identify where human rework is concentrated before drilling into the table.</p>
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
            <span className="card-title">Revision Rate by Category</span>
            <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500 inline-block" />Revised</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-indigo-500 inline-block" />Total</span>
            </div>
          </div>
          <div className="p-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revisionsByCategory} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => v.split(' ')[0]} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total"   name="Total"   fill="#e2e8f0" className="dark:fill-slate-700" radius={[3, 3, 0, 0]} maxBarSize={36} />
                <Bar dataKey="revised" name="Revised" fill="#f59e0b" radius={[3, 3, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === 'donut' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Revised vs Not Revised</span>
          </div>
          <div className="p-5 h-80 flex flex-col gap-4">
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={76} outerRadius={112} paddingAngle={4} dataKey="value">
                    {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v} tickets`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {donutData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span>{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'table' && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 dark:border-slate-800">
                  {['Category', 'Total Tickets', 'Revised', 'Revision Rate'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...revisionsByCategory].sort((a, b) => b.rate - a.rate).map(r => (
                  <tr key={r.category} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-medium text-slate-700 dark:text-slate-200">{r.category}</td>
                    <td className="px-5 py-3 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{r.total}</td>
                    <td className="px-5 py-3 font-mono text-amber-600 dark:text-amber-400 font-semibold">{r.revised}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-amber-500" style={{ width: `${r.rate}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{r.rate}%</span>
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
