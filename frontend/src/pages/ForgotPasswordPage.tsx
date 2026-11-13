import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert'
import AuthCard from '../components/AuthCard'
import Button from '../components/Button'
import FormInput from '../components/FormInput'
import { apiPost, errorMessage } from '../lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    try {
      const response = await apiPost<{ message: string }>('/accounts/password-reset/', { email: email })
      setMessage(response.message)
    } catch (err) {
      setError(errorMessage(err))
    }
    setSubmitting(false)
  }

  return (
    <AuthCard title="Forgot password" subtitle="Enter your email and we'll send you a link to reset your password.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert message={error} />
        <Alert message={message} kind="success" />
        <FormInput label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link to="/signin" className="font-semibold text-brand hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthCard>
  )
}
