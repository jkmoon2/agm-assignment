/* eslint-disable no-unused-vars */
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { isAuthenticated, user } = useAuth0();
  if (!isAuthenticated) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img
        src={user.picture}
        alt={user.name}
        style={{ width: "40px", borderRadius: "50%" }}
      />
      <div>
        <strong>{user.name}</strong>
        <br />
        <small>{user.email}</small>
      </div>
    </div>
  );
};

export default Profile;
