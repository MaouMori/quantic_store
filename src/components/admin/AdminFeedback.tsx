type AdminFeedbackProps = {
  type: 'success' | 'error'
  message: string
}

export function AdminFeedback({ type, message }: AdminFeedbackProps) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${
        type === 'success'
          ? 'border-green-500/20 bg-green-500/10 text-green-400'
          : 'border-red-500/20 bg-red-500/10 text-red-400'
      }`}
    >
      {message}
    </div>
  )
}
