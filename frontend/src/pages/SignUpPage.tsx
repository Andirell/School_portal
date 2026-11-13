import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import AuthCard from '../components/AuthCard'
import Button from '../components/Button'
import FormInput from '../components/FormInput'
import FormSelect from '../components/FormSelect'
import { ApiError, apiPost, errorMessage, type FieldErrors } from '../lib/api'
import { dashboardPath } from '../lib/dashboards'
import { useAuth } from '../lib/useAuth'

const emptyForm = {
  first_name: '',
  last_name: '',
  email: '',
  role: 'parent',
  phone_number: '',
  nationality: '',
  password: '',
  confirm_password: '',
}

export default function SignUpPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setSubmitting(true)

    // Phone number is optional and must be unique, so send null instead of an empty string
    const data = { ...form, phone_number: form.phone_number || null }

    try {
      await apiPost('/accounts/signup/', data)
      // Sign them straight in so they don't have to type it all again
      const user = await signIn(form.email, form.password)
      navigate(dashboardPath(user.role), { replace: true })
    } catch (err) {
      setError(errorMessage(err))
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors)
      }
      setSubmitting(false)
    }
  }

  return (
    <AuthCard title="Create an account" subtitle="For parents and students. Teachers get their accounts from the school office.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert message={error} />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput label="First name" name="first_name" value={form.first_name} onChange={handleChange} errors={fieldErrors.first_name} required />
          <FormInput label="Last name" name="last_name" value={form.last_name} onChange={handleChange} errors={fieldErrors.last_name} required />
        </div>
        <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} errors={fieldErrors.email} required autoComplete="email" />
        <FormSelect label="I am a" name="role" value={form.role} onChange={handleChange} errors={fieldErrors.role}>
          <option value="parent">Parent</option>
          <option value="student">Student</option>
        </FormSelect>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput label="Phone (optional)" name="phone_number" value={form.phone_number} onChange={handleChange} errors={fieldErrors.phone_number} />
          <FormInput label="Nationality" name="nationality" value={form.nationality} onChange={handleChange} errors={fieldErrors.nationality} required />
        </div>
        <FormInput label="Password" name="password" type="password" value={form.password} onChange={handleChange} errors={fieldErrors.password} required autoComplete="new-password" />
        <FormInput label="Confirm password" name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} errors={fieldErrors.confirm_password} required autoComplete="new-password" />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/signin" className="font-semibold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  )
}
