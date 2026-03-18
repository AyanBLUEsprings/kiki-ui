import { useState, useEffect, useRef } from 'react'
import {
  Scale, FileText, ScrollText, Users, AlertTriangle,
  Lock, Download, Plus, CheckCircle2, Clock, ChevronDown, ChevronRight,
  Search, Trash2, FileEdit, ShieldBan, ShieldCheck, Hash,
  RefreshCw, Loader2, CheckCircle, Send, Minus, Shield,
} from 'lucide-react'
import { StatCard, Toggle, Badge } from '../components/ui/index.jsx'
import {
  gdprRequests, gdprAuditLog, gdprProcessingActivities,
} from '../data/mockData.js'
import clsx from 'clsx'

// ─── Tabs ────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview',  label: 'Overview',       icon: FileText    },
  { id: 'audit',     label: 'Audit Log',      icon: ScrollText  },
  { id: 'subjects',  label: 'Subject Rights', icon: Users       },
  { id: 'breaches',  label: 'Breach Log',     icon: AlertTriangle },
]

// ─── Policies & retention (existing) ─────────────────────────────────────────

const POLICIES = [
  { key: 'store_content', label: 'Store ticket content after closure',     description: 'Retain full message history for closed tickets',         on: true  },
  { key: 'cross_border',  label: 'Allow cross-border data processing',     description: 'Data may be processed in EU/US data centres',            on: true  },
  { key: 'ai_training',   label: 'Use tickets for AI model training',      description: 'Anonymised data may improve AI accuracy',                on: false },
  { key: 'analytics',     label: 'Anonymous analytics logging',            description: 'Aggregate usage metrics for product insights',            on: true  },
  { key: 'third_party',   label: 'Share data with third-party integrations',description: 'Freshdesk, Slack, and webhook destinations',             on: false },
]

const RETENTION = [
  { label: 'Ticket messages',  days: 180, max: 365, color: 'bg-indigo-400' },
  { label: 'AI revision logs', days: 90,  max: 365, color: 'bg-violet-400' },
  { label: 'Customer PII',     days: 365, max: 365, color: 'bg-red-400'    },
  { label: 'Spam records',     days: 30,  max: 365, color: 'bg-amber-400'  },
  { label: 'Translation cache',days: 60,  max: 365, color: 'bg-cyan-400'   },
]

// ─── Audit log ────────────────────────────────────────────────────────────────

const AUDIT_TABLE_LABELS = {
  vault_access_audit:     'Vault Access',
  ai_processing_log:      'AI Processing',
  data_erasure_log:       'Data Erasure',
  security_event_log:     'Security Events',
  system_access_logs:     'System Access',
  data_access_export_log: 'Data Exports',
}

const TABLE_COLUMNS = {
  vault_access_audit:     [{ key: 'timestamp', h: 'Time' }, { key: 'access_type', h: 'Access' }, { key: 'vault_entry_id', h: 'Entry' }, { key: 'processing_purpose', h: 'Purpose' }, { key: 'requested_by', h: 'By' }, { key: 'risk_level', h: 'Risk' }],
  ai_processing_log:      [{ key: 'timestamp', h: 'Time' }, { key: 'ticket_id', h: 'Ticket' }, { key: 'service_name', h: 'Service' }, { key: 'model_name', h: 'Model' }, { key: 'contains_raw_pii', h: 'Raw PII' }, { key: 'input_data_classification', h: 'Class.' }],
  data_erasure_log:       [{ key: 'timestamp', h: 'Time' }, { key: 'data_subject_id', h: 'Subject' }, { key: 'requested_by', h: 'By' }, { key: 'status', h: 'Status' }, { key: 'systems_erased', h: 'Systems' }],
  security_event_log:     [{ key: 'timestamp', h: 'Time' }, { key: 'event_type', h: 'Event' }, { key: 'severity', h: 'Severity' }, { key: 'description', h: 'Description' }, { key: 'detected_by', h: 'Detected By' }, { key: 'breach_flag', h: 'Breach' }],
  system_access_logs:     [{ key: 'timestamp', h: 'Time' }, { key: 'actor_id', h: 'Actor' }, { key: 'actor_type', h: 'Type' }, { key: 'action', h: 'Action' }, { key: 'resource_type', h: 'Resource' }, { key: 'success', h: 'OK' }],
  data_access_export_log: [{ key: 'timestamp', h: 'Time' }, { key: 'data_subject_id', h: 'Subject' }, { key: 'delivery_method', h: 'Method' }, { key: 'status', h: 'Status' }, { key: 'export_checksum', h: 'Checksum' }],
}

