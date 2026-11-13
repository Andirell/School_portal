import { Link } from 'react-router-dom'

type CallToActionProps = {
  title: string
  text: string
  buttonText: string
  buttonLink: string
}

export default function CallToAction({ title, text, buttonText, buttonLink }: CallToActionProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-brand p-8 text-white sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="mt-2 text-slate-200">{text}</p>
        </div>
        <Link to={buttonLink} className="shrink-0 rounded-md bg-accent px-5 py-3 font-semibold text-brand-dark hover:brightness-95">
          {buttonText}
        </Link>
      </div>
    </section>
  )
}
