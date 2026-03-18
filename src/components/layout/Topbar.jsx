import { Bell, Search, ChevronDown, PanelLeftOpen, PanelLeftClose, Layers3, Mail, PhoneCall, MessageSquareText, FileText } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

const PAGE_TITLES = {
  command:              { title: 'Command Center',    sub: 'Overview & live metrics' },
  ticket:               { title: 'Ticket Review',     sub: 'Manage and approve AI drafts' },
  studio:               { title: 'AI Revision Studio', sub: 'Refine responses with AI' },
  spam:                 { title: 'Spam Intelligence', sub: 'Blocked threats & patterns' },
  gdpr:                 { title: 'GDPR Compliance',   sub: 'Data requests & privacy policies' },
  language:             { title: 'Language Hub',      sub: 'Translation quality & coverage' },
  'analytics:overview':   { title: 'Analytics', sub: 'Overview / executive KPIs and performance' },
  'analytics:volume':     { title: 'Analytics', sub: 'Volume / ticket demand and throughput' },
  'analytics:latency':    { title: 'Analytics', sub: 'Response Time / percentile latency and tails' },
  'analytics:tokens':     { title: 'Analytics', sub: 'Tokens / usage and consumption' },
  'analytics:resolution': { title: 'Analytics', sub: 'Resolution Types / ticket outcome mix' },
  'analytics:revisions':  { title: 'Analytics', sub: 'Revisions / human rework hotspots' },
  'analytics:pii':        { title: 'Analytics', sub: 'PII Detection / masked sensitive entities' },
}

const CHANNEL_OPTIONS = ['All channels', 'Email', 'Voice', 'Chat', 'Webforms']
const CHANNEL_META = {
  'All channels': { icon: Layers3, short: 'All' },
  Email: { icon: Mail, short: 'Email' },
  Voice: { icon: PhoneCall, short: 'Voice' },
  Chat: { icon: MessageSquareText, short: 'Chat' },
  Webforms: { icon: FileText, short: 'Forms' },
}
const PROFILE_ACTIONS = [
  { id: 'status', label: 'Status: Online' },
  { id: 'workspace', label: 'Workspace settings' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'notifications', label: 'Notification rules' },
  { id: 'signout', label: 'Sign out' },
]
const INITIAL_NOTIFICATIONS = [
  { id: 'n1', title: 'Voice queue spike', body: '12 new voice tickets arrived in the last 10 minutes.', time: '2m ago', unread: true },
  { id: 'n2', title: 'Refund review pending', body: 'Webform refund #10481 is waiting for approval.', time: '8m ago', unread: true },
  { id: 'n3', title: 'Spam threshold updated', body: 'Spam Intelligence raised the phishing threshold for email.', time: '21m ago', unread: false },
]

function ChannelSwitcher({ value, onSelect }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900/45">
      <div className="hidden xl:flex items-center gap-2 px-1">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <Layers3 className="h-3.5 w-3.5" />
        </div>
        <div className="w-24">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Channel</div>
          <div className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">{value}</div>
        </div>
      </div>
      <div className="hidden xl:block h-8 w-px bg-slate-200 dark:bg-slate-700" />
      <div className="flex items-center gap-1">
        {CHANNEL_OPTIONS.map((option) => {
          const meta = CHANNEL_META[option]
          const Icon = meta.icon
          const isActive = value === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={clsx(
                'inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all',
                isActive
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-500/10 dark:text-indigo-300'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden 2xl:inline whitespace-nowrap">{meta.short}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Topbar({ page, collapsed, onToggleSidebar, workspaceScope, onWorkspaceScopeChange }) {
  const { title, sub } = PAGE_TITLES[page] || {}
  const [search, setSearch] = useState('')
  const [openMenu, setOpenMenu] = useState(null)
  const [profileMessage, setProfileMessage] = useState('')
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const rootRef = useRef(null)

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpenMenu(null)
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  useEffect(() => {
    if (!profileMessage) return undefined
    const timeoutId = window.setTimeout(() => setProfileMessage(''), 1800)
    return () => window.clearTimeout(timeoutId)
  }, [profileMessage])

  const unreadCount = notifications.filter((item) => item.unread).length

  return (
    <header ref={rootRef} className="h-16 bg-white dark:bg-[#111116] border-b border-slate-100 dark:border-slate-800 flex items-center px-6 gap-4 flex-shrink-0">
      <button
        onClick={onToggleSidebar}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex-shrink-0"
      >
        {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-none mt-0.5">{sub}</p>
      </div>

      <div className="hidden lg:flex items-center gap-3 pr-1">
        <ChannelSwitcher
          value={workspaceScope.channel}
          onSelect={(value) => onWorkspaceScopeChange('channel', value)}
        />
      </div>

      <div className="relative hidden xl:block">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tickets…"
          className="pl-8 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl w-40 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all"
        />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setOpenMenu((current) => current === 'notifications' ? null : 'notifications')
            setNotifications((items) => items.map((item) => ({ ...item, unread: false })))
          }}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
        <Bell className="w-4 h-4" />
          {unreadCount > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
        </button>

        {openMenu === 'notifications' && (
          <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-100">Notifications</div>
                <div className="text-xs text-slate-400 dark:text-slate-500">{notifications.length} recent updates</div>
              </div>
              <button
                type="button"
                onClick={() => setNotifications([])}
                className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                Clear all
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length ? notifications.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setNotifications((items) => items.filter((entry) => entry.id !== item.id))}
                  className="block w-full border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:border-slate-800/80 dark:hover:bg-slate-800/70"
                >
                  <div className="flex items-start gap-3">
                    <span className={clsx('mt-1 h-2 w-2 rounded-full flex-shrink-0', item.unread ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700')} />
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.title}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.body}</p>
                    </div>
                  </div>
                </button>
              )) : (
                <div className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">No new notifications</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu((current) => current === 'profile' ? null : 'profile')}
          className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-800/80 transition-all"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-[10px] text-white font-semibold">SR</div>
          <span className="text-xs text-slate-600 dark:text-slate-300 font-medium hidden sm:block">Sara R.</span>
          <ChevronDown className={clsx('w-3 h-3 text-slate-400 hidden sm:block transition-transform', openMenu === 'profile' && 'rotate-180')} />
        </button>

        {openMenu === 'profile' && (
          <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-xs text-white font-semibold">SR</div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100">Sara R.</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">Support lead · kiki ops</div>
                </div>
              </div>
            </div>
            <div className="p-2">
              {PROFILE_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => {
                    setProfileMessage(`${action.label} selected`)
                    setOpenMenu(null)
                  }}
                  className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {profileMessage && (
          <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 mt-14 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-600 shadow-sm dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
            {profileMessage}
          </div>
        )}
      </div>
    </header>
  )
}