const SEV_COLORS = {
  LOW:      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  MEDIUM:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  HIGH:     'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  CRITICAL: 'bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-300',
}

function fmtTs(ts) {
  try { return new Date(ts).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) }
  catch { return ts }
}

function AuditCell({ value, colKey }) {
  if (value == null) return <span className="text-slate-300 dark:text-slate-600">—</span>
  if (colKey === 'timestamp') return <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums whitespace-nowrap">{fmtTs(String(value))}</span>
  if (typeof value === 'boolean') return <span className={clsx('text-xs font-semibold', value ? 'text-red-500' : 'text-slate-300 dark:text-slate-600')}>{value ? 'Yes' : 'No'}</span>
  if (colKey === 'severity') return <span className={clsx('inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold', SEV_COLORS[String(value)] ?? 'bg-slate-100 text-slate-600')}>{String(value)}</span>
  if (Array.isArray(value)) return <span className="text-xs text-slate-500 dark:text-slate-400">{value.join(', ')}</span>
  if (colKey === 'data_subject_id' && String(value).length > 16) return <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{String(value).slice(0, 8)}…{String(value).slice(-4)}</span>
  return <span className="text-xs text-slate-600 dark:text-slate-300">{String(value).length > 60 ? String(value).slice(0, 60) + '…' : String(value)}</span>
}

