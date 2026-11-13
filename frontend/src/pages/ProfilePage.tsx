import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import Button from '../components/Button'
import Card from '../components/Card'
import FormInput from '../components/FormInput'
import PageHeader from '../components/PageHeader'
import { ApiError, apiDelete, apiPatch, errorMessage, type FieldErrors } from '../lib/api'
import { formatDate } from '../lib/format'
import { clearTokens } from '../lib/tokens'
import type { User } from '../lib/types'
import { useAuth } from '../lib/useAuth'

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone_number: user?.phone_number || '',
    nationality: user?.nationality || '',
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  if (user === null) {
    return null
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    setFieldErrors({})
    setSaving(true)

    try {
      const updated = await apiPatch<User>('/accounts/me/update/', { ...form, phone_number: form.phone_number || null })
      setUser(updated)
      setMessage('Your profile has been updated.')
    } catch (err) {
      setError(errorMessage(err))
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors)
      }
    }
    setSaving(false)
  }

  async function handleDelete() {
    try {
      await apiDelete('/accounts/me/delete/')
      clearTokens()
      setUser(null)
      navigate('/')
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader title="My profile" subtitle={'Member since ' + formatDate(user.created_at)} />

      <Card>
        <dl className="mb-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Role</dt>
            <dd className="font-medium capitalize">{user.role}</dd>
          </div>
        </dl>

        <form onSubmit={handleSave} className="space-y-4">
          <Alert message={error} />
          <Alert message={message} kind="success" />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="First name" name="first_name" value={form.first_name} onChange={handleChange} errors={fieldErrors.first_name} required />
            <FormInput label="Last name" name="last_name" value={form.last_name} onChange={handleChange} errors={fieldErrors.last_name} required />
            <FormInput label="Phone" name="phone_number" value={form.phone_number} onChange={handleChange} errors={fieldErrors.phone_number} />
            <FormInput label="Nationality" name="nationality" value={form.nationality} onChange={handleChange} errors={fieldErrors.nationality} />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </Card>

      <Card className="mt-6 border-red-200">
        <h2 className="font-semibold text-red-700">Delete account</h2>
        <p className="mt-1 text-sm text-slate-600">This removes your account for good. It can't be undone.</p>
        {!confirmingDelete && (
          <Button variant="danger" className="mt-4" onClick={() => setConfirmingDelete(true)}>
            Delete my account
          </Button>
        )}
        {confirmingDelete && (
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="danger" onClick={handleDelete}>
              Yes, delete it
            </Button>
            <Button variant="secondary" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
