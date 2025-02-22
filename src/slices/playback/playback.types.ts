export type PlaybackLoadingStatus = "loading" | "idle" | "error";

export interface PlaybackDevice {
  id: string;
  is_active: boolean;
  is_restricted: boolean;
  is_private_session: boolean;
  name: string;
  type: string;
  volume_percent: number;
  supports_volume: boolean;
}

export interface PlaybackAlbumImage {
  url: string;
  height: number;
  width: number;
}

export interface PlaybackArtist {
  external_urls: { spotify: string };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface PlaybackAlbum {
  images: PlaybackAlbumImage[];
}

export interface PlaybackItem {
  id: string;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
  album: PlaybackAlbum;
  artists: PlaybackArtist[];
  is_saved: null | boolean;
  duration_ms: number;
}

export interface PlaybackActions {
  interrupting_playback: boolean;
  pausing: boolean;
  resuming: boolean;
  seeking: boolean;
  skipping_next: boolean;
  skipping_prev: boolean;
  toggling_repeat_context: boolean;
  toggling_shuffle: boolean;
  toggling_repeat_track: boolean;
  transferring_playback: boolean;
}

export interface PlaybackState {
  playbackLoadingStatus: PlaybackLoadingStatus;
  device: PlaybackDevice;
  item: PlaybackItem;
  actions: PlaybackActions;
  progress_ms: number;
  is_playing: boolean;
}
