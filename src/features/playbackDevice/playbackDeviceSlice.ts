import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "../../hooks/http.hook.ts";

export interface PlaybackDeviceState {
  playbackDeviceLoadingStatus: "loading" | "idle" | "error";
  devices: {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number;
    supports_volume: boolean;
  }[]
}

const initialState: PlaybackDeviceState = {
  playbackDeviceLoadingStatus: "idle",
  devices: []
};

export const fetchPlaybackDevice = createAsyncThunk("playback/fetchPlaybackDevice", async (_, {rejectWithValue}) => {
  try {
    const {request} = useHttp();
    const data = await request("https://api.spotify.com/v1/me/player/devices");
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const fetchPlaybackDeviceSelect = createAsyncThunk("playback/fetchPlaybackDeviceSelect", async (deviceId: string, {rejectWithValue}) => {
  try {
    const {request} = useHttp();
    await request(
      "https://api.spotify.com/v1/me/player",
      "PUT",
      false,
      {device_ids: [deviceId]}
    );
    return deviceId;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

const playbackDeviceSlice = createSlice({
  name: "playbackDevice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaybackDevice.pending, (state) => {
        state.playbackDeviceLoadingStatus = "loading";
      })
      .addCase(fetchPlaybackDevice.fulfilled, (state, action) => {
        state.playbackDeviceLoadingStatus = "idle";
        state.devices = action.payload.devices;
      })
      .addCase(fetchPlaybackDevice.rejected, (state) => {
        state.playbackDeviceLoadingStatus = "error";
      })
      .addCase(fetchPlaybackDeviceSelect.fulfilled, (state, action) => {
        state.devices = state.devices.map((device) => ({
          ...device,
          is_active: device.id === action.payload,
        }));
      });
  },
});

export default playbackDeviceSlice.reducer;
