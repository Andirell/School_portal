import type { ReactNode } from 'react'

type AuthCardProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

// The centred box used by sign in, sign up and the password pages
export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="flex justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-brand">{title}</h1>
        {subtitle && <p className="mt-1 mb-6 text-sm text-slate-500">{subtitle}</p>}
        {!subtitle && <div className="mb-6" />}
        {children}
      </div>
    </div>
  )
}
