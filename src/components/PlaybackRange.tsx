import {useEffect, useRef} from "react";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {RootState} from "../store.ts";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const PlaybackRange = () => {
  const { duration_ms } = useTypedSelector((state) => state.playback.item);
  const { progress_ms } = useTypedSelector((state) => state.playback);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const rangeInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const rangeInput = rangeInputRef.current;
    if (!rangeInput) return;

    rangeInput.style.setProperty("--progress", `${50}%`);
  }, []);

  return (
    <div className="playback_range__overflow">
      <span className="playback_range__number">
        {formatTime(progress_ms)}
      </span>
      <input
        className="playback_range"
        ref={rangeInputRef}
        type="range"
        id="playback_range"
        name="playback_range"
        min="0"
        max="100"
      />
      <span className="playback_range__number">
        {formatTime(duration_ms)}
      </span>
    </div>
  );
};

export default PlaybackRange;