import { apiSlice } from './apiSlice.js'

export const trekApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Public operations
    getTreks: builder.query({
      query: (params) => ({
        url: '/treks',
        method: 'GET',
        params,
      }),
      providesTags: ['Treks'],
    }),
    getTrekById: builder.query({
      query: (id) => ({
        url: `/treks/${id}`,
        method: 'GET',
      }),
      providesTags: ['Treks'],
    }),
    getTrekAvailability: builder.query({
      query: (id) => ({
        url: `/treks/${id}/availability`,
        method: 'GET',
      }),
    }),
    getRegions: builder.query({
      query: () => ({
        url: '/regions',
        method: 'GET',
      }),
      providesTags: ['Regions'],
    }),
    submitReview: builder.mutation({
      query: (payload) => ({
        url: '/reviews',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Reviews'],
    }),
    submitInquiry: builder.mutation({
      query: (payload) => ({
        url: '/inquiries',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Inquiries'],
    }),
    
    // Admin trek operations
    getTreksAdmin: builder.query({
      query: (params) => ({
        url: '/admin/treks',
        method: 'GET',
        params,
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
  }),
})

export const {
  useGetTreksQuery,
  useGetTrekByIdQuery,
  useGetTrekAvailabilityQuery,
  useGetRegionsQuery,
  useSubmitReviewMutation,
  useSubmitInquiryMutation,
  useGetTreksAdminQuery,
  useCreateTrekMutation,
  useUpdateTrekMutation,
  useDeleteTrekMutation,
} = trekApi
