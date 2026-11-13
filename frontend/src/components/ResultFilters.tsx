import type { Term } from '../lib/types'

type ResultFiltersProps = {
  session: string
  term: Term | ''
  onSessionChange: (session: string) => void
  onTermChange: (term: Term | '') => void
}

export default function ResultFilters({ session, term, onSessionChange, onTermChange }: ResultFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <label className="text-sm">
        <span className="mb-1 block font-medium text-slate-700">Session</span>
        <input
          value={session}
          onChange={(event) => onSessionChange(event.target.value)}
          placeholder="2025/2026"
          className="w-32 rounded-md border border-slate-300 bg-white px-3 py-2"
        />
      </label>
      <label className="text-sm">
        <span className="mb-1 block font-medium text-slate-700">Term</span>
        <select
          value={term}
          onChange={(event) => onTermChange(event.target.value as Term | '')}
          className="rounded-md border border-slate-300 bg-white px-3 py-2"
        >
          <option value="">All terms</option>
          <option value="first">First Term</option>
          <option value="second">Second Term</option>
          <option value="third">Third Term</option>
        </select>
      </label>
    </div>
  )
}
