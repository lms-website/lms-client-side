import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  token: Cookies.get("token"),
  role: Cookies.get("role"),
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
    updateRole: (state, action) => {
      state.role = action.payload;
    },
  },
});
export const { updateAuth, updateRole } = AuthSlice.actions;
export default AuthSlice.reducer;
