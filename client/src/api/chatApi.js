import { apiSlice } from './apiSlice.js'

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyChat: builder.query({
      query: () => ({
        url: '/chat/me',
        method: 'GET',
      }),
      providesTags: ['Chat'],
    }),
    getMyChatUnreadCount: builder.query({
      query: () => ({
        url: '/chat/me/unread-count',
        method: 'GET',
      }),
      providesTags: ['Chat'],
    }),
    sendMyChatMessage: builder.mutation({
      query: (payload) => ({
        url: '/chat/me',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Chat'],
    }),
    getAdminChatUsers: builder.query({
      query: () => ({
        url: '/admin/chat/users',
        method: 'GET',
      }),
      providesTags: ['Chat'],
    }),
    getAdminChatMessages: builder.query({
      query: (userId) => ({
        url: `/admin/chat/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Chat'],
    }),
    sendAdminChatMessage: builder.mutation({
      query: ({ userId, text }) => ({
        url: `/admin/chat/${userId}`,
        method: 'POST',
        data: { text },
      }),
      invalidatesTags: ['Chat'],
    }),
  }),
})

export const {
  useGetMyChatQuery,
  useGetMyChatUnreadCountQuery,
  useSendMyChatMessageMutation,
  useGetAdminChatUsersQuery,
  useGetAdminChatMessagesQuery,
  useSendAdminChatMessageMutation,
} = chatApi
