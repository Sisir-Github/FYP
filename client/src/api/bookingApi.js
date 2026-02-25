import { apiSlice } from './apiSlice.js'

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (payload) => ({
        url: '/bookings',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Bookings'],
    }),
    getMyBookings: builder.query({
      query: () => ({
        url: '/bookings/me',
        method: 'GET',
      }),
      providesTags: ['Bookings'],
    }),
  }),
})

export const { useCreateBookingMutation, useGetMyBookingsQuery } = bookingApi
