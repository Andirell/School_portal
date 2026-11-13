import { useEffect, useState } from 'react'
import { apiDelete, apiGet, apiPatch, errorMessage } from '../lib/api'
import { formatDate } from '../lib/format'
import type { Post } from '../lib/types'
import Alert from './Alert'
import Button from './Button'
import Card from './Card'
import Loading from './Loading'
import PostForm from './PostForm'

export default function NewsManager() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    apiGet<Post[]>('/news/all/')
      .then((data) => setPosts(data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [reloadCount])

  function reload() {
    setReloadCount(reloadCount + 1)
  }

  function openNewPost() {
    setEditingPost(null)
    setShowForm(true)
  }

  function openEditPost(post: Post) {
    setEditingPost(post)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingPost(null)
  }

  function handleSaved() {
    closeForm()
    reload()
  }

  async function togglePublished(post: Post) {
    try {
      await apiPatch('/news/' + post.id + '/edit/', { is_published: !post.is_published })
      reload()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  async function deletePost(postId: number) {
    try {
      await apiDelete('/news/' + postId + '/edit/')
      setDeletingId(null)
      reload()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <div className="space-y-6">
      <Alert message={error} />

      {showForm ? (
        <Card>
          <PostForm key={editingPost ? editingPost.id : 'new'} editingPost={editingPost} onSaved={handleSaved} onCancel={closeForm} />
        </Card>
      ) : (
        <Button onClick={openNewPost}>New post</Button>
      )}

      {loading && <Loading />}
      {!loading && posts.length === 0 && <p className="text-sm text-slate-500">No posts yet.</p>}

      <div className="space-y-3">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold uppercase text-slate-500">{post.category}</span>
                <span
                  className={
                    'rounded-full px-2 py-0.5 font-semibold ' +
                    (post.is_published ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600')
                  }
                >
                  {post.is_published ? 'Published' : 'Draft'}
                </span>
                <span className="text-slate-500">{formatDate(post.created_at)}</span>
              </div>
              <p className="mt-1 font-medium text-slate-900">{post.title}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {deletingId === post.id ? (
                <>
                  <Button variant="danger" onClick={() => deletePost(post.id)}>
                    Confirm delete
                  </Button>
                  <Button variant="secondary" onClick={() => setDeletingId(null)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" onClick={() => togglePublished(post)}>
                    {post.is_published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button variant="secondary" onClick={() => openEditPost(post)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => setDeletingId(post.id)}>
                    Delete
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
