/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
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
  const { isAuthenticated, user } = useAuth0();

  // 관리자 이메일이 아래와 같으면 관리자임
  const adminEmail = "moonddol3412@msn.com";
  const isAdmin = isAuthenticated && user && user.email === adminEmail;

  return (
    <Router>
      {/* 전체 컨테이너에 padding과 중앙 정렬 적용 */}
      <div style={{ padding: 20, textAlign: "center" }}>
        {/* 상단 헤더 - 우측 정렬 (프로필 및 로그인/로그아웃 버튼) */}
        <header
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "20px"
          }}
        >
          <Profile />
          <div style={{ marginLeft: 10 }}>
            {!isAuthenticated && <LoginButton />}
            {isAuthenticated && <LogoutButton />}
          </div>
        </header>

        {/* 관리자 로그인시 관리자 대시보드 링크 (우측 상단에 표시) */}
        {isAuthenticated && isAdmin && (
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <Link to="/admin" style={{ fontSize: "16px", textDecoration: "none" }}>
              Admin Dashboard
            </Link>
          </div>
        )}

        <Routes>
          {/* 관리자 대시보드: 관리자만 접근할 수 있도록 PrivateRoute 적용 */}
          <Route
            path="/admin"
            element={
              <PrivateRoute adminRequired={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          {/* 기본 홈 화면: 중앙 정렬된 콘텐츠 */}
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
