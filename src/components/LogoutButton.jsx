/* eslint-disable no-unused-vars */
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() =>
        logout({
          // 로그아웃 후 무조건 /admin 으로 돌아가도록
          returnTo: `${window.location.origin}/admin`,
          federated: true
        })
      }
      style={{
        fontSize: 14,
        padding: "6px 12px",
        cursor: "pointer"
      }}
    >
      로그아웃
    </button>
  );
};

export default LogoutButton;
