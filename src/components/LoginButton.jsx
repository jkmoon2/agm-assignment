// src/components/LoginButton.jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <button onClick={() => loginWithRedirect()}>
      로그인 / 가입
    </button>
  );
};

export default LoginButton;
