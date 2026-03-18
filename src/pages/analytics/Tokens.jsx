import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Zap, RefreshCw } from 'lucide-react'
import { tokenTrend } from '../../data/mockData.js'
import AnalyticsHeader from '../../components/layout/AnalyticsHeader.jsx'
import clsx from 'clsx'

const VIEWS = ['chart', 'donut', 'table']

const KPI = [
  { label: 'Total Input',    value: '120.1k', sub: 'tokens sent to AI',        color: 'text-indigo-500',  bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  { label: 'Total Output',   value: '40.3k',  sub: 'tokens generated',         color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { label: 'Combined',       value: '160.3k', sub: 'input + output',           color: 'text-violet-500',  bg: 'bg-violet-50 dark:bg-violet-500/10' },
  { label: 'Total Runs',     value: '471',    sub: 'AI processing runs',        color: 'text-cyan-500',    bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
  { label: 'Avg / Ticket',   value: '512',    sub: 'tokens per ticket',         color: 'text-pink-500',    bg: 'bg-pink-50 dark:bg-pink-500/10' },
  { label: 'Avg / Run',      value: '340',    sub: 'tokens per run',            color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-500/10' },
]

const fmt = v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(Math.round(v))

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="flex items-center gap-2 mt-0.5" style={{ color: p.color }}>
          <span className="w-2 h-2 rounded-sm" style={{ background: p.color }} />
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function Tokens({ page, onNavigate, analyticsFilters, onAnalyticsFilterChange, onAnalyticsFilterReset }) {
  const [view, setView] = useState('chart')

  const totals = tokenTrend.reduce((acc, r) => ({
    input: acc.input + r.input,
    output: acc.output + r.output,
  }), { input: 0, output: 0 })

  const donutData = [
    { name: 'Input Tokens',  value: totals.input,  color: '#6366f1' },
    { name: 'Output Tokens', value: totals.output, color: '#10b981' },
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

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {KPI.map(k => (
          <div key={k.label} className="card p-4">
            <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center mb-3', k.bg)}>
              <Zap className={clsx('w-4 h-4', k.color)} />
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
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Token Analysis</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Avg per run: 340 · Avg per ticket: 512</p>
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
            <span className="card-title">Daily Token Breakdown</span>
            <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-indigo-500 inline-block" />Input</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />Output</span>
            </div>
          </div>
          <div className="p-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tokenTrend} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={fmt} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="input"  name="Input"  fill="#6366f1" stackId="t" radius={[0, 0, 0, 0]} maxBarSize={40} />
                <Bar dataKey="output" name="Output" fill="#10b981" stackId="t" radius={[3, 3, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === 'donut' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Input vs Output Distribution</span>
          </div>
          <div className="p-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={4} dataKey="value">
                  {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [fmt(v), n]} />
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
                  {['Day', 'Input', 'Output', 'Total'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tokenTrend.map(r => (
                  <tr key={r.day} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-semibold text-slate-700 dark:text-slate-200">{r.day}</td>
                    <td className="px-5 py-3 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{r.input.toLocaleString()}</td>
                    <td className="px-5 py-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{r.output.toLocaleString()}</td>
                    <td className="px-5 py-3 font-mono text-amber-600 dark:text-amber-400 font-semibold">{r.total.toLocaleString()}</td>
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
