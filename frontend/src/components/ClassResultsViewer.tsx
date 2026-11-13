import { useEffect, useState } from 'react'
import { apiGet, errorMessage } from '../lib/api'
import { currentSession } from '../lib/format'
import { resultQuery } from '../lib/query'
import type { Result, SchoolClass, Term } from '../lib/types'
import Alert from './Alert'
import Loading from './Loading'
import ResultFilters from './ResultFilters'
import ResultGroups from './ResultGroups'

// Lets the admin look at the results for any class
export default function ClassResultsViewer() {
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
  const [results, setResults] = useState<Result[]>([])
  const [session, setSession] = useState(currentSession())
  const [term, setTerm] = useState<Term | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet<SchoolClass[]>('/academics/classes/')
      .then((data) => {
        setClasses(data)
        if (data.length > 0) {
          setSelectedClassId(data[0].id)
        }
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (selectedClassId === null) {
      return
    }
    apiGet<Result[]>('/academics/classes/' + selectedClassId + '/results/' + resultQuery(session, term))
      .then((data) => setResults(data))
      .catch((err) => setError(errorMessage(err)))
  }, [selectedClassId, session, term])

  if (loading) {
    return <Loading />
  }

  if (classes.length === 0) {
    return <p className="text-sm text-slate-500">No classes yet. Add them in the Django admin.</p>
  }

  return (
    <div>
      <Alert message={error} />
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Class</span>
          <select
            value={selectedClassId ?? ''}
            onChange={(event) => setSelectedClassId(Number(event.target.value))}
            className="rounded-md border border-slate-300 bg-white px-3 py-2"
          >
            {classes.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name} {schoolClass.arm}
                {schoolClass.class_teacher_name ? ' (' + schoolClass.class_teacher_name + ')' : ''}
              </option>
            ))}
          </select>
        </label>
        <ResultFilters session={session} term={term} onSessionChange={setSession} onTermChange={setTerm} />
      </div>
      <ResultGroups results={results} showStudent />
    </div>
  )
}
