import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {useHttp} from "../../hooks/http.hook.ts";

export interface PlaybackState {
  playbackLoadingStatus: "loading" | "idle" | "error";
  id: string;
  is_active: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
  supports_volume: boolean;
  is_playing: boolean;
}

const initialState: PlaybackState = {
  playbackLoadingStatus: "idle",
  id: "",
  is_active: false,
  is_restricted: true,
  name: "",
  type: "",
  volume_percent: 0,
  supports_volume: false,
  is_playing: false,
};

export const fetchPlayback = createAsyncThunk("playback/fetchPlayback", async (_, { rejectWithValue }) => {
  try {
    const {request} = useHttp();
    const data = await request("https://api.spotify.com/v1/me/player");
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

const playbackSlice = createSlice({
  name: "playback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayback.pending, (state) => {
        state.playbackLoadingStatus = "loading";
      })
      .addCase(fetchPlayback.fulfilled, (state, action) => {
        state.playbackLoadingStatus = "idle";
        state.id = action.payload.id;
        state.is_active = action.payload.is_active;
        state.is_restricted = action.payload.is_restricted;
        state.name = action.payload.name;
        state.type = action.payload.type;
        state.volume_percent = action.payload.volume_percent;
        state.supports_volume = action.payload.supports_volume;
        state.is_playing = action.payload.is_playing;
      })
      .addCase(fetchPlayback.rejected, (state) => {
        state.playbackLoadingStatus = "error";
      });
  },
});

export default playbackSlice.reducer;