function AuditLog() {
  const [expanded, setExpanded] = useState(new Set(['security_event_log']))
  const [tableFilter, setTableFilter] = useState('')
  const tables = gdprAuditLog
  const tableKeys = tableFilter ? [tableFilter] : Object.keys(tables)

  return (
    <div className="space-y-3">
      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <select value={tableFilter} onChange={e => setTableFilter(e.target.value)}
          className="rounded-lg px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-400">
          <option value="">All tables</option>
          {Object.entries(AUDIT_TABLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
          {Object.values(tables).reduce((s, r) => s + r.length, 0)} total entries (mock)
        </span>
      </div>

      {/* Accordion per table */}
      {tableKeys.map(key => {
        const rows = tables[key] ?? []
        const cols = TABLE_COLUMNS[key] ?? [{ key: 'timestamp', h: 'Time' }]
        const isOpen = expanded.has(key)
        return (
          <div key={key} className="card overflow-hidden">
            <button onClick={() => setExpanded(prev => {
              const next = new Set(prev)
              next.has(key) ? next.delete(key) : next.add(key)
              return next
            })} className="flex w-full items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
              {isOpen ? <ChevronDown className="w-4 h-4 text-indigo-500 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              <ScrollText className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex-1 text-left">{AUDIT_TABLE_LABELS[key] ?? key}</span>
              <span className={clsx('rounded-full px-2 py-0.5 text-xs font-bold', rows.length > 0 ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400')}>
                {rows.length}
              </span>
            </button>
            {isOpen && rows.length > 0 && (
              <div className="overflow-x-auto border-t border-slate-50 dark:border-slate-800">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      {cols.map(c => <th key={c.key} className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{c.h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        {cols.map(c => <td key={c.key} className="px-4 py-2.5"><AuditCell value={row[c.key]} colKey={c.key} /></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {isOpen && rows.length === 0 && (
              <div className="px-5 py-6 text-center text-sm text-slate-400 dark:text-slate-500 border-t border-slate-50 dark:border-slate-800">No entries</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Subject Rights ───────────────────────────────────────────────────────────

function SubjectRights() {
  const [email, setEmail]   = useState('')
  const [fdId, setFdId]     = useState('')
  const [action, setAction] = useState(null)   // 'export' | 'rectify' | 'restrict' | 'erase' | 'resolve'
  const [result, setResult] = useState(null)
  const [error, setError]   = useState(null)
  const [eraseConfirm, setEraseConfirm] = useState(false)
  const [rectField, setRectField]       = useState('')
  const [rectOld, setRectOld]           = useState('')
  const [rectNew, setRectNew]           = useState('')
  const [resolveHash, setResolveHash]   = useState('')

  const valid = email.trim() && fdId.trim()

  const act = (id, res) => { setAction(null); setResult({ id, ...res }); setError(null) }
  const err = (msg) => { setAction(null); setError(msg) }

  const handleExport   = () => { if (!valid) return; setAction('export');   setTimeout(() => act('export',   { msg: `Export complete — 3 tables, 12 records for ${email}` }), 800) }
  const handleRectify  = () => { if (!valid || !rectField || !rectNew) return; setAction('rectify');  setTimeout(() => act('rectify',  { msg: `Rectified: ${rectField} updated successfully` }), 800) }
  const handleRestrict = (r) => { if (!valid) return; setAction(r ? 'restrict' : 'unrestrict'); setTimeout(() => act('restrict', { msg: `Processing ${r ? 'restricted' : 'lifted'} for ${email}` }), 800) }
  const handleErase    = () => { if (!valid) return; setEraseConfirm(false); setAction('erase');    setTimeout(() => act('erase',    { msg: `Erasure complete — freshdesk, vault, analytics` }), 1000) }
  const handleResolve  = () => { if (!resolveHash.trim()) return; setAction('resolve'); setTimeout(() => act('resolve', { msg: `Resolved: user-8821@example.com (DSB-8821-a4f2)` }), 600) }

  return (
    <div className="space-y-4">
      {/* Lookup */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Data Subject Lookup</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Both fields required to verify identity before any rights operation</p>
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input type="email" placeholder="user@example.com" value={email} onChange={e => setEmail(e.target.value)}
              className="input-base pl-9" />
          </div>
          <input type="text" placeholder="Freshdesk Contact ID" value={fdId} onChange={e => setFdId(e.target.value)}
            className="input-base sm:w-48" />
        </div>
        {email && !fdId && <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">Freshdesk Contact ID required</p>}
      </div>

      {/* Status banner */}
      {error  && <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400"><AlertTriangle className="w-4 h-4 flex-shrink-0" />{error}</div>}
      {result && <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="w-4 h-4 flex-shrink-0" />{result.msg}</div>}

      {/* Action grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Art.15 */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Download className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Data Export</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">Art. 15</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Right of access — export all data held about this subject</p>
          <button onClick={handleExport} disabled={!valid || action === 'export'}
            className="w-full btn-secondary justify-center py-2 text-xs disabled:opacity-50">
            {action === 'export' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Export Data
          </button>
        </div>

        {/* Rectification Art.16 */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <FileEdit className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Rectification</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">Art. 16</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Correct inaccurate personal data</p>
          <div className="space-y-2 mb-3">
            <input type="text" placeholder="Field name" value={rectField} onChange={e => setRectField(e.target.value)} className="input-base text-xs py-1.5" />
            <div className="flex gap-2">
              <input type="text" placeholder="Old value" value={rectOld} onChange={e => setRectOld(e.target.value)} className="input-base text-xs py-1.5 flex-1" />
              <input type="text" placeholder="New value" value={rectNew} onChange={e => setRectNew(e.target.value)} className="input-base text-xs py-1.5 flex-1" />
            </div>
          </div>
          <button onClick={handleRectify} disabled={!valid || !rectField || !rectNew || action === 'rectify'}
            className="w-full btn-secondary justify-center py-2 text-xs disabled:opacity-50">
            {action === 'rectify' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileEdit className="w-3.5 h-3.5" />}
            Apply Rectification
          </button>
        </div>

        {/* Restriction Art.18 */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <ShieldBan className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Restriction</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">Art. 18</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Restrict or lift restriction on processing</p>
          <div className="flex gap-2">
            <button onClick={() => handleRestrict(true)} disabled={!valid || !!action}
              className="flex-1 btn-secondary justify-center py-2 text-xs disabled:opacity-50">
              {action === 'restrict' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldBan className="w-3.5 h-3.5" />}
              Restrict
            </button>
            <button onClick={() => handleRestrict(false)} disabled={!valid || !!action}
              className="flex-1 btn-secondary justify-center py-2 text-xs disabled:opacity-50">
              {action === 'unrestrict' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              Lift
            </button>
          </div>
        </div>

        {/* Erasure Art.17 */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Trash2 className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Erasure</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">Art. 17</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Permanently delete all data for this subject</p>
          {eraseConfirm ? (
            <div className="space-y-2">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">This action is irreversible.</p>
              <div className="flex gap-2">
                <button onClick={handleErase} disabled={action === 'erase'}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors">
                  {action === 'erase' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Confirm
                </button>
                <button onClick={() => setEraseConfirm(false)} className="px-3 py-2 text-xs btn-ghost">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setEraseConfirm(true)} disabled={!valid}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Request Erasure
            </button>
          )}
        </div>
      </div>

      {/* Resolve hash */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-1">
          <Hash className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Resolve Subject Hash</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">DPO / Legal</span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Look up a data subject by their hashed ID — logs a DECRYPTION_EVENT</p>
        <div className="flex gap-3">
          <input type="text" placeholder="SHA-256 hash…" value={resolveHash} onChange={e => setResolveHash(e.target.value)}
            className="input-base flex-1 font-mono text-xs" />
          <button onClick={handleResolve} disabled={!resolveHash.trim() || action === 'resolve'} className="btn-secondary text-xs py-2 px-4 disabled:opacity-50">
            {action === 'resolve' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Hash className="w-3.5 h-3.5" />}
            Resolve
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Breach Log ───────────────────────────────────────────────────────────────

function useCountdown(deadline) {
  const [display, setDisplay] = useState(null)
  useEffect(() => {
    if (!deadline) { setDisplay(null); return }
    const tick = () => {
      const ms = new Date(deadline).getTime() - Date.now()
      if (ms <= 0) { setDisplay({ text: 'OVERDUE', urgent: true }); return }
      const h = Math.floor(ms / 3_600_000)
      const m = Math.floor((ms % 3_600_000) / 60_000)
      const s = Math.floor((ms % 60_000) / 1000)
      setDisplay({ text: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`, urgent: h < 24 })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [deadline])
  return display
}

const SEV_OPTS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

function BreachLog() {
  const securityEvents = gdprAuditLog.security_event_log ?? []
  const breachFlagged  = securityEvents.filter(e => e.breach_flag === true)
  const displayRows    = breachFlagged.length > 0 ? breachFlagged : securityEvents

  const [desc, setDesc]           = useState('')
  const [sev, setSev]             = useState('HIGH')
  const [affected, setAffected]   = useState('')
  const [detectedBy, setDetected] = useState('')
  const [incRef, setIncRef]       = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(null)
  const [submitErr, setSubmitErr]   = useState(null)

  // 72h deadline from when the breach was "submitted" in this session
  const deadlineRef = useRef(null)
  const [deadline, setDeadline] = useState(null)
  const countdown = useCountdown(deadline)

  const handleSubmit = () => {
    if (!desc.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      const dl = new Date(Date.now() + 72 * 3_600_000).toISOString()
      deadlineRef.current = dl
      setDeadline(dl)
      setSubmitted({ id: `BREACH-${Date.now().toString(36).toUpperCase()}`, msg: 'Breach logged. Supervisory authority must be notified within 72 hours.' })
      setSubmitting(false)
      setDesc(''); setAffected(''); setDetected(''); setIncRef('')
    }, 900)
  }

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Security Events</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{securityEvents.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Breach Flagged</p>
          <p className="text-2xl font-bold text-red-500">{breachFlagged.length}</p>
        </div>
        {/* 72h countdown */}
        <div className={clsx('card p-5 transition-colors', countdown?.urgent ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : submitted ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10' : '')}>
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className={clsx('w-3.5 h-3.5', countdown?.urgent ? 'text-red-500' : 'text-slate-400')} />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">72h Deadline</p>
          </div>
          {countdown ? (
            <>
              <p className={clsx('text-2xl font-bold tabular-nums font-mono', countdown.urgent ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400')}>{countdown.text}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Notify authority by {fmtTs(deadline)}</p>
            </>
          ) : <p className="text-2xl font-bold text-slate-200 dark:text-slate-700">—</p>}
        </div>
      </div>

      {/* Report form */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Report Data Breach</h2>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">Art. 33</span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Description *</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Describe the breach incident…"
              className="input-base resize-none text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Severity *</label>
              <select value={sev} onChange={e => setSev(e.target.value)}
                className="input-base text-xs py-2">
                {SEV_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Affected Count</label>
              <input type="number" min={0} value={affected} onChange={e => setAffected(e.target.value)} placeholder="# of subjects"
                className="input-base text-xs py-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Detected By</label>
              <input type="text" value={detectedBy} onChange={e => setDetected(e.target.value)} placeholder="e.g. monitoring_system"
                className="input-base text-xs py-2" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Incident Reference</label>
              <input type="text" value={incRef} onChange={e => setIncRef(e.target.value)} placeholder="e.g. INC-2026-001"
                className="input-base text-xs py-2" />
            </div>
          </div>
          <button onClick={handleSubmit} disabled={!desc.trim() || submitting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Log Breach
          </button>
        </div>
        {submitErr  && <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400"><AlertTriangle className="w-4 h-4 flex-shrink-0" />{submitErr}</div>}
        {submitted  && <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="w-4 h-4 flex-shrink-0" />{submitted.msg} · ID: {submitted.id}</div>}
      </div>

      {/* History */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">{breachFlagged.length > 0 ? 'Breach History' : 'Security Event Log'}</span>
          {breachFlagged.length === 0 && securityEvents.length > 0 && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500">No breach_flag=true events — showing all security events</span>
          )}
        </div>
        {displayRows.length === 0
          ? <div className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">No security events recorded</div>
          : <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                    {['Time', 'Event', 'Severity', 'Description', 'Detected By', 'Breach'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map((b, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5 text-[11px] text-slate-400 dark:text-slate-500 tabular-nums whitespace-nowrap">{fmtTs(String(b.timestamp ?? ''))}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">{String(b.event_type ?? '—')}</td>
                      <td className="px-4 py-2.5"><span className={clsx('inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold', SEV_COLORS[String(b.severity)] ?? 'bg-slate-100 text-slate-600')}>{String(b.severity ?? '—')}</span></td>
                      <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">{String(b.description ?? '—')}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-400 dark:text-slate-500">{String(b.detected_by ?? '—')}</td>
                      <td className="px-4 py-2.5 text-xs">{b.breach_flag === true ? <span className="text-red-500 font-semibold">Yes</span> : <span className="text-slate-300 dark:text-slate-600">No</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </div>
    </div>
  )
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

const LOG_INTEGRITY = [
  { label: 'CloudTrail Enabled',   desc: 'All API calls logged to CloudTrail with integrity validation' },
  { label: 'S3 Object Lock Active',desc: 'Audit logs stored with WORM compliance in S3'                 },
  { label: 'Append-Only DB Role',  desc: 'Database role restricts audit table to INSERT-only operations' },
  { label: 'PII Masking Enabled',  desc: 'Personal data masked in logs via automated pipeline'          },
]

function OverviewTab() {
  const [requests, setRequests] = useState(gdprRequests)
  const [policies, setPolicies] = useState(POLICIES)
  const [filter, setFilter]     = useState('all')

  const toggle = (key) => setPolicies(prev => prev.map(p => p.key === key ? { ...p, on: !p.on } : p))
  const resolve = (id) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'done' } : r))
  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Requests"  value={String(requests.filter(r => r.status === 'pending').length)} delta="Must respond in 30 days"    deltaType="down"    icon={<Clock className="w-4 h-4" />}         accent="amber"  />
        <StatCard label="Resolved (30d)"    value="17"                                                           delta="100% on time"              deltaType="up"      icon={<CheckCircle2 className="w-4 h-4" />}   accent="emerald"/>
        <StatCard label="Active Policies"   value={String(policies.filter(p => p.on).length)}                   delta={`of ${policies.length} total`} deltaType="neutral" icon={<Scale className="w-4 h-4" />}         accent="indigo" />
        <StatCard label="Data Exports"      value="44"                                                           delta="This month"                deltaType="neutral" icon={<Download className="w-4 h-4" />}       accent="violet" />
      </div>

      {/* Art. 30 table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Article 30 — Processing Activities Registry</span>
          <button className="btn-ghost text-xs"><Download className="w-3.5 h-3.5" /> Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {['Activity', 'Legal Basis', 'Data Categories', 'Retention', 'Cross-border'].map(h => (
                  <th key={h} className="text-left py-2.5 px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gdprProcessingActivities.map((a, i) => (
                <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                  <td className="py-2.5 px-4 font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">{a.activity_name}</td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 text-xs">{a.legal_basis}</td>
                  <td className="py-2.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {a.data_categories.map((c, j) => <span key={j} className="inline-block px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] text-slate-500 dark:text-slate-400">{c}</span>)}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{a.retention_period}</td>
                  <td className="py-2.5 px-4">
                    {a.cross_border_transfer
                      ? <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs"><CheckCircle2 className="w-3 h-3" />Yes</span>
                      : <span className="flex items-center gap-1 text-slate-300 dark:text-slate-600 text-xs"><Minus className="w-3 h-3" />No</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* DSR queue */}
        <div className="card flex flex-col">
          <div className="card-header">
            <span className="card-title">Data Subject Requests</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {['all', 'pending', 'done'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={clsx(
                    'px-2.5 py-1 text-[10px] font-medium rounded-md capitalize transition-all',
                    filter === f ? 'bg-indigo-500 text-white' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}>{f}</button>
                ))}
              </div>
              <button className="btn-primary py-1 text-xs"><Plus className="w-3.5 h-3.5" /> New</button>
            </div>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
            {filtered.map(req => (
              <div key={req.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-200">{req.id}</span>
                    <Badge status={req.status === 'done' ? 'approved' : 'pending'}>{req.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{req.type}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{req.customer} · {req.date}</p>
                </div>
                {req.status === 'pending' && (
                  <button onClick={() => resolve(req.id)} className="btn-secondary text-xs py-1 flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Privacy policies */}
        <div className="card">
          <div className="card-header"><span className="card-title">Privacy Policies</span></div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
            {policies.map(p => (
              <div key={p.key} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-200">{p.label}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{p.description}</p>
                </div>
                <Toggle checked={p.on} onChange={() => toggle(p.key)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log integrity */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Log Integrity Status</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Expected GDPR infrastructure safeguards (configured at infrastructure level)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LOG_INTEGRITY.map(item => (
            <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retention schedule */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Data Retention Schedule</span>
          <button className="btn-ghost text-xs"><Download className="w-3.5 h-3.5" /> Export Policy</button>
        </div>
        <div className="p-5 space-y-4">
          {RETENTION.map(r => (
            <div key={r.label} className="flex items-center gap-4">
              <div className="w-36 flex-shrink-0 text-sm text-slate-600 dark:text-slate-300">{r.label}</div>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={clsx('h-full rounded-full transition-all', r.color)} style={{ width: `${(r.days / r.max) * 100}%` }} />
              </div>
              <div className="w-12 text-right text-xs font-mono text-slate-500 dark:text-slate-400 flex-shrink-0">{r.days}d</div>
              <select defaultValue={r.days} className="text-[10px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-1 text-slate-500 dark:text-slate-400 outline-none w-20 flex-shrink-0">
                {[30, 60, 90, 180, 365].map(d => <option key={d} value={d}>{d} days</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Root page ────────────────────────────────────────────────────────────────

export default function GDPRCompliance() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="page-container">
      {/* Page header + tab bar */}
      <div className="flex items-center gap-2 mb-1">
        <Shield className="w-5 h-5 text-indigo-500" />
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">GDPR Compliance Dashboard</h1>
      </div>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-5">Data privacy, subject rights, audit trails, and breach management</p>

      {/* Tab strip */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            tab === id
              ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.03] border border-transparent hover:text-slate-700 dark:hover:text-slate-200'
          )}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {tab === 'overview'  && <OverviewTab />}
      {tab === 'audit'     && <AuditLog />}
      {tab === 'subjects'  && <SubjectRights />}
      {tab === 'breaches'  && <BreachLog />}
    </div>
  )
}
