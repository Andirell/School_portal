import type { Role } from './types'

// Where each kind of user lands after signing in
export function dashboardPath(role: Role) {
  if (role === 'admin') {
    return '/admin-panel'
  }
  if (role === 'teacher') {
    return '/teacher'
  }
  if (role === 'parent') {
    return '/parent'
  }
  return '/student'
}
