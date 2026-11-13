import { termLabel } from '../lib/format'
import type { Result } from '../lib/types'
import ResultsTable from './ResultsTable'

type ResultGroupsProps = {
  results: Result[]
  showStudent?: boolean
  onEdit?: (result: Result) => void
}

type Group = {
  heading: string
  results: Result[]
}

// Splits results into one table per term, so each term gets its own average
function groupByTerm(results: Result[]) {
  const groups: Group[] = []

  for (const result of results) {
    const heading = result.session + ' · ' + termLabel(result.term)

    let group = groups.find((existing) => existing.heading === heading)
    if (!group) {
      group = { heading: heading, results: [] }
      groups.push(group)
    }
    group.results.push(result)
  }

  return groups
}

export default function ResultGroups({ results, showStudent = false, onEdit }: ResultGroupsProps) {
  if (results.length === 0) {
    return <p className="py-6 text-sm text-slate-500">No results yet for this selection.</p>
  }

  const groups = groupByTerm(results)

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.heading}>
          <h2 className="mb-3 font-semibold text-slate-800">{group.heading}</h2>
          <ResultsTable results={group.results} showStudent={showStudent} onEdit={onEdit} />
        </section>
      ))}
    </div>
  )
}
