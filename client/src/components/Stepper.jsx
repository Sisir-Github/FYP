function Stepper({ steps, current }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
      {steps.map((step, index) => {
        const active = index <= current
        return (
          <div key={step} className="flex items-center gap-3">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                active ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200'
              }`}
            >
              {index + 1}
            </span>
            <span className={active ? 'text-blue-700' : ''}>{step}</span>
          </div>
        )
      })}
    </div>
  )
}

export default Stepper
