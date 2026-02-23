import { apiSlice } from './apiSlice.js'

export const trekApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
})

export const {
  useGetTreksQuery,
  useGetTrekByIdQuery,
  useGetTrekAvailabilityQuery,
  useGetRegionsQuery,
  useSubmitReviewMutation,
  useSubmitInquiryMutation,
} = trekApi
