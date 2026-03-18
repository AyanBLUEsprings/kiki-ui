import { useState } from 'react'
import { ShieldAlert, Trash2, Eye, BarChart2, TrendingDown, AlertTriangle } from 'lucide-react'
import { spamTickets } from '../data/mockData.js'
import { StatCard, ScoreBar, Badge } from '../components/ui/index.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import clsx from 'clsx'

const typeColors = {
  'Spam Content': 'badge-spam',
  'Promotional': 'badge-pending',
  'Bot Traffic': 'badge-review',
  'Phishing': 'badge-spam',
}

const typeStats = [
  { type: 'Spam Content', count: 7, color: '#ef4444' },
  { type: 'Promotional', count: 3, color: '#f59e0b' },
  { type: 'Bot Traffic', count: 1, color: '#3b82f6' },
  { type: 'Phishing', count: 1, color: '#ef4444' },
]

export default function SpamIntelligence() {
  const [selected, setSelected] = useState(null)
  const [dismissed, setDismissed] = useState([])
  const [sortBy, setSortBy] = useState('score')

  const active = spamTickets.filter(t => !dismissed.includes(t.id))
  const sorted = [...active].sort((a, b) => sortBy === 'score' ? b.score - a.score : 0)

  const handleDismiss = (id) => {
    setDismissed(p => [...p, id])
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="page-container">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Blocked This Week" value="12" delta="0 false positives" deltaType="up" icon={<ShieldAlert className="w-4 h-4" />} accent="red" />
        <StatCard label="Avg. Confidence" value="94%" delta="High accuracy" deltaType="up" icon={<BarChart2 className="w-4 h-4" />} accent="indigo" />
        <StatCard label="Pending Review" value={String(active.length)} delta="Manual check needed" deltaType="neutral" icon={<Eye className="w-4 h-4" />} accent="amber" />
        <StatCard label="Saved Agent Hours" value="3.2h" delta="↑ vs last week" deltaType="up" icon={<TrendingDown className="w-4 h-4" />} accent="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Table */}
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <span className="card-title">Blocked Tickets</span>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-600 dark:text-slate-300 outline-none"
              >
                <option value="score">Sort: Confidence</option>
                <option value="date">Sort: Date</option>
              </select>
              <button className="btn-secondary text-xs py-1"><Trash2 className="w-3.5 h-3.5" /> Purge All</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {['ID', 'Subject', 'Type', 'Score', 'Received', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3 first:pl-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(t => (
                  <tr
                    key={t.id}
                    onClick={() => setSelected(t)}
                    className={clsx(
                      'border-b border-slate-50 dark:border-slate-800/50 cursor-pointer transition-colors',
                      selected?.id === t.id ? 'bg-red-50/50 dark:bg-red-900/5' : 'hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                    )}
                  >
                    <td className="px-5 py-3 font-mono text-xs font-medium text-slate-700 dark:text-slate-300">{t.id}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300 max-w-[200px] truncate text-xs">{t.subject}</td>
                    <td className="px-5 py-3"><Badge status={typeColors[t.type]?.replace('badge-', '') || 'review'}>{t.type}</Badge></td>
                    <td className="px-5 py-3"><ScoreBar value={t.score} /></td>
                    <td className="px-5 py-3 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">{t.received}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={e => { e.stopPropagation(); handleDismiss(t.id) }}
                        className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors"
                      >
                        Close
                      </button>
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
                      All tickets cleared 🎉
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: chart + detail */}
        <div className="space-y-4">
          <div className="card">
            <div className="card-header"><span className="card-title">By Rejection Type</span></div>
            <div className="p-4 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeStats} layout="vertical" margin={{ left: 8, right: 8, top: 4, bottom: 4 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="type" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip formatter={v => [`${v} tickets`]} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {typeStats.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.8} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {selected ? (
            <div className="card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{selected.id}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selected.subject}</p>
                </div>
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">Domain</span>
                  <span className="text-red-500 font-mono">{selected.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">Rejection type</span>
                  <span className="text-slate-600 dark:text-slate-300">{selected.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 dark:text-slate-500">Confidence</span>
                  <ScoreBar value={selected.score} />
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <button onClick={() => handleDismiss(selected.id)} className="btn-secondary text-xs flex-1 justify-center">
                  <Trash2 className="w-3.5 h-3.5" /> Close Ticket
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-4 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500">Click a row to inspect details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
