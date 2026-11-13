import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-6xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-xl font-semibold">We couldn't find that page</h1>
      <Link to="/" className="mt-6 inline-block font-semibold text-brand hover:underline">
        Go back home
      </Link>
    </div>
  )
}
