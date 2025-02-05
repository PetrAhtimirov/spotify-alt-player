import {TypedUseSelectorHook, useSelector} from "react-redux";
import {RootState} from "../../store.ts";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const CurrentTrack = () => {
  const {item} = useTypedSelector((state) => state.playback);
  return (
    item && item.id !== "" ? (
      <div className="playback_current_track">
        <img src={item.album.images[1].url} alt="" className="current_track__image"/>
        <div className="current_track__info">
          {item.name}
          <div className="artists_list">
            {item.artists.map((artist) => (
              <span className="artist_item" key={artist.id}>{artist.name}</span>
            ))}
          </div>
        </div>
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