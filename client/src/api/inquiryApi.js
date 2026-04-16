import { apiSlice } from './apiSlice.js'

export const inquiryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // User operations
    submitInquiry: builder.mutation({
      query: (payload) => ({
        url: '/inquiries',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Inquiries'],
    }),
    
    // Admin operations
    getInquiriesAdmin: builder.query({
      query: (params) => ({
        url: '/admin/inquiries',
        method: 'GET',
        params,
      }),
      providesTags: ['Inquiries'],
    }),
    getInquiry: builder.query({
      query: (id) => ({
        url: `/admin/inquiries/${id}`,
        method: 'GET',
      }),
      providesTags: ['Inquiries'],
    }),
    updateInquiry: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/admin/inquiries/${id}`,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['Inquiries'],
    }),
    deleteInquiry: builder.mutation({
      query: (id) => ({
        url: `/admin/inquiries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Inquiries'],
    }),
  }),
})

export const { 
  useSubmitInquiryMutation,
  useGetInquiriesAdminQuery,
  useGetInquiryQuery,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
} = inquiryApi
