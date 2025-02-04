import { configureStore, Middleware } from "@reduxjs/toolkit";
import userReducer from "./features/profilePreview/profileSlice";
import playbackReducer from "./features/playbackControllers/playbackSlice";

const stringMiddleware: Middleware = () => (next) => (action) => {
  if (typeof action === "string") {
    return next({ type: action });
  }
  return next(action);
};

const store = configureStore({
  reducer: { user: userReducer, playback: playbackReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(stringMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
