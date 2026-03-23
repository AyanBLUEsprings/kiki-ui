import clsx from 'clsx'
import {
  LayoutDashboard, Ticket, ShieldAlert,
  Scale, Globe, ChevronLeft,
  Sun, Moon, BarChart2,
} from 'lucide-react'

const NAV_MAIN = [
  { id: 'command',   label: 'Command Center',    icon: LayoutDashboard, badge: 8 },
  { id: 'analytics:overview', label: 'Analytics', icon: BarChart2 },
  { id: 'gdpr',      label: 'GDPR Compliance',    icon: Scale },
]

const NAV_OPERATIONS = [
  { id: 'ticket',    label: 'Ticket Review',      icon: Ticket },
  { id: 'spam',      label: 'Spam Intelligence',  icon: ShieldAlert, badge: 3 },
  { id: 'language',  label: 'Language Hub',       icon: Globe },
]

export default function Sidebar({ active, onNavigate, collapsed, onCollapse, dark, onToggleTheme, session }) {
  const role = session?.role || 'admin'
  const sections = [
    { title: 'Dashboard', items: NAV_MAIN },
    { title: 'Operations', items: NAV_OPERATIONS },
  ].filter((section) => role === 'admin' || section.title === 'Operations')

  return (
    <aside className={clsx(
      'h-screen flex flex-col bg-white dark:bg-[#111116] transition-all duration-200 flex-shrink-0 overflow-hidden',
      collapsed ? 'w-0 border-r-0' : 'w-56 border-r border-slate-100 dark:border-slate-800'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 h-14 px-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">Q</span>
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="min-w-0">
                <div className="text-lg font-bold text-slate-900  tracking-tight leading-tight truncate">Qiki</div>
                <div className="text-[10px] dark:text-white leading-none mt-0.5 uppercase tracking-[0.18em]">AI Ops platform</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!collapsed && (
        <>
          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 min-w-56">
            {sections.map(({ title, items }) => (
              <div key={title}>
                <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  {title}
                </div>
                <div className="space-y-0.5">
                  {items.map(({ id, label, icon: Icon, badge }) => {
                    const isActive = active === id
                    const isSectionActive = id === 'analytics:overview' ? active?.startsWith('analytics') : isActive

                    return (
                      <button
                        key={id}
                        onClick={() => onNavigate(id)}
                        title={collapsed ? label : undefined}
                        className={clsx(
                          'w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-all text-left group',
                          isSectionActive
                            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.03] hover:text-slate-700 dark:hover:text-slate-200'
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <>
                          <span className="flex-1 truncate">{label}</span>
                          {badge && (
                            <span className={clsx(
                              'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                              isSectionActive ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            )}>{badge}</span>
                          )}
                        </>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom */}
          <div className="border-t border-slate-100 dark:border-slate-800 p-2 space-y-0.5 min-w-56">
            <button
              onClick={onToggleTheme}
              title="Toggle theme"
              className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all"
            >
              {dark ? <Sun className="w-4 h-4 flex-shrink-0" /> : <Moon className="w-4 h-4 flex-shrink-0" />}
              <span>{dark ? 'Light mode' : 'Dark mode'}</span>
            </button>
          </div>
        </>
        )}
    </aside>
  )
}
