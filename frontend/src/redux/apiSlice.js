import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (payload) => ({
        url: "/user/register",
        method: "POST",
        body: payload,
      }),
    }),
    loginUser: builder.mutation({
      query: (payload) => ({
        url: "/user/login",
        method: "POST",
        body: payload,
      }),
    }),
    createEvent: builder.mutation({
      query: (payload) => {
        const token = localStorage.getItem("token");
        return {
          url: "/user/create-event",
          method: "POST",
          body: payload,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["Events"],
    }),
    getEvent: builder.query({
      query: (payload) => ({
        url: "/user/get-event",
        method: "POST",
        body: payload,
      }),
      providesTags: ["Events"],
    }),
    cancelEvent: builder.mutation({
      query: (payload) => {
        const token = localStorage.getItem("token");
        return {
          url: "/user/cancel-event",
          method: "POST",
          body: payload,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["Events"],
    }),
    updateEvent: builder.mutation({
      query: (payload) => {
        const token = localStorage.getItem("token");
        return {
          url: "/user/update-event",
          method: "POST",
          body: payload,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["Events"],
    }),
    joinEvent: builder.mutation({
      query: (payload) => {
        const token = localStorage.getItem("token");
        return {
          url: "/user/join-event",
          method: "POST",
          body: payload,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["Events"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useGetEventQuery,
  useCreateEventMutation,
  useCancelEventMutation,
  useJoinEventMutation,
  useUpdateEventMutation,
} = apiSlice;
