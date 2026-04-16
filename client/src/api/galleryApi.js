import { apiSlice } from './apiSlice.js'

export const galleryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGallery: builder.query({
      query: () => ({
        url: '/gallery',
        method: 'GET',
      }),
      providesTags: ['Gallery'],
    }),
  }),
})

export const { useGetGalleryQuery } = galleryApi
