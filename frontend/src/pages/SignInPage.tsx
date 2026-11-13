import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import AuthCard from '../components/AuthCard'
import Button from '../components/Button'
import FormInput from '../components/FormInput'
import { errorMessage } from '../lib/api'
import { dashboardPath } from '../lib/dashboards'
import { useAuth } from '../lib/useAuth'

export default function SignInPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ProtectedRoute tells us which page the user was trying to open
  const cameFrom = location.state?.from as string | undefined

  if (user && !submitting) {
    return <Navigate to={dashboardPath(user.role)} replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const signedInUser = await signIn(email, password)
      navigate(cameFrom || dashboardPath(signedInUser.role), { replace: true })
    } catch (err) {
      setError(errorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <AuthCard title="Portal sign in" subtitle="Students, parents, teachers and staff sign in here.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert message={error} />
        <FormInput label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <FormInput label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-brand hover:underline">
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        New parent or student?{' '}
        <Link to="/signup" className="font-semibold text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </AuthCard>
  )
}
