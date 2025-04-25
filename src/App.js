/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import "./App.css";            // App.css 불러오기
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

// 관리자 대시보드 페이지 (관리자 로그인 후 들어갈 페이지)
import AdminDashboard from "./pages/AdminDashboard";

// Auth0 관련 컴포넌트들
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const { isAuthenticated, isLoading, user } = useAuth0();

  // 관리자 이메일이 아래와 같으면 관리자임
  const adminEmail = "moonddol3412@msn.com";
  const isAdmin = isAuthenticated && user && user.email === adminEmail;

  return (
    <Router>
      <div className="container">
        {/* ====== 헤더 ====== */}
        <header className="app-header">
          {/* 좌측: 로그인 후 프로필, 아니면 빈 공간 */}
          <div className="profile">
            {isAuthenticated && <Profile />}
          </div>

          {/* 우측: 로딩 중엔 아무 버튼도 안 보임 → 인증 전엔 로그인 버튼 → 인증 후엔 로그아웃 버튼 */}
          <div className="auth-button">
            {!isLoading && (
              isAuthenticated
                ? <LogoutButton />
                : <LoginButton />
            )}
          </div>
        </header>

        {/* 관리자 전용 링크 (인증 & 관리자일 때만) */}
        {isAuthenticated && isAdmin && (
          <div className="admin-link">
            <Link to="/admin">Admin Dashboard</Link>
          </div>
        )}

        {/* ====== 라우팅 ====== */}
        <Routes>
          {/* 관리자 대시보드: PrivateRoute 로 보호 */}
          <Route
            path="/admin"
            element={
              <PrivateRoute adminRequired={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* 홈 화면 */}
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
