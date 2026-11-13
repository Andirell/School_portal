import { useEffect, useState } from 'react'
import Alert from '../components/Alert'
import Loading from '../components/Loading'
import PageHeader from '../components/PageHeader'
import PostCard from '../components/PostCard'
import { apiGet, errorMessage } from '../lib/api'
import type { Post } from '../lib/types'

type Filter = '' | 'news' | 'event'

const filters: { value: Filter; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'news', label: 'News' },
  { value: 'event', label: 'Events' },
]

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [category, setCategory] = useState<Filter>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let path = '/news/'
    if (category) {
      path = path + '?category=' + category
    }

    apiGet<Post[]>(path)
      .then((data) => {
        setPosts(data)
        setError('')
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [category])

  function changeCategory(value: Filter) {
    if (value === category) {
      return
    }
    setLoading(true)
    setCategory(value)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader title="News & Events" subtitle="Updates, celebrations and dates for your diary." />

      <div className="mb-6 flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => changeCategory(filter.value)}
            className={
              'rounded-full px-4 py-1.5 text-sm font-medium ' +
              (category === filter.value ? 'bg-brand text-white' : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100')
            }
          >
            {filter.label}
          </button>
        ))}
      </div>

      <Alert message={error} />
      {loading && <Loading />}
      {!loading && !error && posts.length === 0 && <p className="text-sm text-slate-500">Nothing here yet.</p>}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
