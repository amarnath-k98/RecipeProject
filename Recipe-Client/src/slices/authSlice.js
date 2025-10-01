import { createSlice } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";

const safeParse = (key) => {
  try {
    const value = localStorage.getItem(key);
    if (!value || value === "undefined" || value === "null") return null;
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    user: safeParse("user"),
  },
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      state.user = action.payload.user || null;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    clearUser: (state) => {
      state.token = null;
      localStorage.removeItem("token");
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const loadUserFromToken = () => (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const decoded = jwtDecode(token);
    const user = { _id: decoded.id };
    dispatch(setUser({ token, user }));
  } catch (err) {
    console.error("Token decode failed:", err);
  }
};

const authReducer = authSlice.reducer;
export const { setUser, clearUser } = authSlice.actions;
export default authReducer;

