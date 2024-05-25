import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./src/features/Auth/AuthSlice";

const Store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
  },
});

export default Store;
