/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';

// Auth0 설정(도메인, 클라이언트ID)
const domain = "agm-assignment.us.auth0.com";
const clientId = "yaG9SoaNIV8nvzxTiTMoBaXrLsmKf3Jl";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      // 새로고침 시 자동 로그인 방지
      cacheLocation="memory"
      useRefreshTokens={false}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

reportWebVitals();
