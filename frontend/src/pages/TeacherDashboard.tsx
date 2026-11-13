import { useEffect, useState } from 'react'
import Alert from '../components/Alert'
import Card from '../components/Card'
import Loading from '../components/Loading'
import PageHeader from '../components/PageHeader'
import ResultFilters from '../components/ResultFilters'
import ResultForm from '../components/ResultForm'
import ResultGroups from '../components/ResultGroups'
import { apiGet, errorMessage } from '../lib/api'
import { currentSession } from '../lib/format'
import { resultQuery } from '../lib/query'
import type { Result, SchoolClass, Student, Subject, Term } from '../lib/types'
import { useAuth } from '../lib/useAuth'

function className(schoolClass: SchoolClass) {
  return (schoolClass.name + ' ' + schoolClass.arm).trim()
}

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [session, setSession] = useState(currentSession())
  const [term, setTerm] = useState<Term | ''>('')
  const [editingResult, setEditingResult] = useState<Result | null>(null)
  // Bumping this number makes the results reload after a save
  const [reloadCount, setReloadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([apiGet<SchoolClass[]>('/academics/my-classes/'), apiGet<Subject[]>('/academics/subjects/')])
      .then(([classData, subjectData]) => {
        setClasses(classData)
        setSubjects(subjectData)
        if (classData.length > 0) {
          setSelectedClassId(classData[0].id)
        }
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (selectedClassId === null) {
      return
    }
    apiGet<Student[]>('/academics/classes/' + selectedClassId + '/students/')
      .then((data) => setStudents(data))
      .catch((err) => setError(errorMessage(err)))
  }, [selectedClassId])

  useEffect(() => {
    if (selectedClassId === null) {
      return
    }
    apiGet<Result[]>('/academics/classes/' + selectedClassId + '/results/' + resultQuery(session, term))
      .then((data) => setResults(data))
      .catch((err) => setError(errorMessage(err)))
  }, [selectedClassId, session, term, reloadCount])

  function handleSaved() {
    setEditingResult(null)
    setReloadCount(reloadCount + 1)
  }

  function chooseClass(classId: number) {
    setSelectedClassId(classId)
    setEditingResult(null)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Loading />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader title={'Welcome, ' + user?.first_name} subtitle="Enter and update results for your class." />
      <Alert message={error} />

      {classes.length === 0 && (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          You aren't the class teacher for any class yet. Please ask the school admin to assign you to one.
        </p>
      )}

      {classes.length > 0 && (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {classes.map((schoolClass) => (
              <button
                key={schoolClass.id}
                onClick={() => chooseClass(schoolClass.id)}
                className={
                  'rounded-full px-4 py-1.5 text-sm font-medium ' +
                  (schoolClass.id === selectedClassId ? 'bg-brand text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-100')
                }
              >
                {className(schoolClass)}
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <Card>
                <ResultForm
                  key={editingResult ? editingResult.id : 'new-' + selectedClassId}
                  students={students}
                  subjects={subjects}
                  editingResult={editingResult}
                  onSaved={handleSaved}
                  onCancelEdit={() => setEditingResult(null)}
                />
              </Card>
              <Card>
                <h2 className="mb-3 font-semibold text-slate-900">Students ({students.length})</h2>
                {students.length === 0 && <p className="text-sm text-slate-500">No students in this class yet.</p>}
                <ul className="divide-y divide-slate-100 text-sm">
                  {students.map((student) => (
                    <li key={student.id} className="py-2">
                      {student.last_name}, {student.first_name}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <div className="mb-4">
                <ResultFilters session={session} term={term} onSessionChange={setSession} onTermChange={setTerm} />
              </div>
              <ResultGroups results={results} showStudent onEdit={setEditingResult} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
