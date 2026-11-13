// Builds "?session=...&term=..." and leaves out anything that's empty
export function resultQuery(session: string, term: string) {
  const params = new URLSearchParams()
  if (session) {
    params.set('session', session)
  }
  if (term) {
    params.set('term', term)
  }

  const query = params.toString()
  if (query === '') {
    return ''
  }
  return '?' + query
}
