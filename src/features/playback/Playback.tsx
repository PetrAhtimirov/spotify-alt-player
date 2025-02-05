import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store.ts";
import {useEffect, useState} from "react";
import PlaybackDevice from "../playbackDevice/PlaybackDevice.tsx";
import PlaybackControllers from "../playbackControllers/PlaybackControllers.tsx";
import CurrentTrack from "../currentTrack/CurrentTrack.tsx";
import {fetchPlaybackDevice} from "../playbackDevice/playbackDeviceSlice.ts";
import VolumeController from "../volumeController/VolumeController.tsx";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const Playback = () => {
  const {devices} = useTypedSelector((state) => state.playbackDevice);
  const [firstLoad, setFirstLoad] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchPlaybackDevice())
      .then(() => setFirstLoad(false));
  }, []);

  return (
    firstLoad ? (
      <div className="app__player__loading"></div>
    ) : (
      <div className="app__player">
        {devices.length === 0 ? (
          <div className="app__player__empty">
            <span>No devices</span>
          </div>
        ) : (
          <div className="app__player__inner">
            <CurrentTrack/>
            <div className="playback_controllers__wrapper">
              <PlaybackControllers/>
            </div>
            <div className="playback_settings">
              <PlaybackDevice/>
              <VolumeController/>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default Playback;
