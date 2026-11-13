import type { Term } from './types'

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function termLabel(term: Term) {
  if (term === 'first') {
    return 'First Term'
  }
  if (term === 'second') {
    return 'Second Term'
  }
  return 'Third Term'
}

// Works out the current school session, e.g. "2026/2027".
// A new session starts in September.
export function currentSession() {
  const today = new Date()
  let startYear = today.getFullYear()
  if (today.getMonth() < 8) {
    startYear = startYear - 1
  }
  return startYear + '/' + (startYear + 1)
}
