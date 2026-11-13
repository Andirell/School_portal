import { useEffect, useState } from 'react'
import Alert from '../components/Alert'
import Loading from '../components/Loading'
import PageHeader from '../components/PageHeader'
import ResultFilters from '../components/ResultFilters'
import ResultGroups from '../components/ResultGroups'
import { ApiError, apiGet, errorMessage } from '../lib/api'
import { resultQuery } from '../lib/query'
import type { Result, Term } from '../lib/types'
import { useAuth } from '../lib/useAuth'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [results, setResults] = useState<Result[]>([])
  const [session, setSession] = useState('')
  const [term, setTerm] = useState<Term | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet<Result[]>('/academics/results/me/' + resultQuery(session, term))
      .then((data) => {
        setResults(data)
        setError('')
      })
      .catch((err) => {
        // A 404 here means the school hasn't put the student in a class yet
        if (err instanceof ApiError && err.status === 404) {
          setError('Your student profile has not been set up yet. Please contact the school office.')
        } else {
          setError(errorMessage(err))
        }
      })
      .finally(() => setLoading(false))
  }, [session, term])

  function changeSession(value: string) {
    setLoading(true)
    setSession(value)
  }

  function changeTerm(value: Term | '') {
    setLoading(true)
    setTerm(value)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader title={'Hello, ' + user?.first_name} subtitle="Here are your results.">
        <ResultFilters session={session} term={term} onSessionChange={changeSession} onTermChange={changeTerm} />
      </PageHeader>

      <Alert message={error} />
      {loading && <Loading />}
      {!loading && !error && <ResultGroups results={results} />}
    </div>
  )
}
