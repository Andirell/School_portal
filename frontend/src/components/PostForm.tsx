import { useState, type ChangeEvent, type FormEvent } from 'react'
import { ApiError, apiPatch, apiPost, errorMessage, type FieldErrors } from '../lib/api'
import type { Post } from '../lib/types'
import Alert from './Alert'
import Button from './Button'
import FormInput from './FormInput'
import FormSelect from './FormSelect'

type PostFormProps = {
  editingPost: Post | null
  onSaved: () => void
  onCancel: () => void
}

function startingValues(post: Post | null) {
  if (post) {
    return {
      title: post.title,
      body: post.body,
      category: post.category as string,
      event_date: post.event_date || '',
      is_published: post.is_published,
    }
  }
  return { title: '', body: '', category: 'news', event_date: '', is_published: true }
}

export default function PostForm({ editingPost, onSaved, onCancel }: PostFormProps) {
  const [form, setForm] = useState(startingValues(editingPost))
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setSaving(true)

    // An empty date box means "no date"
    const data = { ...form, event_date: form.event_date || null }

    try {
      if (editingPost) {
        await apiPatch('/news/' + editingPost.id + '/edit/', data)
      } else {
        await apiPost('/news/', data)
      }
      onSaved()
    } catch (err) {
      setError(errorMessage(err))
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors)
      }
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-semibold text-slate-900">{editingPost ? 'Edit post' : 'New post'}</h2>
      <Alert message={error} />

      <FormInput label="Title" name="title" value={form.title} onChange={handleChange} errors={fieldErrors.title} required />

      <div>
        <label htmlFor="body" className="mb-1 block text-sm font-medium text-slate-700">
          Body
        </label>
        <textarea
          id="body"
          name="body"
          rows={6}
          value={form.body}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
        {fieldErrors.body && <p className="mt-1 text-xs text-red-600">{fieldErrors.body.join(' ')}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormSelect label="Category" name="category" value={form.category} onChange={handleChange} errors={fieldErrors.category}>
          <option value="news">News</option>
          <option value="event">Event</option>
        </FormSelect>
        <FormInput label="Event date" name="event_date" type="date" value={form.event_date} onChange={handleChange} errors={fieldErrors.event_date} required={form.category === 'event'} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(event) => setForm({ ...form, is_published: event.target.checked })}
          className="h-4 w-4"
        />
        Publish now (otherwise it's saved as a draft)
      </label>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : editingPost ? 'Save changes' : 'Create post'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
