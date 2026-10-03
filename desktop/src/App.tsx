import React, { useState, useEffect } from 'react'
import { Screen, Merchant } from '@/lib/types'
import { API } from '@/lib/api'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { ToastContainer, useToast } from '@/components/ui/Toast'

// Screens
import { Dashboard } from '@/screens/Dashboard'
import { Merchants } from '@/screens/Merchants'
import { MerchantEditor } from '@/screens/MerchantEditor'
import { Agents } from '@/screens/Agents'
import { Payments } from '@/screens/Payments'
import { Settings } from '@/screens/Settings'

export function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard')
  const [editorContext, setEditorContext] = useState<{ merchantId?: string; merchant?: Merchant } | null>(null)
  const [pendingPaymentCount, setPendingPaymentCount] = useState<number>(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const { toasts, toast, dismiss } = useToast()

  const fetchBadgeCounts = async () => {
    try {
      const res = await API.getDashboardStats()
      if (res.success && res.stats) {
        setPendingPaymentCount(res.stats.pendingPaymentCount || 0)
      }
    } catch {
      // Ignore background badge error
    }
  }

  useEffect(() => {
    fetchBadgeCounts()
    // Poll badge counts every 30 seconds
    const interval = setInterval(fetchBadgeCounts, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleNavigate = (screen: Screen, context?: any) => {
    if (screen === 'merchant-editor') {
      setEditorContext(context || null)
    } else {
      setEditorContext(null)
    }
    setCurrentScreen(screen)
  }

  const handleGlobalRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchBadgeCounts()
      setRefreshKey((prev) => prev + 1)
      toast.success('Live database synchronized!')
    } catch (err: any) {
      toast.error(err.message || 'Sync failed')
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* Persistent Left Sidebar */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        pendingPaymentCount={pendingPaymentCount}
        onRefresh={handleGlobalRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onRefresh={handleGlobalRefresh}
          isRefreshing={isRefreshing}
          selectedMerchantName={editorContext?.merchant?.businesses?.[0]?.name || editorContext?.merchant?.name}
        />

        <main className="flex-1 overflow-y-auto bg-slate-950">
          {currentScreen === 'dashboard' && (
            <Dashboard key={refreshKey} onNavigate={handleNavigate} showToast={(type, msg) => toast[type](msg)} />
          )}

          {currentScreen === 'merchants' && (
            <Merchants key={refreshKey} onNavigate={handleNavigate} showToast={(type, msg) => toast[type](msg)} />
          )}

          {currentScreen === 'merchant-editor' && (
            <MerchantEditor
              key={refreshKey}
              merchantId={editorContext?.merchantId}
              initialMerchant={editorContext?.merchant}
              onNavigate={handleNavigate}
              showToast={(type, msg) => toast[type](msg)}
            />
          )}

          {currentScreen === 'agents' && (
            <Agents key={refreshKey} showToast={(type, msg) => toast[type](msg)} />
          )}

          {currentScreen === 'payments' && (
            <Payments key={refreshKey} showToast={(type, msg) => toast[type](msg)} />
          )}

          {currentScreen === 'settings' && (
            <Settings key={refreshKey} showToast={(type, msg) => toast[type](msg)} />
          )}
        </main>
      </div>
    </div>
  )
}
export default App
