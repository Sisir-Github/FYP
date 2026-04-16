import { apiSlice } from './apiSlice.js'

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // User operations
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
    cancelMyBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Bookings'],
    }),
    
    // Admin operations
    getBookingsAdmin: builder.query({
      query: (params) => ({
        url: '/admin/bookings',
        method: 'GET',
        params,
      }),
      providesTags: ['Bookings'],
    }),
    getBookingById: builder.query({
      query: (id) => ({
        url: `/admin/bookings/${id}`,
        method: 'GET',
      }),
      providesTags: ['Bookings'],
    }),
    updateBookingAdmin: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/admin/bookings/${id}`,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['Bookings'],
    }),
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/admin/bookings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bookings'],
    }),
  }),
})

export const { 
  useCreateBookingMutation, 
  useGetMyBookingsQuery,
  useCancelMyBookingMutation,
  useGetBookingsAdminQuery,
  useGetBookingByIdQuery,
  useUpdateBookingAdminMutation,
  useDeleteBookingMutation,
} = bookingApi
