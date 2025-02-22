import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter, Route, Routes} from 'react-router';
import Preview from "./pages/Preview.tsx";
import {Provider} from 'react-redux';
import store from './store';
import App from "./pages/App.tsx";
import './style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path="/preview" element={<Preview/>}/>
          <Route path="/" element={<App/>}/>
        </Routes>
      </HashRouter>
    </Provider>
  </StrictMode>
);
