/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const PrivateRoute = ({ children, adminRequired = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // 관리자 필요 시
  if (adminRequired) {
    const adminEmails = ["moonddol3412@msn.com"];
    if (!adminEmails.includes(user.email)) {
      return <Navigate to="/" />;
    }
  }
  return children;
};

export default PrivateRoute;
