import { useEffect, useState } from 'react'
import Alert from '../components/Alert'
import Loading from '../components/Loading'
import PageHeader from '../components/PageHeader'
import ResultFilters from '../components/ResultFilters'
import ResultGroups from '../components/ResultGroups'
import { apiGet, errorMessage } from '../lib/api'
import { resultQuery } from '../lib/query'
import type { Result, Student, Term } from '../lib/types'
import { useAuth } from '../lib/useAuth'

export default function ParentDashboard() {
  const { user } = useAuth()
  const [children, setChildren] = useState<Student[]>([])
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null)
  const [results, setResults] = useState<Result[]>([])
  const [session, setSession] = useState('')
  const [term, setTerm] = useState<Term | ''>('')
  const [loadingChildren, setLoadingChildren] = useState(true)
  const [loadingResults, setLoadingResults] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet<Student[]>('/academics/children/')
      .then((data) => {
        setChildren(data)
        if (data.length > 0) {
          setLoadingResults(true)
          setSelectedChildId(data[0].id)
        }
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoadingChildren(false))
  }, [])

  useEffect(() => {
    if (selectedChildId === null) {
      return
    }

    apiGet<Result[]>('/academics/results/child/' + selectedChildId + '/' + resultQuery(session, term))
      .then((data) => {
        setResults(data)
        setError('')
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoadingResults(false))
  }, [selectedChildId, session, term])

  function chooseChild(childId: number) {
    // Clicking the child who is already open shouldn't reload anything
    if (childId === selectedChildId) {
      return
    }
    setLoadingResults(true)
    setSelectedChildId(childId)
  }

  function changeSession(value: string) {
    setLoadingResults(true)
    setSession(value)
  }

  function changeTerm(value: Term | '') {
    setLoadingResults(true)
    setTerm(value)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader title={'Welcome, ' + user?.first_name} subtitle="Check your children's results." />

      <Alert message={error} />
      {loadingChildren && <Loading />}

      {!loadingChildren && children.length === 0 && (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No children are linked to your account yet. Please contact the school office so they can link your child.
        </p>
      )}

      {children.length > 0 && (
        <>
          <div className="mb-6 flex flex-wrap gap-3">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => chooseChild(child.id)}
                className={
                  'rounded-lg border px-4 py-3 text-left text-sm ' +
                  (child.id === selectedChildId ? 'border-brand bg-brand-light' : 'border-slate-200 bg-white hover:bg-slate-50')
                }
              >
                <span className="block font-semibold text-slate-900">
                  {child.first_name} {child.last_name}
                </span>
                <span className="text-slate-500">{child.school_class}</span>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <ResultFilters session={session} term={term} onSessionChange={changeSession} onTermChange={changeTerm} />
          </div>

          {loadingResults ? <Loading /> : <ResultGroups results={results} />}
        </>
      )}
    </div>
  )
}
