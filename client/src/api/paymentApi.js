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
    createCheckoutSession: builder.mutation({
      query: (payload) => ({
        url: '/payments/create-checkout-session',
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
  useCreateCheckoutSessionMutation,
  useGetMyPaymentsQuery,
} = paymentApi
