import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Alert from '../components/Alert'
import AuthCard from '../components/AuthCard'
import Button from '../components/Button'
import FormInput from '../components/FormInput'
import { ApiError, apiPost, errorMessage, type FieldErrors } from '../lib/api'

export default function ResetPasswordPage() {
  // The link in the email looks like /reset-password?uid=...&token=...
  const [searchParams] = useSearchParams()
  const uid = searchParams.get('uid') || ''
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setSubmitting(true)

    try {
      await apiPost('/accounts/password-reset/confirm/', {
        uid: uid,
        token: token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      })
      setDone(true)
    } catch (err) {
      setError(errorMessage(err))
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors)
      }
    }
    setSubmitting(false)
  }

  if (!uid || !token) {
    return (
      <AuthCard title="Reset password">
        <Alert message="This reset link is missing some details. Please use the link from your email, or ask for a new one." />
        <Link to="/forgot-password" className="mt-6 inline-block text-sm font-semibold text-brand hover:underline">
          Request a new link
        </Link>
      </AuthCard>
    )
  }

  if (done) {
    return (
      <AuthCard title="Password changed">
        <Alert kind="success" message="Your password has been reset. You can now sign in with your new password." />
        <Link to="/signin" className="mt-6 inline-block text-sm font-semibold text-brand hover:underline">
          Go to sign in
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Choose a new password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert message={error} />
        <FormInput label="New password" name="new_password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} errors={fieldErrors.new_password} required autoComplete="new-password" />
        <FormInput label="Confirm new password" name="confirm_password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} errors={fieldErrors.confirm_password} required autoComplete="new-password" />
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Saving...' : 'Reset password'}
        </Button>
      </form>
    </AuthCard>
  )
}
