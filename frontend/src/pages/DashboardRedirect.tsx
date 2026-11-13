import { Navigate } from 'react-router-dom'
import { dashboardPath } from '../lib/dashboards'
import { useAuth } from '../lib/useAuth'

// /dashboard just sends people to the right page for their role
export default function DashboardRedirect() {
  const { user } = useAuth()
  if (user === null) {
    return <Navigate to="/signin" replace />
  }
  return <Navigate to={dashboardPath(user.role)} replace />
}
