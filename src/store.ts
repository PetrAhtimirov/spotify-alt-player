import { configureStore, Middleware } from "@reduxjs/toolkit";
import user from "./features/profilePreview/profileSlice";

const stringMiddleware: Middleware = () => (next) => (action) => {
  if (typeof action === "string") {
    return next({
      type: action,
    });
  }
  return next(action);
};

const store = configureStore({
  reducer: { user },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(stringMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
