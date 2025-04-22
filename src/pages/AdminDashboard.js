import React, { useState } from "react";
import StrokeModeApp     from "../StrokeModeApp";
import AGMForBallModeApp from "../AGMForBallModeApp";

const AdminDashboard = () => {
  // mode: "stroke" 또는 "agm"
  const [mode, setMode] = useState("stroke");

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ marginBottom: "20px" }}>관리자 대시보드</h2>

      {/* ─── mode 토글 버튼 ─── */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setMode("stroke")}
          style={{
            padding:     "10px 20px",
            marginRight: "10px",
            background:  mode === "stroke" ? "#4CAF50" : "#ccc",
            color:       mode === "stroke" ? "#fff" : "#000",
            border:      "none",
            cursor:     "pointer",
          }}
        >
          스트로크 방식
        </button>
        <button
          onClick={() => setMode("agm")}
          style={{
            padding:    "10px 20px",
            background: mode === "agm" ? "#4CAF50" : "#ccc",
            color:      mode === "agm" ? "#fff" : "#000",
            border:     "none",
            cursor:     "pointer",
          }}
        >
          AGM 포볼 방식
        </button>
      </div>

      {/*
        key={mode} 를 주면 mode가 바뀔 때마다 (그리고
        첫 마운트 시에도) 내부가 깨끗이 다시 마운트됩니다.
      */}
      <div key={mode}>
        {mode === "stroke" && <StrokeModeApp />}
        {mode === "agm"    && <AGMForBallModeApp />}
      </div>
    </div>
  );
};

export default AdminDashboard;
