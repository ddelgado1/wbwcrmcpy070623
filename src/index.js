import React from 'react';
import {lazy, Suspense} from 'react';
import { createRoot } from "react-dom/client";
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import  store  from './store.js';
import "bootstrap/dist/css/bootstrap.min.css";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

const App = lazy(() => import('./App'));


const msalInstance = new PublicClientApplication(msalConfig);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
    <Provider store={store} >
        <Suspense fallback={<span>Loading...</span>}>
        <MsalProvider instance={msalInstance}>
            <BrowserRouter>
              <Routes>
                  <Route path="*" element={<App />} />
              </Routes>
            </BrowserRouter>
          </MsalProvider>
        </Suspense>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// initMessageListener(store);
