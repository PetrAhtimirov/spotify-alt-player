import {useEffect, useRef, useState} from "react";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {fetchPlaybackDevice, fetchPlaybackDeviceSelect} from "../slices/playbackDevice.ts";
import {AppDispatch, RootState} from "../store.ts";
import deviceIcon from "../../assets/icons/device.svg";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const PlaybackDevice = () => {
  const {devices, playbackDeviceLoadingStatus} = useTypedSelector((state) => state.playbackDevice);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchPlaybackDevice());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const onSelect = async (deviceId: string) => {
    dispatch(fetchPlaybackDeviceSelect(deviceId));
  };

  return (
    <div className="playback_device__wrapper">
      <button ref={buttonRef} className="playback_device__preview" onClick={() => setIsOpen((prev) => !prev)}>
        <img src={deviceIcon} alt="playback device" className="playback_device__icon"/>
      </button>
      <div ref={menuRef} className={`playback_device__menu ${isOpen ? "open" : ""}`}>
        <span className="playback_device__header">Available devices:</span>
        <ul className={`playback_device__menu__list`}>
          {playbackDeviceLoadingStatus === "loading" ? (
            <>
              <li className="playback_device__loading"></li>
            </>
          ) : (devices.map((device) => (
            <li key={device.id}>
              <button className={`playback_device__button ${device.is_active ? "active" : ""}`}
                      onClick={() => onSelect(device.id)}>
                <div className="playback_device__button__point"></div>
                {device.name}
              </button>
            </li>
          )))
          }
        </ul>
      </div>
    </div>
  );
};

export default PlaybackDevice;
