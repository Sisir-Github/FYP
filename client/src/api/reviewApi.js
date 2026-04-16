import { apiSlice } from './apiSlice.js'

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (params) => ({
        url: '/reviews',
        method: 'GET',
        params,
      }),
      providesTags: ['Reviews'],
    }),
  }),
})

export const { useGetReviewsQuery } = reviewApi
