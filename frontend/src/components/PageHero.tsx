type PageHeroProps = {
  title: string
  subtitle: string
}

// The coloured banner at the top of the information pages
export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="bg-gradient-to-br from-brand-dark to-brand text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-slate-200">{subtitle}</p>
      </div>
    </section>
  )
}
