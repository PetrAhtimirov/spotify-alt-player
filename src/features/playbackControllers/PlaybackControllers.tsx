import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store.ts";
import { useEffect, useState } from "react";
import { fetchPlayback } from "./playbackSlice.ts";
import pauseIcon from "../../../assets/icons/pause.svg";
import playIcon from "../../../assets/icons/play.svg";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const PlaybackControllers = () => {
  const [firstLoad, setFirstLoad] = useState(true);
  const { is_playing } = useTypedSelector((state) => state.playback);
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
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, firstLoad]);

  return (
    <>
      {firstLoad ? (
        <div className="playback_controllers__wrapper is_loading"></div>
      ) : (
        <div className="playback_controllers__wrapper">
          <div className="playback_controllers">
            <button className="playback__pause">
              {is_playing ? (
                <img src={pauseIcon} className="playback__pause_icon" alt="Pause" />
              ) : (
                <img src={playIcon} className="playback__pause_icon" alt="Play" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaybackControllers;
