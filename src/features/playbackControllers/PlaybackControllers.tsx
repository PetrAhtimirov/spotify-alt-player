import nextIcon from "../../../assets/icons/next.svg";
import pauseIcon from "../../../assets/icons/pause.svg";
import playIcon from "../../../assets/icons/play.svg";
import {
  fetchPlayback,
  fetchPlaybackNext,
  fetchPlaybackPause,
  fetchPlaybackPlay,
  fetchPlaybackPrev
} from "../playback/playbackSlice.ts";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store.ts";
import {useEffect} from "react";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const PlaybackControllers = () => {
  const {is_playing} = useTypedSelector((state) => state.playback);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchPlayback());
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const onPlayPause = async () => {
    if (is_playing) dispatch(fetchPlaybackPause())
    else dispatch(fetchPlaybackPlay())
  }

  const onNext = async () => {
    await dispatch(fetchPlaybackNext());
    dispatch(fetchPlayback());
  }

  const onPrev = async () => {
    await dispatch(fetchPlaybackPrev());
    dispatch(fetchPlayback());
  }

  return (
    <div className="playback_controllers">
      <button className="playback__prev" onClick={onPrev}>
        <img src={nextIcon} className="playback__prev_icon" alt=""/>
      </button>
      <button className="playback__pause" onClick={onPlayPause}>
        {is_playing ? (
          <img src={pauseIcon} className="playback__pause_icon" alt="Pause"/>
        ) : (
          <img src={playIcon} className="playback__pause_icon" alt="Play"/>
        )}
      </button>
      <button className="playback__next" onClick={onNext}>
        <img src={nextIcon} className="playback__next_icon" alt=""/>
      </button>
    </div>
  )
}

export default PlaybackControllers;