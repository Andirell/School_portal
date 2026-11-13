type AlertProps = {
  message: string
  kind?: 'error' | 'success'
}

export default function Alert({ message, kind = 'error' }: AlertProps) {
  if (!message) {
    return null
  }

  let colours = 'border-red-200 bg-red-50 text-red-700'
  if (kind === 'success') {
    colours = 'border-green-200 bg-green-50 text-green-700'
  }

  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={'rounded-md border px-4 py-3 text-sm ' + colours}>
      {message}
    </div>
  )
}
