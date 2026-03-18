import { useState } from 'react'
import { ArrowUpRight, RefreshCw } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from 'recharts'
import { StatCard, Badge, SectionHeader } from '../components/ui/index.jsx'
import { tickets, weeklyTrend, categoryData, activityFeed, languageData } from '../data/mockData.js'
import clsx from 'clsx'

const DEFAULT_SCOPE = { channel: 'All channels' }

const matchesScope = (item, workspaceScope) => {
  const scope = workspaceScope ?? DEFAULT_SCOPE
  const channelMatch = scope.channel === 'All channels' || item.channel === scope.channel
  return channelMatch
}

const FEED_COLORS = {
  draft:     'bg-indigo-400',
  sent:      'bg-emerald-400',
  spam:      'bg-red-400',
  approved:  'bg-emerald-400',
  translate: 'bg-cyan-400',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function CommandCenter({ workspaceScope }) {
  const [refreshing, setRefreshing] = useState(false)
  const scope = workspaceScope ?? DEFAULT_SCOPE
  const scopedTickets = tickets.filter((ticket) => matchesScope(ticket, workspaceScope))
  const scopedActivity = activityFeed.filter((item) => matchesScope(item, workspaceScope))

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 800)
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Good morning, <span className="text-indigo-500">Sara</span> 👋
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
            Friday 13 Mar 2026 · {scopedTickets.length} tickets in {scope.channel}
          </p>
        </div>
        <button onClick={handleRefresh} className="btn-ghost">
          <RefreshCw className={clsx('w-4 h-4', refreshing && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Review" value="8" delta="▲ 3 since yesterday" deltaType="neutral" icon="📬" accent="amber" />
        <StatCard label="Avg. Response Time" value="▼ 2.4h" delta="18 min faster than yesterday" deltaType="up" icon="⚡" accent="indigo" />
        <StatCard label="Auto-resolved Today" value="31" delta="89% success rate" deltaType="up" icon="✅" accent="emerald" />
        <StatCard label="Spam Blocked" value="12" delta="— stable this week" deltaType="neutral" icon="🛡" accent="red" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly trend */}
        <div className="card lg:col-span-2">
          <div className="card-header">
            <span className="card-title">Weekly Ticket Trend</span>
            <select className="text-xs text-slate-400 dark:text-slate-500 bg-transparent border-none outline-none">
              <option>Last 7 days</option>
            </select>
          </div>
          <div className="p-5 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad-resolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#6366f1" strokeWidth={2} fill="url(#grad-resolved)" />
                <Area type="monotone" dataKey="pending" name="Pending" stroke="#f59e0b" strokeWidth={2} fill="none" strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category pie */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">By Category</span>
          </div>
          <div className="p-5 h-56 flex flex-col gap-4">
            <div className="flex-1 min-h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v}%`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {categoryData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tickets + Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ticket table */}
        <div className="card lg:col-span-2">
          <div className="card-header">
            <SectionHeader title="Pending Tickets" subtitle={`${scopedTickets.filter(t => t.status === 'pending').length} items`} />
            <button className="btn-ghost text-xs">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 dark:border-slate-800">
                  {['ID', 'Subject', 'Channel', 'Status'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scopedTickets.map(t => (
                  <tr key={t.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <td className="px-5 py-3 font-mono text-xs font-medium text-slate-700 dark:text-slate-300">{t.id}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300 max-w-[260px] truncate">{t.subject}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">{t.channel}</td>
                    <td className="px-5 py-3"><Badge status={t.status}>{t.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity feed */}
        <div className="card flex flex-col">
          <div className="card-header">
            <span className="card-title flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Activity
            </span>
          </div>
          <div className="flex-1 divide-y divide-slate-50 dark:divide-slate-800">
            {scopedActivity.map((item, i) => (
              <div key={i} className="px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', FEED_COLORS[item.type])} />
                  <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-200">{item.id}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">{item.time}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.msg}</p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
                  <span>{item.channel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Language bar */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Language Distribution This Week</span>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {languageData.map(l => (
              <div key={l.lang} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{l.flag}</span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{l.lang}</span>
                  {!l.active && <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full ml-auto">Off</span>}
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${l.pct}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{l.pct}%</span>
                  <span>{l.tickets} tickets</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
