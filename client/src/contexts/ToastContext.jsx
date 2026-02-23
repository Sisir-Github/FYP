import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext({
  pushToast: () => {},
  toasts: [],
  removeToast: () => {},
})

const baseStyles = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-rose-600 text-white',
  warning: 'bg-amber-500 text-white',
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback((toast) => {
    const id = Date.now().toString()
    const payload = {
      id,
      type: toast.type || 'success',
      message: toast.message || '',
    }
    setToasts((prev) => [...prev, payload])
    setTimeout(() => removeToast(id), toast.duration || 2500)
  }, [removeToast])

  const value = useMemo(
    () => ({ toasts, pushToast, removeToast }),
    [toasts, pushToast, removeToast],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export const useToast = () => useContext(ToastContext)

export const ToastViewport = () => {
  const { toasts, removeToast } = useToast()
  if (!toasts.length) return null
  return (
    <div className="fixed right-6 top-24 z-50 space-y-2">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => removeToast(toast.id)}
          className={`w-full rounded-xl px-4 py-3 text-xs shadow ${baseStyles[toast.type] || baseStyles.success}`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  )
}
