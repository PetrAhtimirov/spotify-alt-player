import React, { useEffect, useState } from "react";
import hash from "../hash.ts";
import { useNavigate, useLocation } from "react-router";
import ErrorMessage from "../features/errorMessage/ErrorMessage.tsx";


export const authEndpoint = "https://accounts.spotify.com/authorize";

const clientId = "af0806fba6794a048e07b2d6955471b2";
const redirectUri = "http://localhost:3000/preview";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
];

const Preview: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const errorCode = searchParams.get("error");
    if (errorCode) setError(errorCode);
  }, []);

  useEffect(() => {
    const _token = (hash as { access_token?: string }).access_token;

    if (_token) {
      setToken(_token);
      localStorage.setItem("access_token", _token);
      navigate("/");
    }
  }, [navigate]);


  return (
    <div className="preview">
      {error !== null ? <ErrorMessage code={error} /> : null}
      <header className="App-header">
        {!token ? (
          <a
            className="btn btn--loginApp-link"
            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
              "%20"
            )}&response_type=token&show_dialog=true`}
          >
            Login to Spotify
          </a>
        ) : (
          <p>Token: {token}</p>
        )}
      </header>
    </div>
  );
};

export default Preview;
