import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {useHttp} from "../../hooks/http.hook.ts";
import {RootState} from "../../store.ts";
import {fetchPlaybackDeviceSelect} from "../playbackDevice.ts";
import {PlaybackState} from "./playback.types.ts";

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
    artists: [],
    is_saved: null,
    duration_ms: 0,
  },
  progress_ms: 0,
  is_playing: false,
  actions: {
    interrupting_playback: false,
    pausing: false,
    resuming: false,
    seeking: false,
    skipping_next: false,
    skipping_prev: false,
    toggling_repeat_context: false,
    toggling_shuffle: false,
    toggling_repeat_track: false,
    transferring_playback: false
  }
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
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchPlaybackSetVolume = createAsyncThunk(
  "playback/fetchPlaybackSetVolume",
  async (volume: number, {getState, rejectWithValue}) => {
    try {
      const {request} = useHttp();
      const state = getState() as RootState;
      const deviceId = state.playback.device.id;

      await request(`https://api.spotify.com/v1/me/player/volume?device_id=${deviceId}&volume_percent=${volume}`, "PUT", false);
      return volume;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchCheckSaveTrack = createAsyncThunk(
  "playback/fetchCheckSaveTrack",
  async (ids: string[], {rejectWithValue}) => {
    try {
      const {request} = useHttp();
      const data = await request(`https://api.spotify.com/v1/me/tracks/contains?ids=${ids}`);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  });

export const fetchSaveTrack = createAsyncThunk(
  "playback/fetchSaveTrack",
  async (ids: string[], {rejectWithValue}) => {
    try {
      const {request} = useHttp();
      const data = await request(`https://api.spotify.com/v1/me/tracks?ids=${ids}`, "PUT", false);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  });

export const fetchRemoveTrack = createAsyncThunk(
  "playback/fetchRemoveTrack",
  async (ids: string[], {rejectWithValue}) => {
    try {
      const {request} = useHttp();
      const data = await request(`https://api.spotify.com/v1/me/tracks?ids=${ids}`, "DELETE", false);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  });


const playback = createSlice({
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
          state.item = {...action.payload.item, is_saved: state.item.is_saved};
          state.is_playing = action.payload.is_playing;
          state.progress_ms = action.payload.progress_ms;
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
      })
      .addCase(fetchPlaybackSetVolume.fulfilled, (state, action) => {
        state.device.volume_percent = action.payload;
      })
      .addCase(fetchCheckSaveTrack.fulfilled, (state, action) => {
        state.item.is_saved = action.payload[0];
      })
      .addCase(fetchSaveTrack.fulfilled, (state) => {
        state.item.is_saved = true;
      })
      .addCase(fetchRemoveTrack.fulfilled, (state) => {
        state.item.is_saved = false;
      });
  },
});

export const {pauseChanged} = playback.actions;
export default playback.reducer;
