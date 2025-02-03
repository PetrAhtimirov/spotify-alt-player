import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {useHttp} from "../../hooks/http.hook.ts";

export interface UserState {
  userLoadingStatus: "loading" | "idle" | "error";
  display_name: string;
  images: { url: string }[];
  id: string;
}

const initialState: UserState = {
  userLoadingStatus: "idle",
  display_name: "",
  id: "",
  images: [],
};

export const fetchUser = createAsyncThunk("user/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const {request} = useHttp();
    const data = await request("https://api.spotify.com/v1/me");
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.userLoadingStatus = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.userLoadingStatus = "idle";
        console.log(action.payload);
        state.display_name = action.payload.display_name;
        state.id = action.payload.id;
        state.images = action.payload.images;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.userLoadingStatus = "error";
      });
  },
});

export default userSlice.reducer;
