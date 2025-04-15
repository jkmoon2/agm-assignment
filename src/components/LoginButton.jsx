/* eslint-disable no-unused-vars */
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  // 항상 로그인 창 표시 (SSO 남아도 새 로그인 폼)
  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        prompt: "login",
        max_age: 0
      }
    });
  };

  return <button onClick={handleLogin}>로그인 / 가입</button>;
};

export default LoginButton;
