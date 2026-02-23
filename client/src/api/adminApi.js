import { apiSlice } from './apiSlice.js'

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => ({
        url: '/admin/stats',
        method: 'GET',
      }),
      providesTags: ['Stats'],
    }),
    getTreksAdmin: builder.query({
      query: () => ({
        url: '/admin/treks',
        method: 'GET',
      }),
      providesTags: ['Treks'],
    }),
    createTrek: builder.mutation({
      query: (payload) => ({
        url: '/admin/treks',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Treks'],
    }),
    updateTrek: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/admin/treks/${id}`,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['Treks'],
    }),
    deleteTrek: builder.mutation({
      query: (id) => ({
        url: `/admin/treks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Treks'],
    }),
    getRegionsAdmin: builder.query({
      query: () => ({
        url: '/admin/regions',
        method: 'GET',
      }),
      providesTags: ['Regions'],
    }),
    createRegion: builder.mutation({
      query: (payload) => ({
        url: '/admin/regions',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Regions'],
    }),
    getBookingsAdmin: builder.query({
      query: (params) => ({
        url: '/admin/bookings',
        method: 'GET',
        params,
      }),
      providesTags: ['Bookings'],
    }),
    updateBooking: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/admin/bookings/${id}`,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['Bookings'],
    }),
    getPaymentsAdmin: builder.query({
      query: () => ({
        url: '/admin/payments',
        method: 'GET',
      }),
      providesTags: ['Payments'],
    }),
    getUsersAdmin: builder.query({
      query: () => ({
        url: '/admin/users',
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),
    getReviewsAdmin: builder.query({
      query: () => ({
        url: '/admin/reviews',
        method: 'GET',
      }),
      providesTags: ['Reviews'],
    }),
    getInquiriesAdmin: builder.query({
      query: () => ({
        url: '/admin/inquiries',
        method: 'GET',
      }),
      providesTags: ['Inquiries'],
    }),
    getGalleryAdmin: builder.query({
      query: () => ({
        url: '/admin/gallery',
        method: 'GET',
      }),
      providesTags: ['Gallery'],
    }),
    createGalleryItem: builder.mutation({
      query: (payload) => ({
        url: '/admin/gallery',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Gallery'],
    }),
    updateGalleryItem: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/admin/gallery/${id}`,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['Gallery'],
    }),
    deleteGalleryItem: builder.mutation({
      query: (id) => ({
        url: `/admin/gallery/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Gallery'],
    }),
    getHeroSlidesAdmin: builder.query({
      query: () => ({
        url: '/admin/hero',
        method: 'GET',
      }),
      providesTags: ['Hero'],
    }),
    createHeroSlide: builder.mutation({
      query: (payload) => ({
        url: '/admin/hero',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Hero'],
    }),
    updateHeroSlide: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/admin/hero/${id}`,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['Hero'],
    }),
    deleteHeroSlide: builder.mutation({
      query: (id) => ({
        url: `/admin/hero/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Hero'],
    }),
  }),
})

export const {
  useGetAdminStatsQuery,
  useGetTreksAdminQuery,
  useGetRegionsAdminQuery,
  useCreateTrekMutation,
  useUpdateTrekMutation,
  useDeleteTrekMutation,
  useCreateRegionMutation,
  useGetBookingsAdminQuery,
  useUpdateBookingMutation,
  useGetPaymentsAdminQuery,
  useGetUsersAdminQuery,
  useGetReviewsAdminQuery,
  useGetInquiriesAdminQuery,
  useGetGalleryAdminQuery,
  useCreateGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
  useGetHeroSlidesAdminQuery,
  useCreateHeroSlideMutation,
  useUpdateHeroSlideMutation,
  useDeleteHeroSlideMutation,
} = adminApi
