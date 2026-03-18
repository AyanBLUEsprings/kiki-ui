import { useState, useRef, useEffect } from 'react'
import { Send, Check, Copy, ThumbsUp, ThumbsDown, Sparkles, X, Zap } from 'lucide-react'
import { TICKET_DETAIL, revisionHistory } from '../data/mockData.js'
import clsx from 'clsx'

const SUGGESTIONS = [
  'More formal',
  'Stronger apology',
  'Shorten it',
  'Add follow-up date',
  'Add tracking link',
]

const MOCK_REVISIONS = {
  'More formal': `حضرة العميل المحترم،\n\nيسعدنا أن نُقدّم إليكم اعتذارنا الرسمي عن التأخير غير المبرر في توصيل طلبكم الكريم رقم #ORD-9912. تفضّلنا بتقديم خصم استثنائي بنسبة ٢٠٪ على مشترياتكم القادمة.\n\nمع خالص الاحترام والتقدير،\nفريق خدمة العملاء`,
}

let msgId = 0

export default function AIStudio({ onClose }) {
  const t = TICKET_DETAIL
  const [activeTab, setActiveTab] = useState('native')
  const [view, setView] = useState('chat') // 'chat' | 'history'
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [history, setHistory] = useState(revisionHistory)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (text) => {
    const prompt = text || input.trim()
    if (!prompt || loading) return
    setInput('')
    setView('chat')
    const userMsg = { id: ++msgId, role: 'user', text: prompt }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const revised = MOCK_REVISIONS[prompt] || `[Revised in ${activeTab === 'native' ? 'Arabic' : 'English'}]\n\nYour instructions have been applied. Connect your AI backend to generate real revisions.`
    setMessages(prev => [...prev, {
      id: ++msgId, role: 'assistant', text: '↳ Here is the revised response:',
      revised, applied: false, liked: null, prompt,
    }])
    setHistory(prev => [{ round: prev.length + 1, prompt, time: 'just now', applied: false }, ...prev])
    setLoading(false)
  }

  const handleApply = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, applied: true } : m))
    setHistory(prev => prev.map((h, i) => i === 0 ? { ...h, applied: true } : h))
  }

  const handleCopy = async (text, id) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const handleFeedback = (id, val) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, liked: val } : m))
  }

  const currentText = activeTab === 'native' ? t.nativeDraft : t.englishDraft

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose?.() }}
    >
      <div className="relative w-[440px] h-[680px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col bg-white dark:bg-[#0d0d10]">

        {/* Header */}
        <div className="px-3.5 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111116] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3 h-3 text-violet-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-slate-800 dark:text-slate-100">AI Revision Studio</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 rounded-full">{t.id}</span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-none">Refine with natural language</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
              {['native', 'english'].map(m => (
                <button
                  key={m}
                  onClick={() => setActiveTab(m)}
                  className={clsx(
                    'px-2.5 py-1 text-[11px] font-medium transition-all',
                    activeTab === m
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  )}
                >
                  {m === 'native' ? 'AR' : 'EN'}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-3.5 flex-shrink-0 bg-white dark:bg-[#111116]">
          {[
            { id: 'chat', label: 'Chat' },
            { id: 'history', label: `History${history.length ? ` (${history.length})` : ''}` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={clsx(
                'py-2 px-3 text-[12px] font-medium border-b-2 transition-all -mb-px',
                view === tab.id
                  ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                  : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CHAT VIEW */}
        {view === 'chat' && (
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-slate-50/40 dark:bg-slate-900/20">

            {/* Current draft — scrolls with content */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Current draft — {activeTab === 'native' ? 'Arabic' : 'English'}
                </span>
                <button onClick={() => handleCopy(currentText, 'original')} className="text-slate-300 dark:text-slate-600 hover:text-slate-500 transition-colors">
                  {copiedId === 'original' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p
                className="px-3 py-2.5 text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap"
                dir={activeTab === 'native' ? 'rtl' : 'ltr'}
              >
                {currentText}
              </p>
            </div>

            {messages.length === 0 && (
              <div>
                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Quick suggestions</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="px-2.5 py-1 text-[11px] bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id}>
                {msg.role === 'user' && (
                  <div className="flex justify-end">
                    <div className="bg-violet-500 text-white text-[12px] rounded-2xl rounded-tr-sm px-3.5 py-2 max-w-[80%] leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                )}
                {msg.role === 'assistant' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-2.5 h-2.5 text-violet-500" />
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">{msg.text}</p>
                    </div>
                    {msg.revised && (
                      <div className="ml-6 rounded-xl border border-emerald-200 dark:border-emerald-800/50 overflow-hidden bg-white dark:bg-[#17171c]">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50/60 dark:bg-emerald-900/10 border-b border-emerald-100 dark:border-emerald-900/40">
                          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Revised</span>
                          <button onClick={() => handleCopy(msg.revised, `copy-${msg.id}`)} className="text-slate-300 hover:text-slate-500 transition-colors">
                            {copiedId === `copy-${msg.id}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p
                          className="px-3 py-2.5 text-[12px] text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap"
                          dir={activeTab === 'native' ? 'rtl' : 'ltr'}
                        >
                          {msg.revised}
                        </p>
                        <div className="flex items-center gap-2 px-3 py-2 border-t border-slate-100 dark:border-slate-800">
                          {!msg.applied ? (
                            <button
                              onClick={() => handleApply(msg.id)}
                              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-md transition-colors"
                            >
                              <Check className="w-2.5 h-2.5" /> Apply
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              <Check className="w-2.5 h-2.5" /> Applied
                            </span>
                          )}
                          <div className="flex items-center gap-1 ml-auto">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">Helpful?</span>
                            <button onClick={() => handleFeedback(msg.id, true)} className={clsx('p-1 rounded transition-colors hover:bg-slate-100 dark:hover:bg-slate-800', msg.liked === true ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600')}>
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleFeedback(msg.id, false)} className={clsx('p-1 rounded transition-colors hover:bg-slate-100 dark:hover:bg-slate-800', msg.liked === false ? 'text-red-400' : 'text-slate-300 dark:text-slate-600')}>
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 ml-6">
                <div className="flex gap-0.5">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">AI is revising…</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* HISTORY VIEW */}
        {view === 'history' && (
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-slate-50/40 dark:bg-slate-900/20">
            {history.length === 0 ? (
              <p className="text-[12px] text-slate-400 dark:text-slate-500 text-center mt-8">No revisions yet.</p>
            ) : (
              history.map((h, i) => (
                <div key={i} className="rounded-lg border border-slate-100 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#17171c]">
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Round {h.round}</span>
                    <div className="flex items-center gap-2">
                      {h.applied && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                          <Check className="w-2.5 h-2.5" /> Applied
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{h.time}</span>
                    </div>
                  </div>
                  <p className="px-3 py-2 text-[12px] text-slate-600 dark:text-slate-400">{h.prompt}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tips strip */}
        <div className="mx-3 mb-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex-shrink-0 flex items-start gap-2">
          <Zap className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {['Specify tone', 'Add or remove content', 'Set length', 'Reference SLA'].map(tip => (
              <span key={tip} className="text-[11px] text-amber-700 dark:text-amber-500">{tip}</span>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-3 pb-3 flex-shrink-0">
          <div className="flex gap-2 items-end">
            <textarea
              rows={2}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="Describe revision instructions…"
              className="input-base resize-none leading-relaxed text-[12px]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="w-8 h-8 flex items-center justify-center bg-violet-500 hover:bg-violet-600 disabled:opacity-40 text-white rounded-lg transition-colors flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
