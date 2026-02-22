import { createSlice } from '@reduxjs/toolkit'
import { getStoredUser, clearStoredUser, storeUser } from '../utils/token.js'

const storedUser = getStoredUser()

const initialState = {
  user: storedUser,
  role: storedUser?.role || null,
  isAuthenticated: Boolean(storedUser),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const user = action.payload?.user || action.payload || null
      state.user = user
      state.role = user?.role || null
      state.isAuthenticated = Boolean(user)
      if (user) {
        storeUser(user)
      } else {
        clearStoredUser()
      }
    },
    clearCredentials: (state) => {
      state.user = null
      state.role = null
      state.isAuthenticated = false
      clearStoredUser()
    },
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
