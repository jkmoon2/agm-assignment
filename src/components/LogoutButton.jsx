/* eslint-disable no-unused-vars */
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({
      returnTo: window.location.origin,
      federated: true
    })}>
      로그아웃
    </button>
  );
};

export default LogoutButton;
