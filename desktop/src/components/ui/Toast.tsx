import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { ToastMessage } from '@/lib/types'

interface ToastProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function Toast({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(toast.id), 300)
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const config = {
    success: { icon: <CheckCircle size={16} />, bg: 'bg-emerald-900/90 border-emerald-700', text: 'text-emerald-200' },
    error: { icon: <XCircle size={16} />, bg: 'bg-red-900/90 border-red-700', text: 'text-red-200' },
    info: { icon: <Info size={16} />, bg: 'bg-indigo-900/90 border-indigo-700', text: 'text-indigo-200' },
  }[toast.type]

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-lg border shadow-xl backdrop-blur-sm transition-all duration-300 ${config.bg} ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
      <span className={config.text}>{config.icon}</span>
      <p className={`text-sm flex-1 ${config.text}`}>{toast.message}</p>
      <button onClick={() => onDismiss(toast.id)} className="text-slate-400 hover:text-slate-100 transition-colors">
        <X size={14} />
      </button>
    </div>
  )
}

// Hook to manage toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const toast = {
    success: (message: string) => {
      const id = Math.random().toString(36).slice(2)
      setToasts(prev => [...prev, { id, type: 'success', message }])
    },
    error: (message: string) => {
      const id = Math.random().toString(36).slice(2)
      setToasts(prev => [...prev, { id, type: 'error', message }])
    },
    info: (message: string) => {
      const id = Math.random().toString(36).slice(2)
      setToasts(prev => [...prev, { id, type: 'info', message }])
    },
  }

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  return { toasts, toast, dismiss }
}
