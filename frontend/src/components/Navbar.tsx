import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { dashboardPath } from '../lib/dashboards'
import { useAuth } from '../lib/useAuth'
import Logo from './Logo'

function linkClass({ isActive }: { isActive: boolean }) {
  return 'block rounded-md px-3 py-2 text-sm font-medium ' + (isActive ? 'text-brand bg-brand-light' : 'text-slate-600 hover:text-brand')
}

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    setMenuOpen(false)
    await signOut()
    navigate('/')
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  const links = (
    <>
      <NavLink to="/" end className={linkClass} onClick={closeMenu}>
        Home
      </NavLink>
      <NavLink to="/news" className={linkClass} onClick={closeMenu}>
        News & Events
      </NavLink>
      {user && (
        <>
          <NavLink to={dashboardPath(user.role)} className={linkClass} onClick={closeMenu}>
            Dashboard
          </NavLink>
          <NavLink to="/profile" className={linkClass} onClick={closeMenu}>
            Profile
          </NavLink>
        </>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {links}
          {user ? (
            <button onClick={handleSignOut} className="ml-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100">
              Sign out
            </button>
          ) : (
            <NavLink to="/signin" className="ml-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
              Portal sign in
            </NavLink>
          )}
        </div>

        <button
          className="rounded-md p-2 text-slate-600 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? <path d="M6 18 18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="space-y-1 border-t border-slate-200 px-4 py-3 md:hidden">
          {links}
          {user ? (
            <button onClick={handleSignOut} className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-600">
              Sign out
            </button>
          ) : (
            <NavLink to="/signin" className={linkClass} onClick={closeMenu}>
              Portal sign in
            </NavLink>
          )}
        </div>
      )}
    </header>
  )
}
