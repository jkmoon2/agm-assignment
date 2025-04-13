// src/pages/AdminDashboard.js
import React from "react";
import { useNavigate, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // 드롭다운에서 스트로크/AGM포볼 선택
  const handleModeChange = (e) => {
    const val = e.target.value;
    if (val === "stroke") {
      navigate("stroke"); // /admin/stroke 로 이동
    } else if (val === "agm") {
      navigate("agm");    // /admin/agm 로 이동
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>관리자 대시보드</h1>

      {/* 모드 선택 드롭다운 */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10 }}>모드 선택: </label>
        <select onChange={handleModeChange} defaultValue="">
          <option value="">-- 선택 --</option>
          <option value="stroke">스트로크 모드</option>
          <option value="agm">AGM포볼 모드</option>
        </select>
      </div>

      {/* 하위 라우트 (StrokeModeApp 또는 AGMForBallModeApp) */}
      <Outlet />
    </div>
  );
};

export default AdminDashboard;
