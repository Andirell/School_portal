import { Link } from 'react-router-dom'
import { formatDate } from '../lib/format'
import type { Post } from '../lib/types'

export default function PostCard({ post }: { post: Post }) {
  const isEvent = post.category === 'event'

  let preview = post.body
  if (preview.length > 140) {
    preview = preview.slice(0, 140) + '...'
  }

  return (
    <Link
      to={'/news/' + post.id}
      className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-2 text-xs">
        <span
          className={
            'rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide ' +
            (isEvent ? 'bg-accent/20 text-amber-800' : 'bg-brand-light text-brand')
          }
        >
          {post.category}
        </span>
        <span className="text-slate-500">{formatDate(post.created_at)}</span>
      </div>
      <h3 className="mb-2 font-semibold text-slate-900">{post.title}</h3>
      <p className="flex-1 text-sm text-slate-600">{preview}</p>
      {isEvent && post.event_date && (
        <p className="mt-3 text-sm font-medium text-brand">Happening on {formatDate(post.event_date)}</p>
      )}
    </Link>
  )
}
