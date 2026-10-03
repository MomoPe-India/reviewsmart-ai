import React from 'react'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Screen } from '@/lib/types'

interface TopBarProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
  onRefresh?: () => void
  isRefreshing?: boolean
  selectedMerchantName?: string
}

export function TopBar({
  currentScreen,
  onNavigate,
  onRefresh,
  isRefreshing,
  selectedMerchantName,
}: TopBarProps) {
  const titles: Record<Screen, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Console Overview',
      subtitle: 'Real-time platform metrics and recent transactions',
    },
    merchants: {
      title: 'Merchant Directory',
      subtitle: 'Manage local businesses, AI review prompts, chips & QR modes',
    },
    'merchant-editor': {
      title: selectedMerchantName ? `Editing: ${selectedMerchantName}` : 'Add New Merchant',
      subtitle: 'Configure business profile, Google Place ID, AI chips, and branding',
    },
    agents: {
      title: 'Marketing Agents',
      subtitle: 'Track field agents, commission splits, PINs & closed deals',
    },
    payments: {
      title: 'Payments & UTR Approvals',
      subtitle: 'Verify UPI payments, activate cards, and trigger commissions',
    },
    settings: {
      title: 'Platform Settings',
      subtitle: 'Global platform configuration, UPI payee details & pricing floors',
    },
  }

  const { title, subtitle } = titles[currentScreen] || {
    title: 'ReviewSmart Admin',
    subtitle: '',
  }

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 flex items-center justify-between select-none">
      <div className="flex items-center gap-3">
        {currentScreen === 'merchant-editor' && (
          <button
            onClick={() => onNavigate('merchants')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Merchants"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div>
          <h2 className="text-base font-semibold text-slate-100">{title}</h2>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-indigo-400' : ''} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Live DB'}</span>
          </button>
        )}
      </div>
    </header>
  )
}
