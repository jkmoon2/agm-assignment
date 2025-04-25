import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function App() {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const adminEmail = "moonddol3412@msn.com";
  const isAdmin = isAuthenticated && user?.email === adminEmail;

  return (
    <Router>
      <div className="container">
        <header className="app-header">
          <div className="profile">
            {!isLoading && isAuthenticated && <Profile />}
          </div>
          <div className="auth-button">
            {!isLoading && (isAuthenticated ? <LogoutButton /> : <LoginButton />)}
          </div>
        </header>

        {isAuthenticated && isAdmin && (
          <div className="admin-link">
            <Link to="/admin">Admin Dashboard</Link>
          </div>
        )}

        <Routes>
          <Route
            path="/admin"
            element={
              <PrivateRoute adminRequired={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <div className="home" style={{ textAlign: "center" }}>
                <h1>AGM 프로그램 웹앱</h1>
                <p>오른쪽 상단의 로그인 버튼을 클릭해 주세요.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
