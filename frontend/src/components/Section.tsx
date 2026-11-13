import type { ReactNode } from 'react'

type SectionProps = {
  title: string
  intro?: string
  children: ReactNode
  shaded?: boolean
}

export default function Section({ title, intro, children, shaded = false }: SectionProps) {
  return (
    <section className={shaded ? 'bg-brand-light' : ''}>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-brand sm:text-3xl">{title}</h2>
        {intro && <p className="mt-2 max-w-2xl text-slate-600">{intro}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}
