import { useState, useEffect, useMemo } from 'react'
import {
  Check, CheckCircle, ChevronRight, Edit2, Globe2, MessageSquareText,
  Mic, Send, Sparkles, Wand2, X, AlertCircle, Clock, Tag, Zap,
  FileText, BarChart2, ShieldCheck, ArrowRight, Copy, Download,
} from 'lucide-react'
import { Badge, ProgressBar } from '../components/ui/index.jsx'
import { tickets, getTicketDetail } from '../data/mockData.js'
import clsx from 'clsx'

// ─── Constants ────────────────────────────────────────────────────────────────

const RTL = new Set(['ar', 'fa', 'he', 'ur'])
const FILTERS = ['all', 'pending', 'approved']
const DEFAULT_SCOPE = { channel: 'All channels' }
const URGENCY_CONFIG = {
  high:   { label: 'High',   cls: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',    dot: 'bg-red-500'    },
  medium: { label: 'Medium', cls: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400', dot: 'bg-amber-500' },
  low:    { label: 'Low',    cls: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',dot: 'bg-slate-400' },
  none:   { label: '—',      cls: 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500',dot: 'bg-slate-300' },
}

function matchesScope(ticket, workspaceScope) {
  const scope = workspaceScope ?? DEFAULT_SCOPE
  return scope.channel === 'All channels' || ticket.channel === scope.channel
}

function ageToMinutes(age) {
  const match = age.match(/^(\d+(?:\.\d+)?)([mhd])\s+ago$/i)
  if (!match) return 0
  const [, valueText, unit] = match
  const value = Number.parseFloat(valueText)
  if (Number.isNaN(value)) return 0
  if (unit.toLowerCase() === 'd') return value * 60 * 24
  if (unit?.startsWith('h')) return value * 60
  return value
}

function counts(items) {
  return {
    all: items.length,
    pending: items.filter(t => t.status === 'pending').length,
    approved:items.filter(t => t.status === 'approved').length,
  }
}

// ─── Left column: Ticket Queue ────────────────────────────────────────────────

function TicketQueue({ items, selected, onSelect, filter, onFilter, sortOrder, onSortChange }) {
  const c = counts(items)
  const filtered = filter === 'all' ? items : items.filter(t => t.status === filter)
  const sorted = [...filtered].sort((a, b) => (
    sortOrder === 'latest'
      ? ageToMinutes(a.age) - ageToMinutes(b.age)
      : ageToMinutes(b.age) - ageToMinutes(a.age)
  ))

  return (
    <aside className="flex h-full min-h-0 flex-col bg-white dark:bg-[#111116] border-r border-slate-100 dark:border-slate-800">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Queue</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">Ticket Review</p>
          </div>
          <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-2.5 py-1 rounded-full">{c.all}</span>
        </div>
        {/* Filter pills */}
        <div className="grid grid-cols-3 gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => onFilter(f)} className={clsx(
              'inline-flex items-center justify-center gap-2 rounded-lg py-1.5 px-1 text-[10px] font-semibold capitalize transition-all',
              filter === f
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            )}>
              <span>{f}</span>
              {c[f] > 0 && <span className="inline-block text-slate-400 dark:text-slate-500">{c[f]}</span>}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Sort</span>
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {['latest', 'oldest'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onSortChange(option)}
                className={clsx(
                  'rounded-md px-2 py-1 text-[10px] font-semibold capitalize transition-all',
                  sortOrder === option
                    ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="hover-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        {sorted.map(t => {
          const urg = URGENCY_CONFIG[t.urgency] ?? URGENCY_CONFIG.low
          const isSelected = selected?.id === t.id
          return (
            <button key={t.id} onClick={() => onSelect(t)} className={clsx(
              'w-full text-left rounded-2xl border px-3.5 py-3 transition-all group',
              isSelected
                ? 'border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 shadow-sm'
                : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/30 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/60'
            )}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">{t.id}</span>
                <Badge status={t.status}>{t.status}</Badge>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2 mb-2.5">{t.subject}</p>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                  <span>{t.lang}</span>
                  <span>·</span>
                  <span>{t.category}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={clsx('flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold', urg.cls)}>
                    <span className={clsx('w-1.5 h-1.5 rounded-full', urg.dot)} />
                    {urg.label}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={clsx('h-full rounded-full', t.confidence >= 90 ? 'bg-emerald-500' : t.confidence >= 75 ? 'bg-amber-500' : 'bg-red-400')}
                    style={{ width: `${t.confidence}%` }} />
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 flex-shrink-0">{t.confidence}%</span>
                <span className="text-[10px] text-slate-300 dark:text-slate-600 flex-shrink-0">{t.age}</span>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

// ─── Middle column: Case Workspace ────────────────────────────────────────────

function LanguageToggle({ detail, viewMode, onChange }) {
  const opts = [
    { id: 'native',  label: detail.languageLabel ?? 'Native' },
    { id: 'both',    label: 'Both' },
    { id: 'english', label: 'English' },
  ]
  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-0.5">
      {opts.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)} className={clsx(
          'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
          viewMode === o.id
            ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        )}>{o.label}</button>
      ))}
    </div>
  )
}

function MessageBubble({ entry, dir = 'ltr' }) {
  const isCustomer = entry.role === 'customer'
  return (
    <div className={clsx('flex gap-2.5 items-end', !isCustomer && 'flex-row-reverse')}>
      <div className={clsx(
        'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mb-0.5',
        isCustomer ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'bg-indigo-500 text-white'
      )}>
        {isCustomer ? 'C' : 'S'}
      </div>
      <div className={clsx(
        'max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed',
        isCustomer
          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-sm'
          : 'bg-indigo-500 text-white rounded-br-sm'
      )} dir={dir}>
        <p className="mb-1 text-[9px] font-bold uppercase tracking-wider opacity-60">{entry.time}</p>
        {entry.text}
      </div>
    </div>
  )
}

function ConversationPane({ title, entries, dir = 'ltr' }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">{title}</p>
      <div className="space-y-2">
        {entries.map((e, i) => <MessageBubble key={i} entry={e} dir={dir} />)}
      </div>
    </div>
  )
}

function WebformPane({ title, fields }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.entries(fields).map(([k, v]) => (
          <div key={k} className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 px-3 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">{k}</p>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SourceSection({ detail, viewMode }) {
  const dir  = RTL.has(detail.detectedLanguage) ? 'rtl' : 'ltr'
  const both = viewMode === 'both'
  const showN = viewMode === 'native' || both
  const showE = viewMode === 'english' || both

  if (detail.channel === 'Webforms') {
    return (
      <div className={clsx('flex gap-4', both ? 'flex-row' : 'flex-col')}>
        {showN && <WebformPane title={`${detail.languageLabel} form`} fields={detail.webformNative ?? {}} />}
        {showE && <WebformPane title="English form" fields={detail.webformEnglish ?? {}} />}
      </div>
    )
  }

  const nativeEntries  = detail.conversationNative  ?? detail.conversation ?? []
  const englishEntries = detail.conversationEnglish ?? detail.conversation ?? []

  return (
    <div className={clsx('flex gap-4', both ? 'flex-row' : 'flex-col')}>
      {showN && <ConversationPane title={`${detail.languageLabel} · ${detail.channel}`} entries={nativeEntries} dir={dir} />}
      {showE && <ConversationPane title={`English · ${detail.channel}`} entries={englishEntries} />}
    </div>
  )
}

function DraftEditor({ label, value, onChange, editing, onEdit, dir = 'ltr' }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard?.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</p>
        <div className="flex items-center gap-1">
          <button onClick={handleCopy} className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <Copy className="w-3 h-3" />{copied ? 'Copied!' : 'Copy'}
          </button>
          {!editing && (
            <button onClick={onEdit} className="flex items-center gap-1 text-[10px] text-indigo-500 hover:text-indigo-600 transition-colors ml-2">
              <Edit2 className="w-3 h-3" />Edit
            </button>
          )}
        </div>
      </div>
      {editing ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={10}
          className="input-base resize-none text-sm leading-relaxed font-[inherit]" dir={dir} />
      ) : (
        <div className="min-h-[180px] rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap" dir={dir}>
          {value}
        </div>
      )}
    </div>
  )
}

function CaseWorkspace({ ticket, detail, viewMode, setViewMode, onOpenStudio }) {
  const dir = RTL.has(detail.detectedLanguage) ? 'rtl' : 'ltr'
  const both = viewMode === 'both'
  const [editing, setEditing] = useState(null)
  const [sent, setSent] = useState(false)
  const [drafts, setDrafts] = useState({ native: detail.nativeDraft, english: detail.englishDraft })

  useEffect(() => {
    setDrafts({ native: detail.nativeDraft, english: detail.englishDraft })
    setEditing(null)
  }, [detail.id])

  useEffect(() => { setEditing(null) }, [viewMode])

  const handleSend = () => { setSent(true); setTimeout(() => setSent(false), 2000) }

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50 dark:bg-[#0d0d10]">
      {/* Case header */}
      <div className="flex-shrink-0 px-5 py-4 bg-white dark:bg-[#111116] border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 mb-1">
              <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{ticket.id}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{detail.channel}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{detail.languageLabel}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{ticket.subject}</h2>
          </div>
          <LanguageToggle detail={detail} viewMode={viewMode} onChange={setViewMode} />
        </div>
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {[
            { label: ticket.category,     icon: Tag,       cls: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
            { label: ticket.age,          icon: Clock,     cls: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' },
            { label: detail.channel,      icon: FileText,  cls: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' },
            { label: `${ticket.confidence}% confidence`, icon: Zap, cls: ticket.confidence >= 85 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
          ].map(({ label, icon: Icon, cls }) => (
            <span key={label} className={clsx('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold', cls)}>
              <Icon className="w-3 h-3" />{label}
            </span>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="hover-scrollbar min-h-0 flex-1 overflow-y-auto">
        {/* Source panel */}
        <div className="mx-5 mt-5">
          <div className="bg-white dark:bg-[#17171c] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <MessageSquareText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Source Record</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    {detail.channel === 'Webforms' ? 'Submitted customer form' : 'Customer conversation'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">{detail.channel}</span>
            </div>
            <div className="p-5">
              <SourceSection detail={detail} viewMode={viewMode} />
            </div>
          </div>
        </div>

        {/* Draft workspace */}
        <div className="mx-5 mt-4 mb-5">
          <div className="bg-white dark:bg-[#17171c] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">AI Draft</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Review, edit, and send the response</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">Ready to review</span>
            </div>

            <div className="p-5">
              <div className={clsx('flex gap-4', both ? 'flex-row' : 'flex-col')}>
                {(viewMode === 'native' || both) && (
                  <DraftEditor
                    label={`${detail.languageLabel} response`}
                    value={drafts.native}
                    onChange={v => setDrafts(d => ({ ...d, native: v }))}
                    editing={editing === 'native'}
                    onEdit={() => setEditing('native')}
                    dir={dir}
                  />
                )}
                {(viewMode === 'english' || both) && (
                  <DraftEditor
                    label="English response"
                    value={drafts.english}
                    onChange={v => setDrafts(d => ({ ...d, english: v }))}
                    editing={editing === 'english'}
                    onEdit={() => setEditing('english')}
                  />
                )}
              </div>

              {/* AI Studio nudge */}
              {!editing && (
                <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-500/20 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Wand2 className="w-4 h-4 text-violet-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">Need a quick revision?</p>
                      <p className="text-[10px] text-violet-500 dark:text-violet-400">Change tone, strengthen the apology, or simplify the response.</p>
                    </div>
                  </div>
                  <button onClick={onOpenStudio} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors">
                    AI Studio <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Action footer */}
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-b-2xl">
              {editing ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditing(null)} className="btn-primary py-1.5 text-xs">
                    <Check className="w-3.5 h-3.5" />Save Draft
                  </button>
                  <button onClick={() => { setDrafts({ native: detail.nativeDraft, english: detail.englishDraft }); setEditing(null) }} className="btn-secondary py-1.5 text-xs">
                    <X className="w-3.5 h-3.5" />Cancel
                  </button>
                </div>
              ) : (
                <button className="btn-ghost text-xs py-1.5">
                  <Download className="w-3.5 h-3.5" />Download Log
                </button>
              )}
              {!editing && (
                <div className="flex items-center gap-2">
                  <button className="btn-secondary text-xs py-1.5">Submit + Close</button>
                  <button onClick={handleSend} className={clsx('btn-primary text-xs py-1.5 transition-all', sent && '!bg-emerald-500 hover:!bg-emerald-500')}>
                    {sent ? <><CheckCircle className="w-3.5 h-3.5" />Sent!</> : <><Send className="w-3.5 h-3.5" />Submit</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Right column: Decision Panel ────────────────────────────────────────────

function InsightBlock({ title, children, accent = 'slate' }) {
  const accents = {
    slate:  'border-slate-100 dark:border-slate-800 bg-white dark:bg-[#17171c]',
    indigo: 'border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-500/5',
    emerald:'border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-500/5',
    amber:  'border-amber-100 dark:border-amber-500/20 bg-amber-50/40 dark:bg-amber-500/5',
  }
  return (
    <div className={clsx('rounded-xl border p-4', accents[accent])}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">{title}</p>
      {children}
    </div>
  )
}

function DecisionPanel({ ticket, detail }) {
  const [approved, setApproved] = useState(false)

  return (
    <aside className="flex h-full min-h-0 flex-col bg-white dark:bg-[#111116] border-l border-slate-100 dark:border-slate-800">
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Context</p>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">Decision Panel</p>
      </div>

      <div className="hover-scrollbar min-h-0 flex-1 overflow-y-auto p-4 space-y-3">

        {/* Confidence meters */}
        <InsightBlock title="AI Confidence" accent="indigo">
          <div className="space-y-3">
            {[
              { label: 'Resolution', val: detail.confidence.resolution, color: 'bg-indigo-500' },
              { label: 'Category',   val: detail.confidence.category,   color: 'bg-violet-500' },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-slate-500 dark:text-slate-400">{label}</span>
                  <span className={clsx('font-bold tabular-nums', val >= 85 ? 'text-emerald-600 dark:text-emerald-400' : val >= 70 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500')}>{val}%</span>
                </div>
                <ProgressBar value={val} color={color} />
              </div>
            ))}
          </div>
        </InsightBlock>

        {/* Summary */}
        <InsightBlock title="Case Summary" accent="slate">
          <div className="space-y-1.5">
            {detail.summary.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5" />
                {s}
              </div>
            ))}
          </div>
        </InsightBlock>

        {/* Actions */}
        <InsightBlock title="Recommended Actions" accent="emerald">
          <div className="space-y-1.5">
            {detail.actions.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                {a}
              </div>
            ))}
          </div>
        </InsightBlock>

        {/* Validation checklist */}
        <InsightBlock title="Validation" accent="slate">
          <div className="space-y-1.5">
            {Object.entries(detail.validation).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-2">
                <span className={clsx(
                  'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                  val ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-500'
                )}>
                  {val ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            ))}
          </div>
        </InsightBlock>

        {/* Tags */}
        <InsightBlock title="Tags" accent="slate">
          <div className="flex flex-wrap gap-1.5">
            {detail.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                #{tag}
              </span>
            ))}
          </div>
        </InsightBlock>

        {/* Approve / Reject */}
        <InsightBlock title="Decision" accent={approved ? 'emerald' : 'amber'}>
          {approved ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />Ticket approved & queued for Freshdesk
            </div>
          ) : (
            <div className="space-y-2">
              <button onClick={() => setApproved(true)} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors">
                <Check className="w-3.5 h-3.5" />Approve & Submit
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors">
                <AlertCircle className="w-3.5 h-3.5" />Flag for Review
              </button>
            </div>
          )}
        </InsightBlock>
      </div>
    </aside>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function TicketReview({ onOpenStudio, workspaceScope }) {
  const scopedTickets = useMemo(
    () => tickets.filter((ticket) => matchesScope(ticket, workspaceScope)),
    [workspaceScope]
  )
  const [selected, setSelected] = useState(scopedTickets[0] ?? null)
  const [filter, setFilter]     = useState('all')
  const [sortOrder, setSortOrder] = useState('latest')
  const [viewMode, setViewMode] = useState('native')

  useEffect(() => {
    if (!scopedTickets.length) {
      setSelected(null)
      return
    }

    if (!selected || !scopedTickets.some((ticket) => ticket.id === selected.id)) {
      setSelected(scopedTickets[0])
      setViewMode('native')
    }
  }, [scopedTickets, selected])

  const detail = selected ? getTicketDetail(selected) : null

  if (!selected || !detail) {
    return <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-slate-500">No tickets available.</div>
  }

  return (
    <div className="grid h-full min-h-0 overflow-hidden"
      style={{ gridTemplateColumns: '288px 1fr 272px' }}>
      <TicketQueue
        items={scopedTickets}
        selected={selected}
        onSelect={t => { setSelected(t); setViewMode('native') }}
        filter={filter}
        onFilter={setFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />
      <CaseWorkspace
        ticket={selected}
        detail={detail}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenStudio={onOpenStudio}
      />
      <DecisionPanel
        ticket={selected}
        detail={detail}
      />
    </div>
  )
}
