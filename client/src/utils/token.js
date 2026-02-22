const STORAGE_KEY = 'everest_user'

export const storeUser = (user) => {
  if (!user) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export const getStoredUser = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const clearStoredUser = () => {
  localStorage.removeItem(STORAGE_KEY)
}
