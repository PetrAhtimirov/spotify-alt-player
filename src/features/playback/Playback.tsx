import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store.ts";
import {useEffect, useState} from "react";
import {fetchPlayback, fetchPlaybackPause, fetchPlaybackPlay} from "./playbackSlice.ts";
import pauseIcon from "../../../assets/icons/pause.svg";
import playIcon from "../../../assets/icons/play.svg";
import nextIcon from "../../../assets/icons/next.svg";
import PlaybackDevice from "../playbackDevice/PlaybackDevice.tsx";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const Playback = () => {
  const [firstLoad, setFirstLoad] = useState(true);
  const {is_playing} = useTypedSelector((state) => state.playback);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      if (firstLoad) {
        await dispatch(fetchPlayback());
        setFirstLoad(false);
      } else {
        dispatch(fetchPlayback());
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, [dispatch, firstLoad]);

  const onPlayPause = async () => {
    if (is_playing) dispatch(fetchPlaybackPause())
    else dispatch(fetchPlaybackPlay())
  }

  return (
    <div className="app__player">
      <div></div>
      {firstLoad ? (
        <div className="playback_controllers__wrapper is_loading"></div>
      ) : (
        <div className="playback_controllers__wrapper">
          <div className="playback_controllers">
            <button className="playback__prev">
              <img src={nextIcon} className="playback__prev_icon" alt=""/>
            </button>
            <button className="playback__pause" onClick={onPlayPause}>
              {is_playing ? (
                <img src={pauseIcon} className="playback__pause_icon" alt="Pause"/>
              ) : (
                <img src={playIcon} className="playback__pause_icon" alt="Play"/>
              )}
            </button>
            <button className="playback__next">
              <img src={nextIcon} className="playback__next_icon" alt=""/>
            </button>
          </div>
        </div>
      )}
      <div className="playback_settings">
        <PlaybackDevice />
      </div>
    </div>
  );
};

export default Playback;
