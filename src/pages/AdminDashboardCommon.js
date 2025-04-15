// src/pages/AdminDashboardCommon.js
import React from "react";
import { Link } from "react-router-dom";

const AdminDashboardCommon = () => {
  return (
    <div>
      <h3>스트로크/AGM 방식 선택</h3>
      <ul>
        <li>
          <Link to="/admin/stroke">스트로크 방식</Link>
        </li>
        <li>
          <Link to="/admin/agm">AGM 포볼 방식</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboardCommon;
