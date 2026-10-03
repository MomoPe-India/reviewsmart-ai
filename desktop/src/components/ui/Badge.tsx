import React from 'react'

type BadgeColor = 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'purple' | 'indigo'

const colorMap: Record<BadgeColor, string> = {
  green: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
  red: 'bg-red-900/50 text-red-300 border-red-700',
  yellow: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  blue: 'bg-blue-900/50 text-blue-300 border-blue-700',
  gray: 'bg-slate-800 text-slate-400 border-slate-600',
  purple: 'bg-purple-900/50 text-purple-300 border-purple-700',
  indigo: 'bg-indigo-900/50 text-indigo-300 border-indigo-700',
}

interface BadgeProps {
  children: React.ReactNode
  color?: BadgeColor
  size?: 'sm' | 'md'
  dot?: boolean
}

export function Badge({ children, color = 'gray', size = 'sm', dot }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${colorMap[color]} ${sizeClass}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${color === 'green' ? 'bg-emerald-400' : color === 'red' ? 'bg-red-400' : color === 'yellow' ? 'bg-yellow-400' : 'bg-slate-400'}`} />}
      {children}
    </span>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color?: BadgeColor
}

export function StatCard({ title, value, subtitle, icon, color = 'indigo' }: StatCardProps) {
  const iconBg: Record<BadgeColor, string> = {
    green: 'bg-emerald-900/50 text-emerald-400',
    red: 'bg-red-900/50 text-red-400',
    yellow: 'bg-yellow-900/50 text-yellow-400',
    blue: 'bg-blue-900/50 text-blue-400',
    gray: 'bg-slate-800 text-slate-400',
    purple: 'bg-purple-900/50 text-purple-400',
    indigo: 'bg-indigo-900/50 text-indigo-400',
  }
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 flex items-start gap-4">
      <div className={`p-3 rounded-lg ${iconBg[color]}`}>{icon}</div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-slate-100 mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}
