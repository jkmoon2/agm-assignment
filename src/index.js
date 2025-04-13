// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';  // Auth0Provider 추가

// Auth0 설정값 (귀하의 Auth0 도메인 및 Client ID 사용)
const domain = "agm-assignment.us.auth0.com";
const clientId = "yaG9SoaNIV8nvzxTiTMoBaXrLsmKf3Jl";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Auth0Provider로 App을 감싸줍니다. */}
    <Auth0Provider 
      domain={domain} 
      clientId={clientId} 
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
