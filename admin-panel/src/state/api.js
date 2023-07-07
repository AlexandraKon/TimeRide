import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers) => {
      const data = JSON.parse(localStorage.getItem("persist:root"));
      const token = data.token.replace(/['"]+/g, '');
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Users",
    "Posts",
    "Routes",
    "Comments"
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: () => "api/auth/me",
      providesTags: ["User"],
    }),
    getUsers: build.query({
      query: () => "api/users",
      providesTags: ["Users"],
    }),
    getPosts: build.query({
      query: () => "api/posts",
      providesTags: ["Posts"],
    }),
    getRoutes: build.query({
      query: () => "api/routes",
      providesTags: ["Routes"],
    }),
    getComments: build.query({
      query: () => "api/comments",
      providesTags: ["Comments"],
    }),
    deleteUser: build.mutation({
      query: (userId) => ({
        url: `api/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    deletePosts: build.mutation({
      query: (userId) => ({
        url: `api/posts/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
    deleteRoutes: build.mutation({
      query: (userId) => ({
        url: `api/routes/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Routes"],
    }),
    deleteComments: build.mutation({
      query: (userId) => ({
        url: `api/comments/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useGetPostsQuery,
  useGetRoutesQuery,
  useGetCommentsQuery,
  useDeleteUserMutation,
  useDeleteCommentsMutation,
  useDeletePostsMutation,
  useDeleteRoutesMutation,
} = api;