import { Component } from "react";
import hash from "./hash";
import Player from "./Player";

export const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI, and desired scopes
const clientId = "af0806fba6794a048e07b2d6955471b2";
const redirectUri = "http://localhost:3000";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
];

interface AppState {
  token: string | null;
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

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      token: null,
      item: {
        album: {
          images: [{ url: "" }],
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms: 0,
      },
      is_playing: false,
      progress_ms: 0,
    };
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
  }

  getCurrentlyPlaying(token: string) {
    // Fetch currently playing track
    fetch("https://api.spotify.com/v1/me/player", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.item) {
          this.setState({
            item: data.item,
            is_playing: data.is_playing,
            progress_ms: data.progress_ms,
          });
        }
      })
      .catch((error) =>
        console.error("Error fetching currently playing track:", error)
      );
  }

  componentDidMount() {
    // Extract token from URL hash
    const _token = (hash as { access_token: string }).access_token;

    if (_token) {
      this.setState({ token: _token });
      this.getCurrentlyPlaying(_token);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {!this.state.token ? (
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          ) : (
            <Player
              item={this.state.item}
              is_playing={this.state.is_playing}
              progress_ms={this.state.progress_ms}
            />
          )}
        </header>
      </div>
    );
  }
}

export default App;
