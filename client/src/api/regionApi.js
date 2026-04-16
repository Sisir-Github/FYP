import { apiSlice } from './apiSlice.js'

export const regionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Public operations
    getRegions: builder.query({
      query: () => ({
        url: '/regions',
        method: 'GET',
      }),
      providesTags: ['Regions'],
    }),
    getRegionById: builder.query({
      query: (id) => ({
        url: `/regions/${id}`,
        method: 'GET',
      }),
      providesTags: ['Regions'],
    }),
    
    // Admin operations
    getRegionsAdmin: builder.query({
      query: (params) => ({
        url: '/admin/regions',
        method: 'GET',
        params,
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
    updateRegion: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/admin/regions/${id}`,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['Regions'],
    }),
    deleteRegion: builder.mutation({
      query: (id) => ({
        url: `/admin/regions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Regions'],
    }),
  }),
})

export const { 
  useGetRegionsQuery,
  useGetRegionByIdQuery,
  useGetRegionsAdminQuery,
  useCreateRegionMutation,
  useUpdateRegionMutation,
  useDeleteRegionMutation,
} = regionApi
