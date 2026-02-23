function Toast({ message, type = 'error' }) {
  const styles =
    type === 'success'
      ? 'bg-blue-600 text-white'
      : 'bg-rose-600 text-white'
  return (
    <div className={`rounded-xl px-4 py-3 text-xs shadow ${styles}`}>
      {message}
    </div>
  )
}

export default Toast
