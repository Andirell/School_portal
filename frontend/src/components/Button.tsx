import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger'
}

export default function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  let colours = 'bg-brand text-white hover:bg-brand-dark'
  if (variant === 'secondary') {
    colours = 'bg-white text-brand border border-slate-300 hover:bg-slate-100'
  }
  if (variant === 'danger') {
    colours = 'bg-red-600 text-white hover:bg-red-700'
  }

  return (
    <button
      className={'rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ' + colours + ' ' + className}
      {...rest}
    />
  )
}
