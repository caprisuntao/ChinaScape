'use client'
import Link from 'next/link'

/**
 * Shared shell for the auth pages (login / register / forgot-password /
 * reset-password): brand panel + form column + card + alerts + fields.
 * Keeps the four pages visually identical and fixes apply in one place.
 */
export default function AuthShell({ headline, sub, children }) {
  return (
    <div className="grid md:grid-cols-2">
      {/* Brand panel — desktop only */}
      <div className="hidden md:flex flex-col justify-between bg-red px-10 md:px-12 py-10 md:py-12 text-white">
        <Link href="/" className="font-display text-xl font-bold">
          ChinaScape <span className="text-[13px] text-white/70 font-body font-normal">中国旅游</span>
        </Link>
        <div>
          <h2 className="font-display text-[30px] font-bold leading-[1.2]">{headline}</h2>
          <p className="mt-3 text-sm text-white/85 leading-relaxed max-w-[380px]">{sub}</p>
        </div>
        <div className="text-[11px] text-white/70">ChinaScape · 中国旅游</div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-5 py-12 md:py-16">{children}</div>
    </div>
  )
}

export function AuthCard({ children }) {
  return <div className="bg-white border border-paper-dkr rounded-card p-8 shadow-subtle">{children}</div>
}

export function AuthAlert({ type = 'error', children }) {
  return (
    <div
      role="alert"
      className={`rounded-thumb px-3.5 py-2.5 text-[13px] mb-4 ${type === 'error' ? 'bg-red-xlt border border-red-lt text-red' : 'bg-green-lt border border-green-dk/30 text-green-dk'}`}
    >
      {children}
    </div>
  )
}

export function AuthField({ id, label, type = 'text', value, onChange, placeholder, autoComplete, error }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="text-xs font-semibold text-ink-md block mb-1">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full px-3.5 py-2.5 border border-paper-dkr rounded-thumb text-sm outline-none focus:border-red focus-visible:ring-2 focus-visible:ring-red/40 transition-colors"
      />
      {error && <p id={`${id}-error`} className="text-xs text-red mt-1">{error}</p>}
    </div>
  )
}

export function validateEmail(email) {
  if (!email.trim()) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.'
  return ''
}
