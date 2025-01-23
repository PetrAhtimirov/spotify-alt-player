import {ReactNode} from "react";

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface AuthContextType {
    spotifyToken: string | null;
    loginWithSpotify: () => Promise<void>;
    logOut: () => void;
}


export interface LoginData {
    email: string;
    password: string;
}

export interface AuthProviderProps {
    children: ReactNode;
}