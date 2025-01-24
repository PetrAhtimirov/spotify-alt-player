import React from "react";

interface PlayerProps {
  item: {
    album: {
      images: { url: string }[];
    };
    name: string;
    artists: { name: string }[];
    duration_ms: number;
  };
  is_playing: boolean;
  progress_ms: number;
}

const Player: React.FC<PlayerProps> = (props) => {
  const backgroundStyles = {
    backgroundImage: `url(${props.item.album.images[0]?.url || ""})`,
  };

  const progressBarStyles = {
    width:
      props.item.duration_ms > 0
        ? `${(props.progress_ms * 100) / props.item.duration_ms}%`
        : "0%",
  };

  return (
    <div className="App">
      <div className="main-wrapper">
        <div className="now-playing__img">
          <img
            src={props.item.album.images[0]?.url || ""}
            alt={props.item.name || "No track playing"}
          />
        </div>
        <div className="now-playing__side">
          <div className="now-playing__name">{props.item.name}</div>
          <div className="now-playing__artist">
            {props.item.artists.map((artist: { name: string }) => artist.name).join(", ")}
          </div>
          <div className="now-playing__status">
            {props.is_playing ? "Playing" : "Paused"}
          </div>
          <div className="progress">
            <div className="progress__bar" style={progressBarStyles} />
          </div>
        </div>
        <div className="background" style={backgroundStyles} />
      </div>
    </div>
  );
};

export default Player;
