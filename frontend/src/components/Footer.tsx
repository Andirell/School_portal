import { Link } from 'react-router-dom'
import { SCHOOL_MOTTO, SCHOOL_NAME } from '../lib/config'
import Logo from './Logo'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="mt-16 bg-brand-dark text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-3 text-sm">{SCHOOL_MOTTO}</p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-white">Quick links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/news" className="hover:text-white">News & Events</Link></li>
            <li><Link to="/signin" className="hover:text-white">Portal sign in</Link></li>
            <li><Link to="/signup" className="hover:text-white">Create an account</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-white">Contact</h3>
          {/* Placeholder details, swap in the real ones */}
          <ul className="space-y-2 text-sm">
            <li>123 School Road, Your City</li>
            <li>+000 000 000 0000</li>
            <li>info@schoolportal.example</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        © {year} {SCHOOL_NAME}. All rights reserved.
      </div>
    </footer>
  )
}
