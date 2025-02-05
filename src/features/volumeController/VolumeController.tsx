import { useState, useRef, useEffect, useCallback } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store.ts";
import { fetchPlaybackSetVolume } from "../playback/playbackSlice.ts";
import volumeMaxIcon from "../../../assets/icons/volume_max.svg";
import volumeMinIcon from "../../../assets/icons/volume_min.svg";
import volumeXmarkIcon from "../../../assets/icons/volume_xmark.svg";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const VolumeController = () => {
  const { volume_percent } = useTypedSelector((state) => state.playback.device);
  const dispatch = useDispatch<AppDispatch>();
  const rangeInputRef = useRef<HTMLInputElement | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [localVolume, setLocalVolume] = useState(volume_percent);

  const updateTrackStyle = useCallback(() => {
    const rangeInput = rangeInputRef.current;
    if (!rangeInput) return;

    const value =
      ((localVolume - Number(rangeInput.min)) /
        (Number(rangeInput.max) - Number(rangeInput.min))) *
      100;

    rangeInput.style.setProperty("--progress", `${value}%`);
  }, [localVolume]);

  useEffect(() => {
    setLocalVolume(volume_percent);
  }, [volume_percent]);

  useEffect(() => {
    const rangeInput = rangeInputRef.current;
    if (!rangeInput) return;

    rangeInput.addEventListener("input", updateTrackStyle);
    updateTrackStyle();

    return () => {
      rangeInput.removeEventListener("input", updateTrackStyle);
    };
  }, [updateTrackStyle]);

  const onChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setLocalVolume(newVolume);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      dispatch(fetchPlaybackSetVolume(newVolume));
    }, 200);
  };

  const onMuteUnmute = () => {
    if (localVolume === 0) {
      setLocalVolume(50);
      dispatch(fetchPlaybackSetVolume(50))
    } else {
      setLocalVolume(0);
      dispatch(fetchPlaybackSetVolume(0))
    }
  }

  return (
    <div className="volume_controller">
      <button className="volume_controller__mute" onClick={onMuteUnmute}>
        <img
          src={localVolume === 0 ? volumeXmarkIcon : localVolume < 50 ? volumeMinIcon : volumeMaxIcon}
          alt="Volume Icon"
          className="volume_controller__icon"
        />
      </button>
      <input
        type="range"
        className="volume_controller__range"
        id="volume"
        name="volume"
        min="0"
        max="100"
        ref={rangeInputRef}
        value={localVolume}
        onChange={onChangeVolume}
      />
    </div>
  );
};

export default VolumeController;
