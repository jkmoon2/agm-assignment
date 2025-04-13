// src/App.js

import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardCommon from "./pages/AdminDashboardCommon";
import StrokeModeApp from "./StrokeModeApp";
import AGMForBallModeApp from "./AGMForBallModeApp";
import UserPage from "./pages/UserPage";
// Auth0 관련 컴포넌트 (별도로 src/components에 생성)
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <div style={{ padding: 20 }}>
        {/* 상단 내비게이션 (관리자 로그인, 사용자 페이지) */}
        <nav style={{ marginBottom: 20 }}>
          <Link to="/adminlogin" style={{ marginRight: 10 }}>
            관리자 로그인
          </Link>
          <Link to="/user" style={{ marginRight: 10 }}>
            사용자 페이지
          </Link>
        </nav>
        
        {/* Auth0 로그인/로그아웃 및 프로필 영역 */}
        <header
          style={{
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {/* 사용자가 로그인된 경우 프로필 정보 표시 */}
          <Profile />
          <div style={{ marginLeft: 10 }}>
            {/* 사용자가 로그인되지 않은 경우에는 LoginButton, 
                로그인되어 있다면 LogoutButton을 조건부로 렌더링할 수도 있으나,
                여기서는 두 버튼을 모두 보여주는 예시입니다. */}
            <LoginButton />
            <LogoutButton />
          </div>
        </header>
        
        <Routes>
          {/* 관리자 로그인 */}
          <Route path="/adminlogin" element={<AdminLogin />} />

          {/* 관리자 대시보드 (로그인 후 직접 /admin으로 이동) */}
          <Route path="/admin" element={<AdminDashboard />}>
            {/* 하위 라우트들 */}
            <Route path="common" element={<AdminDashboardCommon />} />
            <Route path="stroke" element={<StrokeModeApp />} />
            <Route path="agm" element={<AGMForBallModeApp />} />
            <Route index element={<AdminDashboardCommon />} />
          </Route>

          {/* 사용자 페이지 */}
          <Route path="/user" element={<UserPage />} />

          {/* 기본 라우트 */}
          <Route path="/" element={<div><h1>AGM 프로그램 웹앱</h1></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
