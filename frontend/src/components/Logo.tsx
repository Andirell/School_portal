import { Link } from 'react-router-dom'
import { SCHOOL_NAME } from '../lib/config'

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img src="/favicon.svg" alt="" className="h-8 w-8" />
      <span className={'text-lg font-bold ' + (light ? 'text-white' : 'text-brand')}>{SCHOOL_NAME}</span>
    </Link>
  )
}
