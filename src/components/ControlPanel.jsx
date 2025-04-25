// src/components/ControlPanel.jsx

import React from "react";

export function ControlPanel({
  roomCount,
  onRoomCountChange,
  uploadKey,
  onExcelUpload,
  onAutoAssign,
  onClear
}) {
  return (
    <div className="control-panel">
      <label>방 개수:</label>
      <input
        type="number"
        min={1}
        max={10}
        value={roomCount}
        onChange={e => onRoomCountChange(Number(e.target.value))}
      />
      <input
        key={uploadKey}
        type="file"
        accept=".xlsx"
        onChange={onExcelUpload}
      />
      <button onClick={onAutoAssign}>자동배정</button>
      <button onClick={onClear}>클리어</button>
    </div>
  );
}
