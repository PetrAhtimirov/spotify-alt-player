import { configureStore, Middleware } from "@reduxjs/toolkit";
import userReducer from "./features/profilePreview/profileSlice";
import playbackReducer from "./features/playback/playbackSlice";
import playbackDeviceReducer from "./features/playbackDevice/playbackDeviceSlice";

const stringMiddleware: Middleware = () => (next) => (action) => {
  if (typeof action === "string") {
    return next({ type: action });
  }
  return next(action);
};

const store = configureStore({
  reducer: {
    user: userReducer,
    playbackDevice: playbackDeviceReducer,
    playback: playbackReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(stringMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
