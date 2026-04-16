import { apiSlice } from './apiSlice.js'

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
    }),
    register: builder.mutation({
      query: (payload) => ({
        url: '/auth/register',
        method: 'POST',
        data: payload,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    me: builder.query({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
    sendEmailOtp: builder.mutation({
      query: () => ({
        url: '/auth/send-email-otp',
        method: 'POST',
      }),
      invalidatesTags: ['Profile'],
    }),
    verifyEmailOtp: builder.mutation({
      query: (payload) => ({
        url: '/auth/verify-email-otp',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useMeQuery,
  useSendEmailOtpMutation,
  useVerifyEmailOtpMutation,
} = authApi
