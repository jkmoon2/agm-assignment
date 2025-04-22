// src/components/ControlPanel.jsx
import React from 'react';

export function ControlPanel({
  roomCount,
  onRoomCountChange,
  uploadKey,
  onExcelUpload,
  onAutoAssign,
  onClear
}) {
  return (
    <div style={{ marginBottom: 10, fontSize: '18px' }}>
      {/* 방 개수 설정 */}
      <label>방 개수: </label>
      <input
        type="number"
        min="1"
        max="10"
        value={roomCount}
        onChange={e => onRoomCountChange(Number(e.target.value))}
        style={{ width: 50, marginLeft: 6 }}
      />

      {/* 엑셀 업로드 */}
      <input
        key={uploadKey}
        type="file"
        accept=".xlsx"
        onChange={onExcelUpload}
        style={{ marginLeft: 10 }}
      />

      {/* 자동배정 / 클리어 */}
      <button onClick={onAutoAssign} style={{ marginLeft: 10, fontSize: '16px' }}>
        자동배정
      </button>
      <button onClick={onClear} style={{ marginLeft: 10, fontSize: '16px' }}>
        클리어
      </button>
    </div>
  );
}
