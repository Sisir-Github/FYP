import { apiSlice } from './apiSlice.js'

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // User profile operations
    getProfile: builder.query({
      query: () => ({
        url: '/users/me',
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),
    updateProfile: builder.mutation({
      query: (payload) => ({
        url: '/users/me',
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['Users'],
    }),
    changePassword: builder.mutation({
      query: (payload) => ({
        url: '/users/me/password',
        method: 'PATCH',
        data: payload,
      }),
      invalidatesTags: ['Users'],
    }),
    
    // Admin user management operations
    getUsersAdmin: builder.query({
      query: (params) => ({
        url: '/admin/users',
        method: 'GET',
        params,
      }),
      providesTags: ['Users'],
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: '/admin/users',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
})

export const { 
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetUsersAdminQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi
