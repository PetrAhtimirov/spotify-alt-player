import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContextType, AuthProviderProps } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [spotifyToken, setSpotifyToken] = useState<string | null>(localStorage.getItem("spotifyToken") || null);
    const navigate = useNavigate();

    const loginWithSpotify = async () => {
        const generateRandomString = (length: number) => {
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const values = crypto.getRandomValues(new Uint8Array(length));
            return values.reduce((acc, x) => acc + possible[x % possible.length], "");
        };

        const sha256 = async (plain: string) => {
            const encoder = new TextEncoder();
            const data = encoder.encode(plain);
            return window.crypto.subtle.digest("SHA-256", data);
        };

        const base64encode = (input: ArrayBuffer) => {
            return btoa(String.fromCharCode(...new Uint8Array(input)))
                .replace(/=/g, "")
                .replace(/\+/g, "-")
                .replace(/\//g, "_");
        };

        const codeVerifier = generateRandomString(64);
        const hashed = await sha256(codeVerifier);
        const codeChallenge = base64encode(hashed);

        localStorage.setItem("code_verifier", codeVerifier);

        const clientId = "af0806fba6794a048e07b2d6955471b2";
        const redirectUri = "http://localhost:3000";
        const scope = "user-read-private user-read-email";

        const authUrl = new URL("https://accounts.spotify.com/authorize");
        const params = {
            response_type: "code",
            client_id: clientId,
            scope,
            code_challenge_method: "S256",
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
        };

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    };

    const fetchSpotifyToken = async (code: string) => {
        const codeVerifier = localStorage.getItem("code_verifier");
        const url = "https://accounts.spotify.com/api/token";

        const payload = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: "YOUR_CLIENT_ID",
                grant_type: "authorization_code",
                code,
                redirect_uri: "http://localhost:3000",
                code_verifier: codeVerifier!,
            }),
        };

        try {
            const response = await fetch(url, payload);
            const data = await response.json();

            if (data.access_token) {
                setSpotifyToken(data.access_token);
                localStorage.setItem("spotifyToken", data.access_token);
                navigate("/dashboard"); // Перенаправляем после успешной авторизации
            } else {
                throw new Error("Failed to fetch Spotify token");
            }
        } catch (error) {
            console.error("Error fetching Spotify token:", error);
        }
    };

    // Проверяем наличие `code` в URL при загрузке страницы
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        if (code) {
            fetchSpotifyToken(code);
        }
    }, []);

    const logOut = (): void => {
        setSpotifyToken(null);
        localStorage.removeItem("spotifyToken");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ spotifyToken, loginWithSpotify, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
