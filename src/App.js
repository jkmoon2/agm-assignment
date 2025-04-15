/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

// 관리자 대시보드
import AdminDashboard from "./pages/AdminDashboard";

// Auth0 관련 컴포넌트
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const { isAuthenticated, user } = useAuth0();

  // 관리자 이메일
  const adminEmail = "moonddol3412@msn.com";
  const isAdmin = isAuthenticated && user && user.email === adminEmail;

  return (
    <Router>
      <div style={{ padding: 20 }}>
        {/* 상단 헤더: 오직 우측에 로그인/로그아웃 + 프로필 */}
        <header style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "20px" }}>
          <Profile />
          <div style={{ marginLeft: 10 }}>
            {!isAuthenticated && <LoginButton />}
            {isAuthenticated && <LogoutButton />}
          </div>
        </header>

        {/* 관리자라면 "Admin Dashboard" 링크 우측 상단 표시 */}
        {isAuthenticated && isAdmin && (
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <Link to="/admin" style={{ fontSize: "16px" }}>
              Admin Dashboard
            </Link>
          </div>
        )}

        <Routes>
          {/* 관리자 대시보드 (PrivateRoute) */}
          <Route
            path="/admin"
            element={
              <PrivateRoute adminRequired={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          {/* 홈 화면: 중앙 정렬 */}
          <Route
            path="/"
            element={
              <div style={{ textAlign: "center" }}>
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
