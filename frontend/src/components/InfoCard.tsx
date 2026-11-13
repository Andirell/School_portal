type InfoCardProps = {
  title: string
  text: string
}

export default function InfoCard({ title, text }: InfoCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 h-1 w-10 rounded bg-accent" />
      <h3 className="mb-2 font-semibold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{text}</p>
    </div>
  )
}
