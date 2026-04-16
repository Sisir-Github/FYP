import { apiSlice } from './apiSlice.js'

export const heroApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHeroSlides: builder.query({
      query: () => ({
        url: '/hero',
        method: 'GET',
      }),
      providesTags: ['Hero'],
    }),
  }),
})

export const { useGetHeroSlidesQuery } = heroApi
