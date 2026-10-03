import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  rightElement?: React.ReactNode
}

export function Input({ label, error, hint, icon, rightElement, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input
          {...props}
          className={`w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm
            placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors
            ${icon ? 'pl-9' : ''} ${rightElement ? 'pr-9' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
        />
        {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{rightElement}</div>}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>}
      <textarea
        {...props}
        className={`w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm
          placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-none
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
}

export function Select({ label, error, hint, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>}
      <select
        {...props}
        className={`w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm
          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors
          ${error ? 'border-red-500' : ''} ${className}`}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
