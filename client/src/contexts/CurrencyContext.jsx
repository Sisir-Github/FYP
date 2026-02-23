import { createContext, useContext, useMemo, useState } from 'react'

const rates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  NPR: 133,
}

const CurrencyContext = createContext({
  currency: 'USD',
  setCurrency: () => {},
  format: (value) => value,
})

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(
    localStorage.getItem('everest_currency') || 'USD',
  )

  const value = useMemo(() => {
    const rate = rates[currency] || 1
    return {
      currency,
      setCurrency: (next) => {
        localStorage.setItem('everest_currency', next)
        setCurrency(next)
      },
      format: (amount) => {
        const converted = Number(amount || 0) * rate
        return `${currency} ${converted.toFixed(0)}`
      },
    }
  }, [currency])

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
