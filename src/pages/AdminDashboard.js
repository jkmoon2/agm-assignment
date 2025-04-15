import React, { useState } from "react";
import StrokeModeApp from "../StrokeModeApp";
import AGMForBallModeApp from "../AGMForBallModeApp";

const AdminDashboard = () => {
  const [mode, setMode] = useState("stroke");

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ marginBottom: "20px" }}>관리자 대시보드</h2>
      
      {/* 토글 버튼: 스트로크 or AGM */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setMode("stroke")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: mode === "stroke" ? "#4CAF50" : "#ccc",
            border: "none",
            cursor: "pointer",
            color: mode === "stroke" ? "#fff" : "#000"
          }}
        >
          스트로크 방식
        </button>
        <button
          onClick={() => setMode("agm")}
          style={{
            padding: "10px 20px",
            backgroundColor: mode === "agm" ? "#4CAF50" : "#ccc",
            border: "none",
            cursor: "pointer",
            color: mode === "agm" ? "#fff" : "#000"
          }}
        >
          AGM 포볼 방식
        </button>
      </div>

      {mode === "stroke" && <StrokeModeApp />}
      {mode === "agm" && <AGMForBallModeApp />}
    </div>
  );
};

export default AdminDashboard;
