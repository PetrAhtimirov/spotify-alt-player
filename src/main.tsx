import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router";
import './index.css';
import App from './App.tsx';
import AuthProvider from "./hooks/AuthProvider.tsx";
import PrivateRoute from "./PrivateRoute.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<PrivateRoute/>}>
                        <Route path="/" element={<App/>}/>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
