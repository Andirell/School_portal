import type { Result } from '../lib/types'

type ResultsTableProps = {
  results: Result[]
  showStudent?: boolean
  onEdit?: (result: Result) => void
}

function gradeColour(grade: string) {
  if (grade === 'A' || grade === 'B') {
    return 'text-green-700'
  }
  if (grade === 'F') {
    return 'text-red-600'
  }
  return 'text-slate-700'
}

export default function ResultsTable({ results, showStudent = false, onEdit }: ResultsTableProps) {
  if (results.length === 0) {
    return <p className="py-6 text-sm text-slate-500">No results yet for this selection.</p>
  }

  let sumOfTotals = 0
  for (const result of results) {
    sumOfTotals = sumOfTotals + result.total
  }
  const average = sumOfTotals / results.length

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              {showStudent && <th className="px-4 py-3">Student</th>}
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Test (40)</th>
              <th className="px-4 py-3">Exam (60)</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Grade</th>
              {onEdit && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((result) => (
              <tr key={result.id}>
                {showStudent && <td className="px-4 py-3">{result.student_name}</td>}
                <td className="px-4 py-3 font-medium text-slate-900">{result.subject_name}</td>
                <td className="px-4 py-3">{result.test_score}</td>
                <td className="px-4 py-3">{result.exam_score}</td>
                <td className="px-4 py-3 font-semibold">{result.total}</td>
                <td className={'px-4 py-3 font-bold ' + gradeColour(result.grade)}>{result.grade}</td>
                {onEdit && (
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onEdit(result)} className="text-sm font-medium text-brand hover:underline">
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!showStudent && (
        <p className="mt-3 text-sm text-slate-600">
          Average: <span className="font-semibold text-slate-900">{average.toFixed(1)}</span> across {results.length}{' '}
          {results.length === 1 ? 'subject' : 'subjects'}
        </p>
      )}
    </div>
  )
}
