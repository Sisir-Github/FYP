const sizeClasses = {
  sm: 'max-w-xl',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
}

function Modal({ open, title, children, onClose, size = 'md' }) {
  if (!open) return null
  const maxWidth = sizeClasses[size] || sizeClasses.md
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-900/30"
        onClick={onClose}
        role="presentation"
      />
      <div
        className={`relative z-10 w-full ${maxWidth} max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
          >
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

export default Modal
