import { apiSlice } from './apiSlice.js'

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (payload) => ({
        url: '/payments/intent',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Payments'],
    }),
    initiateKhaltiPayment: builder.mutation({
      query: (payload) => ({
        url: '/payments/initiate-khalti',
        method: 'POST',
        data: payload,
      }),
    }),
    getMyPayments: builder.query({
      query: () => ({
        url: '/payments/me',
        method: 'GET',
      }),
      providesTags: ['Payments'],
    }),
  }),
})

export const {
  useCreatePaymentIntentMutation,
  useInitiateKhaltiPaymentMutation,
  useGetMyPaymentsQuery,
} = paymentApi
