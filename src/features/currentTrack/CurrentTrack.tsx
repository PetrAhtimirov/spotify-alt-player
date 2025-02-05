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
          {item.artists.map(artist => (
            <span className="artist_item" key={artist.id}>{artist.name}</span>
          ))}
        </div>
      </div>
    ) : (
      <span>loading</span>)
  )
}

export default CurrentTrack;