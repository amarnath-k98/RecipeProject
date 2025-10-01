import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["User", "Recipe", "MealPlan", "Comment"],
  endpoints: (builder) => ({
    //auth
    register: builder.mutation({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
    }),
    login: builder.mutation({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
    }),
    //profile
    getProfile: builder.query({
      query: () => {
        return {
          url: "/profile",
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (payload) => ({
        url: "/profile/update",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query({
      query: () => {
        return {
          url: "/profile/all",
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),
    getUserDashboard: builder.query({
      query: () => {
        return {
          url: "/profile/dashboard",
          method: "GET",
        };
      },
      providesTags: ["User", "Recipe", "MealPlan"],
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: "/profile/delete",
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Recipe", "MealPlan", "Comment"],
    }),
    //Meal Plan
    createMealPlan: builder.mutation({
      query: (payload) => ({
        url: "/mealplan",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["MealPlan"],
    }),
    getMealPlanById: builder.query({
      query: (id) => ({
        url: `/mealplan/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "MealPlan", id }],
    }),

    updateMealPlan: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/mealplan/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["MealPlan"],
    }),
    deleteMealPlan: builder.mutation({
      query: ({ id }) => ({
        url: `/mealplan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MealPlan"],
    }),
    // Social Actions
    followUser: builder.mutation({
      query: (targetId) => ({
        url: `/social/follow/${targetId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "User" }],
    }),
    unfollowUser: builder.mutation({
      query: (userId) => ({
        url: `/social/unfollow/${userId}`,
        method: "POST",
      }),
    }),
    likeRecipe: builder.mutation({
      query: (recipeId) => ({
        url: `/social/like/${recipeId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, recipeId) => [
        { type: "Recipe", id: recipeId },
        { type: "Recipe" },
      ],
    }),
    saveRecipe: builder.mutation({
      query: ({ recipeId }) => ({
        url: `/social/save/${recipeId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { recipeId }) => [
        { type: "User" },
        { type: "Recipe", id: recipeId },
      ],
    }),
    rateRecipe: builder.mutation({
      query: ({ recipeId, rating }) => ({
        url: `/recipes/${recipeId}/rate`,
        method: "POST",
        body: { rating },
      }),
    }),
    getRecipeRating: builder.query({
      query: (recipeId) => `/recipes/${recipeId}/rating`,
    }),
    //Recipes
    getRecipes: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/recipes?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Recipe"],
    }),
    getRecipeById: builder.query({
      query: (recipeId) => ({
        url: `/recipes/${recipeId}`,
        method: "GET",
      }),
      providesTags: (result, error, recipeId) => [
        { type: "Recipe", id: recipeId },
      ],
    }),
    createRecipe: builder.mutation({
      query: (payload) => ({
        url: "/recipes",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User", "Recipe"],
    }),
    updateRecipe: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/recipes/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Recipe", id },
        { type: "Recipe" },
        { type: "User" },
      ],
    }),
    deleteRecipe: builder.mutation({
      query: (recipeId) => ({
        url: `/recipes/${recipeId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, recipeId) => [
        { type: "Recipe", id: recipeId },
        { type: "Recipe" },
        { type: "User" },
      ],
    }),
    searchRecipe: builder.query({
      query: (query) => ({
        url: `/recipes/search?query=${query}`,
      }),
      providesTags: [{ type: "Recipe" }, { type: "User" }],
    }),
    toggleLike: builder.mutation({
      query: ({ recipeId }) => ({
        url: `/social/like/${recipeId}`,
        method: "POST",
      }),
    }),
    getSavedRecipes: builder.query({
      query: () => ({
        url: "/social/saved",
        method: "GET",
      }),
      providesTags: ["Recipe"],
    }),
    //Comments
    createComment: builder.mutation({
      query: (payload) => ({
        url: "/comments",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Comment"],
    }),
    getComments: builder.query({
      query: (recipeId) => ({
        url: `/comments/${recipeId}`,
        method: "GET",
      }),
      providesTags: ["Comment"],
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),
    //Password
    forgotPassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: payload,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: `/auth/reset-password/${token}`,
        method: "POST",
        body: { newPassword },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useGetUserDashboardQuery,
  useDeleteAccountMutation,
  useCreateMealPlanMutation,
  useGetMealPlanByIdQuery,
  useUpdateMealPlanMutation,
  useDeleteMealPlanMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useLikeRecipeMutation,
  useSaveRecipeMutation,
  useRateRecipeMutation,
  useGetRecipeRatingQuery,
  useGetRecipesQuery,
  useGetRecipeByIdQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useSearchRecipeQuery,
  useGetSavedRecipesQuery,
  useToggleLikeMutation,
  useCreateCommentMutation,
  useGetCommentsQuery,
  useDeleteCommentMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = apiSlice;
