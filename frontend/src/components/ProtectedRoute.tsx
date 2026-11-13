import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { dashboardPath } from '../lib/dashboards'
import type { Role } from '../lib/types'
import { useAuth } from '../lib/useAuth'
import Loading from './Loading'

type ProtectedRouteProps = {
  children: ReactNode
  roles?: Role[]
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4">
        <Loading />
      </div>
    )
  }

  // Not logged in: go to sign in, then come back here afterwards
  if (user === null) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  }

  // Logged in but this page is for a different role
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={dashboardPath(user.role)} replace />
  }

  return <>{children}</>
}
