import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  token:
    Cookies.get("authenticationToken") ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTJmOWYyN2Y5NTI1NjA4MjRkZTc5NSIsImlhdCI6MTcxNjcxNDE2NiwiZXhwIjoxNzE3MTQ2MTY2fQ.YsOtOnwo9rjkVGcf0XvyAnqypuV-ThBXbPRgtPlqByM",
  avatar: Cookies.get("userAvatar") || null,
  full_name: Cookies.get("fullName") || "Alaa Ashref",
};
export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuth: (state, action) => {
      state.token = action.payload;
    },
  },
});
export const { updateAuth } = AuthSlice.actions;
export default AuthSlice.reducer;
