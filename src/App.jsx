import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/layout/Sidebar.jsx'
import Topbar from './components/layout/Topbar.jsx'
import CommandCenter from './pages/CommandCenter.jsx'
import TicketReview from './pages/TicketReview.jsx'
import AIStudio from './pages/AIStudio.jsx'
import SpamIntelligence from './pages/SpamIntelligence.jsx'
import GDPRCompliance from './pages/GDPRCompliance.jsx'
import LanguageHub from './pages/LanguageHub.jsx'
import AnalyticsOverview from './pages/analytics/AnalyticsOverview.jsx'
import Volume from './pages/analytics/Volume.jsx'
import Latency from './pages/analytics/Latency.jsx'
import Tokens from './pages/analytics/Tokens.jsx'
import ResolutionTypes from './pages/analytics/ResolutionTypes.jsx'
import Revisions from './pages/analytics/Revisions.jsx'
import PII from './pages/analytics/PII.jsx'
import { useTheme } from './hooks/useTheme.js'
import Auth from './pages/Auth.jsx'

const DEFAULT_ANALYTICS_FILTERS = {
  range: 'Last 7 days',
  channel: 'All channels',
  language: 'All languages',
}

const DEFAULT_WORKSPACE_SCOPE = {
  channel: 'All channels',
}

const PAGES = {
  command:              CommandCenter,
  ticket:               TicketReview,
  spam:                 SpamIntelligence,
  gdpr:                 GDPRCompliance,
  language:             LanguageHub,
  'analytics:overview':   AnalyticsOverview,
  'analytics:volume':     Volume,
  'analytics:latency':    Latency,
  'analytics:tokens':     Tokens,
  'analytics:resolution': ResolutionTypes,
  'analytics:revisions':  Revisions,
  'analytics:pii':        PII,
}

const FULL_HEIGHT_PAGES = new Set(['ticket', 'language'])

const DEFAULT_AUTH_ROUTE = '/login'
const DEFAULT_APP_ROUTE = '/app/command'

const PAGE_TO_ROUTE = {
  command: '/app/command',
  ticket: '/app/ticket',
  spam: '/app/spam',
  gdpr: '/app/gdpr',
  language: '/app/language',
  'analytics:overview': '/app/analytics/overview',
  'analytics:volume': '/app/analytics/volume',
  'analytics:latency': '/app/analytics/latency',
  'analytics:tokens': '/app/analytics/tokens',
  'analytics:resolution': '/app/analytics/resolution',
  'analytics:revisions': '/app/analytics/revisions',
  'analytics:pii': '/app/analytics/pii',
}

const ROLE_ALLOWED_PAGES = {
  admin: Object.keys(PAGE_TO_ROUTE),
  agent: ['ticket', 'spam', 'language'],
}

const ROUTE_TO_PAGE = Object.fromEntries(
  Object.entries(PAGE_TO_ROUTE).map(([pageId, route]) => [route, pageId])
)

function getHashRoute() {
  const rawHash = window.location.hash.replace(/^#/, '')
  return rawHash || DEFAULT_AUTH_ROUTE
}

function navigateTo(route, setRoute, replace = false) {
  const nextHash = `#${route}`
  if (replace) {
    window.history.replaceState(null, '', nextHash)
  } else {
    window.history.pushState(null, '', nextHash)
  }
  setRoute(route)
}

export default function App() {
  const [route, setRoute] = useState(() => getHashRoute())
  const [session, setSession] = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const [studioOpen, setStudioOpen] = useState(false)
  const [analyticsFilters, setAnalyticsFilters] = useState(DEFAULT_ANALYTICS_FILTERS)
  const [workspaceScope, setWorkspaceScope] = useState(DEFAULT_WORKSPACE_SCOPE)
  const { dark, toggle } = useTheme()

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getHashRoute())
    }

    window.addEventListener('hashchange', handleHashChange)
    if (!window.location.hash) navigateTo(DEFAULT_AUTH_ROUTE, setRoute, true)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const authMode = route === '/signup' ? 'signup' : 'signin'
  const page = useMemo(() => {
    if (!route.startsWith('/app')) return 'command'
    return ROUTE_TO_PAGE[route] || 'command'
  }, [route])

  const Page = PAGES[page] || CommandCenter
  const isFullHeight = FULL_HEIGHT_PAGES.has(page)
  const allowedPages = ROLE_ALLOWED_PAGES[session?.role || 'admin'] || ROLE_ALLOWED_PAGES.admin
  const effectivePage = allowedPages.includes(page) ? page : allowedPages[0]
  const EffectiveComponent = PAGES[effectivePage] || CommandCenter
  const isEffectiveFullHeight = FULL_HEIGHT_PAGES.has(effectivePage)

  useEffect(() => {
    if (!session) return
    if (!route.startsWith('/app')) navigateTo(PAGE_TO_ROUTE.command, setRoute, true)
  }, [route, session])

  useEffect(() => {
    if (!session) return
    if (!allowedPages.includes(page)) {
      navigateTo(PAGE_TO_ROUTE[allowedPages[0]] || DEFAULT_APP_ROUTE, setRoute, true)
    }
  }, [allowedPages, page, session])

  const handleNavigate = (id) => {
    if (id === 'studio') {
      setStudioOpen(true)
    } else {
      navigateTo(PAGE_TO_ROUTE[id] || DEFAULT_APP_ROUTE, setRoute)
    }
  }

  const handleAnalyticsFilterChange = (key, value) => {
    setAnalyticsFilters((current) => ({ ...current, [key]: value }))
  }

  const handleAnalyticsFilterReset = () => {
    setAnalyticsFilters(DEFAULT_ANALYTICS_FILTERS)
  }

  const handleWorkspaceScopeChange = (key, value) => {
    setWorkspaceScope((current) => ({ ...current, [key]: value }))
  }

  if (!session) {
    return (
      <Auth
        mode={authMode}
        onModeChange={(mode) => navigateTo(mode === 'signup' ? '/signup' : '/login', setRoute)}
        onAuthenticate={(user) => {
          setSession(user)
          navigateTo(PAGE_TO_ROUTE.command, setRoute)
        }}
      />
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0d0d10]">
      <Sidebar
        active={effectivePage}
        onNavigate={handleNavigate}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(c => !c)}
        dark={dark}
        onToggleTheme={toggle}
        session={session}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar
          page={effectivePage}
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(c => !c)}
          workspaceScope={workspaceScope}
          onWorkspaceScopeChange={handleWorkspaceScopeChange}
          session={session}
          onSignOut={() => {
            setSession(null)
            navigateTo(DEFAULT_AUTH_ROUTE, setRoute)
          }}
        />
        <main className={isEffectiveFullHeight ? 'flex-1 overflow-hidden' : 'flex-1 overflow-y-auto'}>
          <EffectiveComponent
            onOpenStudio={() => setStudioOpen(true)}
            onNavigate={handleNavigate}
            page={effectivePage}
            workspaceScope={workspaceScope}
            analyticsFilters={analyticsFilters}
            onAnalyticsFilterChange={handleAnalyticsFilterChange}
            onAnalyticsFilterReset={handleAnalyticsFilterReset}
          />
        </main>
      </div>
      {studioOpen && <AIStudio onClose={() => setStudioOpen(false)} />}
    </div>
  )
}
