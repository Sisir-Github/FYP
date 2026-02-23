function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-sm text-slate-600">
      <span className="h-3 w-3 animate-pulse rounded-full bg-blue-600" />
      {label}
    </div>
  )
}

export default Loader
