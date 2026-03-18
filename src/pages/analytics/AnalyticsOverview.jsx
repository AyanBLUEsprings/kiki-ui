import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  Ticket, CheckCircle2, AlertCircle, DollarSign,
  Timer, Zap, ShieldOff, TrendingUp,
} from 'lucide-react'
import {
  overviewKPIs, volumeTrend, latencyTrend, tokenTrend, resolutionTypes,
} from '../../data/mockData.js'
import AnalyticsHeader from '../../components/layout/AnalyticsHeader.jsx'

const KPI_CARDS = [
  { label: 'Total Tickets',        value: '313',     sub: 'this week',       icon: Ticket,       color: 'text-indigo-500',  bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  { label: 'Auto-Resolution Rate', value: '71.6%',   sub: '+2.1% vs last wk',icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { label: 'Escalation Rate',      value: '15.2%',   sub: '−0.8% vs last wk',icon: AlertCircle,  color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-500/10' },
  { label: 'Avg Cost / Ticket',    value: '$0.0041', sub: 'input + output',   icon: DollarSign,   color: 'text-violet-500',  bg: 'bg-violet-50 dark:bg-violet-500/10' },
  { label: 'Avg Response Time',    value: '1.6s',    sub: 'per ticket',       icon: Timer,        color: 'text-cyan-500',    bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
  { label: 'Total Tokens',         value: '160.3k',  sub: 'this week',        icon: Zap,          color: 'text-pink-500',    bg: 'bg-pink-50 dark:bg-pink-500/10' },
  { label: 'Spam Rate',            value: '3.8%',    sub: 'of all tickets',   icon: ShieldOff,    color: 'text-red-500',     bg: 'bg-red-50 dark:bg-red-500/10' },
  { label: 'Avg Confidence',       value: '87.4%',   sub: 'resolution score', icon: TrendingUp,   color: 'text-teal-500',    bg: 'bg-teal-50 dark:bg-teal-500/10' },
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

export default function AnalyticsOverview({ page, onNavigate, analyticsFilters, onAnalyticsFilterChange, onAnalyticsFilterReset }) {
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
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {KPI_CARDS.map(k => (
          <div key={k.label} className="card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center`}>
                <k.icon className={`w-4 h-4 ${k.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{k.value}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{k.label}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Volume trend */}
        <div className="card lg:col-span-2">
          <div className="card-header">
            <span className="card-title">Ticket Volume</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Last 7 days</span>
          </div>
          <div className="p-5 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeTrend} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="auto_resolved" name="Auto-resolved" fill="#10b981" radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="escalated"     name="Escalated"     fill="#f59e0b" radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="failed"        name="Failed"        fill="#ef4444" radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="spam"          name="Spam"          fill="#94a3b8" radius={[3, 3, 0, 0]} stackId="a" />
                <Legend iconType="circle" iconSize={7} formatter={v => <span className="text-xs text-slate-500 dark:text-slate-400">{v}</span>} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resolution donut */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Resolution Mix</span>
          </div>
          <div className="p-5 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={resolutionTypes} cx="50%" cy="50%" innerRadius={42} outerRadius={66} paddingAngle={3} dataKey="count">
                  {resolutionTypes.map((r, i) => <Cell key={i} fill={r.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} tickets`, n]} />
                <Legend iconType="circle" iconSize={7} formatter={v => <span className="text-xs text-slate-500 dark:text-slate-400">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Latency + Tokens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Latency */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Response Time (s)</span>
            <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-indigo-500 inline-block" />p50</span>
              <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-amber-500 inline-block" />p95</span>
              <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-red-500 inline-block" />p99</span>
            </div>
          </div>
          <div className="p-5 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyTrend} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-p50" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="p50" name="p50" stroke="#6366f1" strokeWidth={2} fill="url(#g-p50)" />
                <Area type="monotone" dataKey="p95" name="p95" stroke="#f59e0b" strokeWidth={2} fill="none" />
                <Area type="monotone" dataKey="p99" name="p99" stroke="#ef4444" strokeWidth={2} fill="none" strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tokens */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Token Usage</span>
            <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-indigo-400 inline-block" />Input</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-400 inline-block" />Output</span>
            </div>
          </div>
          <div className="p-5 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tokenTrend} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                <Tooltip content={<CustomTooltip />} formatter={v => [v.toLocaleString(), '']} />
                <Bar dataKey="input"  name="Input"  fill="#6366f1" radius={[3, 3, 0, 0]} stackId="t" />
                <Bar dataKey="output" name="Output" fill="#10b981" radius={[3, 3, 0, 0]} stackId="t" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
