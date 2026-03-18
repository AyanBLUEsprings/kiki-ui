import { useState } from 'react'
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

export default function App() {
  const [page, setPage] = useState('command')
  const [collapsed, setCollapsed] = useState(false)
  const [studioOpen, setStudioOpen] = useState(false)
  const [analyticsFilters, setAnalyticsFilters] = useState(DEFAULT_ANALYTICS_FILTERS)
  const [workspaceScope, setWorkspaceScope] = useState(DEFAULT_WORKSPACE_SCOPE)
  const { dark, toggle } = useTheme()

  const Page = PAGES[page] || CommandCenter
  const isFullHeight = FULL_HEIGHT_PAGES.has(page)

  const handleNavigate = (id) => {
    if (id === 'studio') {
      setStudioOpen(true)
    } else {
      setPage(id)
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

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0d0d10]">
      <Sidebar
        active={page}
        onNavigate={handleNavigate}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(c => !c)}
        dark={dark}
        onToggleTheme={toggle}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar
          page={page}
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(c => !c)}
          workspaceScope={workspaceScope}
          onWorkspaceScopeChange={handleWorkspaceScopeChange}
        />
        <main className={isFullHeight ? 'flex-1 overflow-hidden' : 'flex-1 overflow-y-auto'}>
          <Page
            onOpenStudio={() => setStudioOpen(true)}
            onNavigate={handleNavigate}
            page={page}
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
