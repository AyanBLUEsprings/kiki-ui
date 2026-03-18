import { useState } from 'react'
import { Globe, TrendingUp, Clock, Star, ToggleLeft, ToggleRight } from 'lucide-react'
import { languageData, tickets } from '../data/mockData.js'
import { StatCard, ProgressBar, Badge } from '../components/ui/index.jsx'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import clsx from 'clsx'

const TRANSLATIONS = tickets.slice(0, 5).map(t => ({
  id: t.id,
  original: t.subject,
  translated: {
    'Arabic': t.subject.length > 40
      ? 'لم أستلم طلبي حتى الآن رغم مرور 3 أسابيع — هدية عيد الميلاد'
      : 'استفسار عن الطلب الجديد — أسعار الجملة',
    'Turkish': t.subject.length > 40
      ? '3 haftadır siparişimi almadım — acil, doğum günü hediyesi'
      : 'Toplu sipariş fiyatları — 500+ ürün için fiyat teklifi',
    'French': t.subject.length > 40
      ? 'Je n\'ai pas reçu ma commande depuis 3 semaines — cadeau d\'anniversaire'
      : 'Demande de commande — tarification pour plus de 500 unités',
  },
  quality: t.confidence >= 90 ? 'high' : t.confidence >= 75 ? 'medium' : 'low',
  time: '1.2s',
}))

const QUALITY_MAP = {
  high: 'badge-approved',
  medium: 'badge-pending',
  low: 'badge-spam',
}

const radarData = [
  { subject: 'Accuracy', Arabic: 98, Turkish: 96, French: 94 },
  { subject: 'Fluency', Arabic: 95, Turkish: 94, French: 92 },
  { subject: 'Tone', Arabic: 92, Turkish: 90, French: 88 },
  { subject: 'Speed', Arabic: 90, Turkish: 85, French: 88 },
  { subject: 'Coverage', Arabic: 97, Turkish: 93, French: 89 },
]

export default function LanguageHub() {
  const [selected, setSelected] = useState(languageData[0])
  const [langs, setLangs] = useState(languageData)

  const toggleLang = (langName) => {
    setLangs(prev => prev.map(l => l.lang === langName ? { ...l, active: !l.active } : l))
    if (selected?.lang === langName) {
      const updated = langs.find(l => l.lang === langName)
      setSelected(prev => ({ ...prev, active: !prev.active }))
    }
  }

  const currentTranslations = TRANSLATIONS.map(t => ({
    ...t,
    translatedText: t.translated[selected.lang] ?? '(translation unavailable)',
  }))

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Language selector sidebar */}
      <div className="w-52 flex-shrink-0 flex flex-col border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111116]">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Active Languages</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/60">
          {langs.map(l => (
            <button
              key={l.lang}
              onClick={() => setSelected(l)}
              className={clsx(
                'w-full text-left px-4 py-3 flex items-center gap-3 transition-colors',
                selected.lang === l.lang ? 'bg-indigo-50 dark:bg-indigo-500/10 border-l-2 border-indigo-500' : 'hover:bg-slate-50 dark:hover:bg-white/[0.02]'
              )}
            >
              <span className="text-xl flex-shrink-0">{l.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{l.lang}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">{l.pct}% · {l.tickets} tickets</p>
              </div>
              <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', l.active ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600')} />
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/10">
        <div className="p-6 space-y-5">
          {/* Language header card */}
          <div className="card p-5 flex items-center gap-5">
            <span className="text-5xl">{selected.flag}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">{selected.lang}</h2>
                <button
                  onClick={() => toggleLang(selected.lang)}
                  className={clsx('flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-all', selected.active ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400')}
                >
                  {selected.active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                  {selected.active ? 'Active' : 'Inactive'}
                </button>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Auto-detected · RTL support · Native dialect handling</p>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { label: 'Tickets', value: selected.tickets, icon: '📬' },
                { label: 'Quality', value: `${selected.quality}%`, icon: '⭐' },
                { label: 'Avg. Time', value: selected.time, icon: '⚡' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-lg font-display font-bold text-slate-900 dark:text-white">{s.value}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Translation samples */}
            <div className="lg:col-span-2 card">
              <div className="card-header">
                <span className="card-title">Recent Translations — {selected.lang}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      {['ID', 'Original (EN)', selected.lang, 'Quality'].map(h => (
                        <th key={h} className="text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentTranslations.map(t => (
                      <tr key={t.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3 font-mono text-xs font-medium text-slate-700 dark:text-slate-300">{t.id}</td>
                        <td className="px-5 py-3 text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                          <p className="line-clamp-2 leading-relaxed">{t.original}</p>
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-600 dark:text-slate-300 max-w-[200px]">
                          <p className="line-clamp-2 leading-relaxed" dir={['Arabic'].includes(selected.lang) ? 'rtl' : 'ltr'}>{t.translatedText}</p>
                        </td>
                        <td className="px-5 py-3">
                          <Badge status={QUALITY_MAP[t.quality]?.replace('badge-', '') || 'review'}>{t.quality}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quality radar */}
            <div className="card">
              <div className="card-header"><span className="card-title">Quality Radar</span></div>
              <div className="p-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-700" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Radar name={selected.lang} dataKey={selected.lang} stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* All languages overview */}
          <div className="card">
            <div className="card-header"><span className="card-title">All Languages — Coverage Overview</span></div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-5 gap-5">
              {langs.map(l => (
                <div key={l.lang} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{l.flag}</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{l.lang}</span>
                  </div>
                  <ProgressBar value={l.pct} color={l.active ? 'bg-indigo-400' : 'bg-slate-300 dark:bg-slate-600'} />
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                    <span>{l.pct}%</span>
                    <span className={clsx('font-medium', l.active ? 'text-emerald-500' : 'text-slate-400')}>{l.active ? 'On' : 'Off'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
