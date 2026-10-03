import React from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-600',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600',
  danger: 'bg-red-600 hover:bg-red-500 text-white border-red-600',
  ghost: 'bg-transparent hover:bg-slate-700 text-slate-300 border-slate-600',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-2.5 py-1.5 gap-1',
  md: 'text-sm px-3.5 py-2 gap-1.5',
  lg: 'text-base px-5 py-2.5 gap-2',
}

export function Button({ variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children && <span>{children}</span>}
    </button>
  )
}
