import { createApi } from '@reduxjs/toolkit/query/react'
import axios from 'axios'
import { clearCredentials } from '../app/authSlice.js'

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method, data, params, headers }, api) => {
    const request = async () =>
      axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
        withCredentials: true,
      })
    try {
      const result = await request()
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError
      if (err.response?.status === 401) {
        try {
          await axios({
            url: `${baseUrl}/auth/refresh`,
            method: 'POST',
            withCredentials: true,
          })
          const retry = await request()
          return { data: retry.data }
        } catch {
          api.dispatch(clearCredentials())
        }
      }
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:6060',
  }),
  tagTypes: [
    'Treks',
    'Regions',
    'Bookings',
    'Payments',
    'Users',
    'Reviews',
    'Inquiries',
    'Stats',
    'Profile',
    'Gallery',
    'Hero',
    'Chat',
  ],
  endpoints: () => ({}),
})
