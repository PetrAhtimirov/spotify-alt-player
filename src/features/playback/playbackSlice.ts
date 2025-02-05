import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {useHttp} from "../../hooks/http.hook.ts";
import {RootState} from "../../store.ts";
import {fetchPlaybackDeviceSelect} from "../playbackDevice/playbackDeviceSlice.ts";

export interface PlaybackState {
  playbackLoadingStatus: "loading" | "idle" | "error";
  device: {
    id: string;
    is_active: boolean;
    is_restricted: boolean;
    is_private_session: boolean;
    name: string;
    type: string;
    volume_percent: number;
    supports_volume: boolean;
  };
  item: {
    id: string;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
    album: {
      images: {
        url: string;
        height: number;
        width: number;
      }[];
    },
    artists: {
      external_urls: {spotify: string},
      href: string,
      id: string,
      name: string,
      type: string,
      uri: string
    }[]
  }
  is_playing: boolean;
}

const initialState: PlaybackState = {
  playbackLoadingStatus: "idle",
  device: {
    id: "",
    is_active: false,
    is_restricted: true,
    is_private_session: false,
    name: "",
    type: "",
    volume_percent: 0,
    supports_volume: false,
  },
  item: {
    id: "",
    name: "",
    popularity: 0,
    preview_url: "",
    track_number: 0,
    type: "",
    uri: "",
    is_local: false,
    album: {
      images: [],
    },
    artists: []
  },
  is_playing: false,
};

export const fetchPlayback = createAsyncThunk(
  "playback/fetchPlayback",
  async (_, {getState, dispatch, rejectWithValue}) => {
    try {
      const {request} = useHttp();
      const state = getState() as RootState;
      const activeDeviceId = state.playbackDevice.activeDeviceId;

      if (!activeDeviceId) {
        const firstDevice = state.playbackDevice.devices[0];
        if (firstDevice) {
          await dispatch(fetchPlaybackDeviceSelect(firstDevice.id));
        } else {
          return rejectWithValue("No available devices");
        }
      }

      const data = await request("https://api.spotify.com/v1/me/player");

      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);


export const fetchPlaybackPlay = createAsyncThunk(
  "playback/fetchPlaybackPlay",
  async (_, {getState, rejectWithValue}) => {
    try {
      const {request} = useHttp();
      const state = getState() as RootState;
      const deviceId = state.playback.device.id;

      await request(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, "PUT", false);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchPlaybackPause = createAsyncThunk(
  "playback/fetchPlaybackPause",
  async (_, {getState, rejectWithValue}) => {
    try {
      const {request} = useHttp();
      const state = getState() as RootState;
      const deviceId = state.playback.device.id;

      await request(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, "PUT", false);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchPlaybackNext = createAsyncThunk(
  "playback/fetchPlaybackNext",
  async (_, {getState, rejectWithValue}) => {
    try {
      const {request} = useHttp();
      const state = getState() as RootState;
      const deviceId = state.playback.device.id;

      await request(`https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`, "POST", false);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchPlaybackPrev = createAsyncThunk(
  "playback/fetchPlaybackPrev",
  async (_, {getState, rejectWithValue}) => {
    try {
      const {request} = useHttp();
      const state = getState() as RootState;
      const deviceId = state.playback.device.id;

      await request(`https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`, "POST", false);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const playbackSlice = createSlice({
  name: "playback",
  initialState,
  reducers: {
    pauseChanged: (state, action: PayloadAction<boolean>) => {
      state.is_playing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayback.pending, (state) => {
        state.playbackLoadingStatus = "loading";
      })
      .addCase(fetchPlayback.fulfilled, (state, action) => {
        state.playbackLoadingStatus = "idle";
        if (action.payload === null) state.device.id = "";
        else {
          state.device = action.payload.device;
          state.item = action.payload.item;
          state.is_playing = action.payload.is_playing;
        }
      })
      .addCase(fetchPlayback.rejected, (state) => {
        state.playbackLoadingStatus = "error";
      })
      .addCase(fetchPlaybackPause.fulfilled, (state) => {
        state.is_playing = false;
      })
      .addCase(fetchPlaybackPlay.fulfilled, (state) => {
        state.is_playing = true;
      });
  },
});

export const {pauseChanged} = playbackSlice.actions;
export default playbackSlice.reducer;
