import { useState, type ChangeEvent, type FormEvent } from 'react'
import { ApiError, apiPatch, apiPost, errorMessage, type FieldErrors } from '../lib/api'
import { currentSession } from '../lib/format'
import type { Result, Student, Subject } from '../lib/types'
import Alert from './Alert'
import Button from './Button'
import FormInput from './FormInput'
import FormSelect from './FormSelect'

type ResultFormProps = {
  students: Student[]
  subjects: Subject[]
  editingResult: Result | null
  onSaved: () => void
  onCancelEdit: () => void
}

function startingValues(editingResult: Result | null) {
  if (editingResult) {
    return {
      student: String(editingResult.student),
      subject: String(editingResult.subject),
      session: editingResult.session,
      term: editingResult.term as string,
      test_score: String(editingResult.test_score),
      exam_score: String(editingResult.exam_score),
    }
  }
  return { student: '', subject: '', session: currentSession(), term: 'first', test_score: '', exam_score: '' }
}

// Used by teachers to add a new result or fix the scores on an existing one.
// The parent page gives this a new key when switching results, so the form starts fresh.
export default function ResultForm({ students, subjects, editingResult, onSaved, onCancelEdit }: ResultFormProps) {
  const [form, setForm] = useState(startingValues(editingResult))
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const isEditing = editingResult !== null

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setSaving(true)

    const data = {
      student: Number(form.student),
      subject: Number(form.subject),
      session: form.session,
      term: form.term,
      test_score: Number(form.test_score),
      exam_score: Number(form.exam_score),
    }

    try {
      if (isEditing) {
        await apiPatch('/academics/results/' + editingResult.id + '/', data)
      } else {
        await apiPost('/academics/results/', data)
        // Keep the student, session and term so the teacher can quickly enter the next subject
        setForm({ ...form, subject: '', test_score: '', exam_score: '' })
      }
      onSaved()
    } catch (err) {
      setError(errorMessage(err))
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors)
      }
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-semibold text-slate-900">{isEditing ? 'Edit result' : 'Add a result'}</h2>
      <Alert message={error} />

      <FormSelect label="Student" name="student" value={form.student} onChange={handleChange} errors={fieldErrors.student} required>
        <option value="">Choose a student</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.last_name}, {student.first_name}
          </option>
        ))}
      </FormSelect>

      <FormSelect label="Subject" name="subject" value={form.subject} onChange={handleChange} errors={fieldErrors.subject} required>
        <option value="">Choose a subject</option>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </FormSelect>

      <div className="grid grid-cols-2 gap-4">
        <FormInput label="Session" name="session" value={form.session} onChange={handleChange} errors={fieldErrors.session} placeholder="2025/2026" required />
        <FormSelect label="Term" name="term" value={form.term} onChange={handleChange} errors={fieldErrors.term}>
          <option value="first">First</option>
          <option value="second">Second</option>
          <option value="third">Third</option>
        </FormSelect>
        <FormInput label="Test (out of 40)" name="test_score" type="number" min={0} max={40} value={form.test_score} onChange={handleChange} errors={fieldErrors.test_score} required />
        <FormInput label="Exam (out of 60)" name="exam_score" type="number" min={0} max={60} value={form.exam_score} onChange={handleChange} errors={fieldErrors.exam_score} required />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Add result'}
        </Button>
        {isEditing && (
          <Button type="button" variant="secondary" onClick={onCancelEdit}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
