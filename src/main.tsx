import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router';
import PreviewPage from "./PreviewPage.tsx";
import {Provider} from 'react-redux';
import {store} from './store.ts';
import App from "./App.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/preview" element={<PreviewPage/>}/>
          <Route path="/" element={<App/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
