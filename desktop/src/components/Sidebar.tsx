import React from 'react'
import {
  LayoutDashboard,
  Store,
  Users,
  CreditCard,
  Settings,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'
import { Screen } from '@/lib/types'
import { API } from '@/lib/api'

interface SidebarProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
  pendingPaymentCount?: number
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function Sidebar({
  currentScreen,
  onNavigate,
  pendingPaymentCount = 0,
  onRefresh,
  isRefreshing,
}: SidebarProps) {
  const navItems: { screen: Screen; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      screen: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      screen: 'merchants',
      label: 'Merchants & Businesses',
      icon: <Store size={18} />,
    },
    {
      screen: 'agents',
      label: 'Marketing Agents',
      icon: <Users size={18} />,
    },
    {
      screen: 'payments',
      label: 'Payments & UTR',
      icon: <CreditCard size={18} />,
      badge: pendingPaymentCount > 0 ? pendingPaymentCount : undefined,
    },
    {
      screen: 'settings',
      label: 'Platform Settings',
      icon: <Settings size={18} />,
    },
  ]

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between select-none">
      {/* Top Header / Branding */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">ReviewSmart</h1>
              <p className="text-xs text-indigo-400 font-medium">Desktop Console</p>
            </div>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh database data"
              disabled={isRefreshing}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-indigo-400' : ''} />
            </button>
          )}
        </div>

        {/* Live sync banner */}
        <div className="mx-3 mt-3 px-3 py-2 bg-emerald-950/40 border border-emerald-800/50 rounded-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-emerald-300">Live Supabase Sync</p>
            <p className="text-[10px] text-emerald-400/70 truncate">Direct Cloud PostgreSQL</p>
          </div>
          <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
        </div>

        {/* Nav Links */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const isActive =
              currentScreen === item.screen ||
              (currentScreen === 'merchant-editor' && item.screen === 'merchants')
            return (
              <button
                key={item.screen}
                onClick={() => onNavigate(item.screen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-xs font-bold rounded-full ${
                      isActive ? 'bg-white text-indigo-700' : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Footer Info & External Link to Live Site */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={() => API.openExternal('https://www.reviewsmart.online')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            reviewsmart.online
          </span>
          <ExternalLink size={12} />
        </button>
        <div className="px-3 py-1 flex items-center justify-between text-[10px] text-slate-500">
          <span>v1.0.0 Standalone</span>
          <span className="font-mono">Mac & Win</span>
        </div>
      </div>
    </aside>
  )
}
