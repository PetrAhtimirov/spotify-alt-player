import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store.ts";
import plusCircleIcon from "../../assets/icons/plus_circle.svg";
import checkCircleSolidIcon from "../../assets/icons/check_circle_solid.svg";
import {useEffect, useRef, useState} from "react";
import {fetchCheckSaveTrack, fetchRemoveTrack, fetchSaveTrack} from "../slices/playback.ts";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const CurrentTrack = () => {
  const {item} = useTypedSelector((state) => state.playback);
  const dispatch = useDispatch<AppDispatch>();
  const trackNameRef = useRef<HTMLSpanElement>(null);
  const [trackScrolling, setTrackScrolling] = useState(false);

  useEffect(() => {
    if (item.id) dispatch(fetchCheckSaveTrack([item.id]));
  }, [item.id])

  useEffect(() => {
    if (trackNameRef.current) {
      const textWidth = trackNameRef.current.scrollWidth;
      const containerWidth = trackNameRef.current.clientWidth;
      setTrackScrolling(textWidth > containerWidth);
    }
  }, [item])

  const onSaveRemove = () => {
    if (item.is_saved) dispatch(fetchRemoveTrack([item.id]))
    else dispatch(fetchSaveTrack([item.id]));
  }

  return (
    item && item.id !== "" ? (
      <div className="playback_current_track">
        <img src={item.album.images[1].url} alt="" className="current_track__image"/>
        <div className="current_track__info">
          <span
            className={`track_name ${trackScrolling ? "scrolling" : ""}`}
            ref={trackNameRef}>
            {item.name}
          </span>
          <div className="artists_list">
            {item.artists.map((artist) => (
              <span className="artist_item" key={artist.id}>{artist.name}</span>
            ))}
          </div>
        </div>
        {item.is_saved !== null ?
          <button className="current_track__save" onClick={onSaveRemove}>
            {item.is_saved ? (
              <img src={checkCircleSolidIcon} alt="" className="current_track__save__image saved"/>
            ) : (
              <img src={plusCircleIcon} alt="" className="current_track__save__image"/>
            )}
          </button>
          : null}
      </div>
    ) : (
      <div className="playback_current_track loading">
        <div className="first"></div>
        <div className="current_track__info">
          <div className="second"></div>
          <div className="third"></div>
        </div>
      </div>
    )
  )
}

export default CurrentTrack;