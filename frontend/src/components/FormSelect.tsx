import type { ReactNode, SelectHTMLAttributes } from 'react'

type FormSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  name: string
  errors?: string[]
  children: ReactNode
}

export default function FormSelect({ label, name, errors, children, ...rest }: FormSelectProps) {
  const hasError = errors !== undefined && errors.length > 0

  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className={
          'w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/30 ' +
          (hasError ? 'border-red-400' : 'border-slate-300 focus:border-brand')
        }
        {...rest}
      >
        {children}
      </select>
      {hasError && <p className="mt-1 text-xs text-red-600">{errors.join(' ')}</p>}
    </div>
  )
}
