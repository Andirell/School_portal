import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Alert from '../components/Alert'
import Loading from '../components/Loading'
import { apiGet, errorMessage } from '../lib/api'
import { formatDate } from '../lib/format'
import type { Post } from '../lib/types'

export default function NewsDetailPage() {
  const { postId } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet<Post>('/news/' + postId + '/')
      .then((data) => setPost(data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [postId])

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/news" className="text-sm font-medium text-brand hover:underline">
        ← Back to news
      </Link>

      {loading && <Loading />}
      <div className="mt-4">
        <Alert message={error} />
      </div>

      {post && (
        <article className="mt-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {post.category} · {formatDate(post.created_at)}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-brand">{post.title}</h1>
          {post.event_date && (
            <p className="mt-3 inline-block rounded-md bg-accent/20 px-3 py-1 text-sm font-medium text-amber-800">
              Event date: {formatDate(post.event_date)}
            </p>
          )}
          <div className="mt-6 whitespace-pre-line leading-relaxed text-slate-700">{post.body}</div>
        </article>
      )}
    </div>
  )
}
