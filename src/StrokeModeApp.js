// src/StrokeModeApp.js

/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

// 분리된 컴포넌트들
import { ControlPanel } from './components/ControlPanel';


// 공통 스타일 & 헬퍼 함수 import
import {
  tableContainerStyle,
  tableStyle,
  baseCellStyle,
  headerStyle,
  footerStyle,
  colWidths
} from './utils/styles';
import {
  toNumberSafe,
  fitFontSize,
  displayGhandi
} from './utils/helpers';

// ==============================================
// [6] RoomAllocationTable
// ==============================================
function RoomAllocationTable({ rooms, roomLabels, hiddenRooms }) {
  const allRooms = Array.from({ length: roomLabels.length }, (_, i) => String(i));
  const rowCount = 4;
  const roomNumbers = allRooms.filter(room => !hiddenRooms[room]);

  // 각 방의 G핸디 합계 계산
  const roomHandySum = {};
  roomNumbers.forEach(room => {
    const arr = rooms[room] || [];
    let sum = 0;
    for (let i = 0; i < rowCount; i++) {
      const p = arr[i];
      if (p && p.ghandi !== "") sum += Number(p.ghandi);
    }
    roomHandySum[room] = sum;
  });

  return (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {roomNumbers.map(room => (
              <th
                key={room}
                colSpan={2}
                style={{ ...headerStyle, width: colWidths.nickname + colWidths.small }}
              >
                {roomLabels[Number(room)]}
              </th>
            ))}
          </tr>
          <tr>
            {roomNumbers.map(room => (
              <React.Fragment key={room}>
                <th style={{ ...headerStyle, width: colWidths.nickname }}>닉네임</th>
                <th style={{ ...headerStyle, width: colWidths.small }}>G핸디</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {roomNumbers.map(room => {
                const p = rooms[room]?.[rowIndex];
                return (
                  <React.Fragment key={`${room}-${rowIndex}`}>
                    <td
                      style={{
                        ...baseCellStyle,
                        ...fitFontSize(p?.name || "", 6, 18, 14),
                        width: colWidths.nickname,
                      }}
                    >
                      {p?.name || ""}
                    </td>
                    <td style={{ ...baseCellStyle, width: colWidths.small, color: 'blue' }}>
                      {p ? displayGhandi(p.ghandi) : ""}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            {roomNumbers.map(room => (
              <React.Fragment key={room}>
                <td style={{ ...footerStyle, width: colWidths.nickname, color: 'black' }}>
                  합계
                </td>
                <td style={{ ...footerStyle, width: colWidths.small, color: 'blue' }}>
                  {roomHandySum[room]}
                </td>
              </React.Fragment>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ==============================================
// [7] FinalResultTable
// ==============================================
function FinalResultTable({
  rooms,
  scores,
  roomLabels,
  hiddenRooms,
  showScore,
  showBanddang,
  toggleRoomVisibility,
  setShowScore,
  setShowBanddang,
}) {
  const rowCount = 4;
  const roomData = [];

  for (let i = 0; i < roomLabels.length; i++) {
    if (hiddenRooms[i]) continue;
    const arr = rooms[i] || [];
    const completeArr = [...Array(rowCount)].map((_, idx) => arr[idx] || { group: "", name: "", ghandi: "" });
    let highestIndex = -1, highestScore = -Infinity;
    let ghandiSum = 0, total = 0;

    const finalScores = completeArr.map((p, idx) => {
      const sc = toNumberSafe(scores[p.name?.trim().toLowerCase()] || 0);
      if (sc > highestScore) { highestScore = sc; highestIndex = idx; }
      return { p, sc, banddang: 0, result: 0 };
    });

    finalScores.forEach(fs => { ghandiSum += toNumberSafe(fs.p.ghandi); });
    finalScores.forEach((fs, idx) => {
      fs.bandang = (idx === highestIndex && showBanddang) ? Math.floor(fs.sc * 0.5) : fs.sc;
      fs.result = fs.bandang - toNumberSafe(fs.p.ghandi);
      total += fs.result;
    });

    roomData.push({ roomIndex: i, finalScores, total, ghandiSum });
  }

  // 순위 매기기
  const sorted = [...roomData].sort((a, b) => a.total !== b.total ? a.total - b.total : a.ghandiSum - b.ghandiSum);
  sorted.forEach((r, idx) => r.rank = idx + 1);
  roomData.sort((a, b) => a.roomIndex - b.roomIndex);
  roomData.forEach(rd => {
    const found = sorted.find(s => s.roomIndex === rd.roomIndex);
    rd.rank = found?.rank;
  });

  const formatNum = n => n >= 0 ? `+${n}` : `${n}`;

  return (
    <div style={tableContainerStyle}>
      <div style={{ marginBottom: 10, fontSize: 16 }}>
        <h4>🕵️ 방별 표시/숨김</h4>
        {roomLabels.map((label, i) => (
          <label key={i} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={!hiddenRooms[i]}
              onChange={() => toggleRoomVisibility(i)}
            />{label}
          </label>
        ))}
        <div style={{ marginTop: 10 }}>
          <label style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={showScore}
              onChange={e => setShowScore(e.target.checked)}
            />스코어
          </label>
          <label>
            <input
              type="checkbox"
              checked={showBanddang}
              onChange={e => setShowBanddang(e.target.checked)}
            />반땅
          </label>
        </div>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            {roomData.map(rd => {
              const colCount = 2 + (showScore ? 1 : 0) + (showBanddang ? 1 : 0) + 1;
              return (
                <th
                  key={rd.roomIndex}
                  colSpan={colCount}
                  style={{ ...headerStyle, width: colWidths.nickname + colWidths.small * colCount }}
                >
                  {roomLabels[rd.roomIndex]}
                </th>
              );
            })}
          </tr>
          <tr>
            {roomData.map(rd => (
              <React.Fragment key={rd.roomIndex}>
                <th style={headerStyle}>닉네임</th>
                <th style={headerStyle}>G핸디</th>
                {showScore && <th style={headerStyle}>스코어</th>}
                {showBanddang && <th style={headerStyle}>반땅</th>}
                <th style={headerStyle}>결과</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 4 }).map((_, ri) => (
            <tr key={ri}>
              {roomData.map(rd => {
                const fs = rd.finalScores[ri];
                const colCount = 2 + (showScore ? 1 : 0) + (showBanddang ? 1 : 0) + 1;
                if (!fs) {
                  return Array.from({ length: colCount }).map((_, ci) => (
                    <td key={ci} style={baseCellStyle} />
                  ));
                }
                return (
                  <React.Fragment key={rd.roomIndex + "-" + ri}>
                    <td style={{ ...baseCellStyle, ...fitFontSize(fs.p.name, 10) }}>{fs.p.name}</td>
                    <td style={baseCellStyle}>{displayGhandi(fs.p.ghandi)}</td>
                    {showScore && <td style={baseCellStyle}>{formatNum(fs.sc)}</td>}
                    {showBanddang && <td style={{ ...baseCellStyle, color: 'blue' }}>{formatNum(fs.bandang)}</td>}
                    <td style={{ ...baseCellStyle, color: 'red' }}>{formatNum(fs.result)}</td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            {roomData.map(rd => {
              const colCount = 2 + (showScore ? 1 : 0) + (showBanddang ? 1 : 0) + 1;
              return (
                <React.Fragment key={rd.roomIndex}>
                  {Array.from({ length: colCount - 1 }).map((_, ci) => (
                    <td key={ci} style={footerStyle} />
                  ))}
                  <td style={{ ...footerStyle, color: 'red' }}>{formatNum(rd.total)}</td>
                </React.Fragment>
              );
            })}
          </tr>
          <tr>
            {roomData.map(rd => {
              const colCount = 2 + (showScore ? 1 : 0) + (showBanddang ? 1 : 0) + 1;
              return (
                <React.Fragment key={rd.roomIndex}>
                  {Array.from({ length: colCount - 1 }).map((_, ci) => (
                    <td key={ci} style={footerStyle} />
                  ))}
                  <td style={{ ...footerStyle, color: 'blue', fontWeight: 'bold' }}>
                    {rd.rank}등
                  </td>
                </React.Fragment>
              );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ==============================================
// [8] App 컴포넌트 (전체 통합)
// ==============================================
// StrokeModeApp 컴포넌트 (전체 통합)
function StrokeModeApp() {
  const [topTitle, setTopTitle] = useState("AGM 수동 배정 (반땅룰 적용)");
  const [roomCount, setRoomCount] = useState(4);
  const [participants, setParticipants] = useState([]);
  const [assigned, setAssigned] = useState({});
  const [buttonClicked, setButtonClicked] = useState({});
  const [uploadKey, setUploadKey] = useState(0);
  const [forceResetKey, setForceResetKey] = useState(0);
  const [scores, setScores] = useState({});
  const [tableView, setTableView] = useState("none");
  const [roomLabels, setRoomLabels] = useState([]);
  const [hiddenRooms, setHiddenRooms] = useState({});
  const [showScore, setShowScore] = useState(true);
  const [showBanddang, setShowBanddang] = useState(true);
  const [loadingIndex, setLoadingIndex] = useState(null);

  useEffect(() => {
    const defaultLabels = Array.from({ length: roomCount }, (_, i) => `${i + 1}번 방`);
    setRoomLabels(defaultLabels);
    initParticipants();
    setHiddenRooms({});
  }, [roomCount]);

  const initParticipants = () => {
    const total = roomCount * 4;
    setParticipants(Array.from({ length: total }, () => ({ group: '', name: '', ghandi: '' })));
    setAssigned({});
    setButtonClicked({});
    setUploadKey(prev => prev + 1);
    setForceResetKey(prev => prev + 1);
    setLoadingIndex(null);
    setScores({});
    setHiddenRooms({});
  };

  // ==============================================
  // 방 이름 수정
  // ==============================================
  const handleRoomLabelChange = (index, newLabel) => {
    setRoomLabels(prev => {
      const updated = [...prev];
      updated[index] = newLabel;
      return updated;
    });
  };

  // ==============================================
  // 방 표시/숨김
  // ==============================================
  const toggleRoomVisibility = (room) => {
    setHiddenRooms(prev => ({ ...prev, [room]: !prev[room] }));
  };

  // ==============================================
  // 엑셀 업로드
  // ==============================================
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const cleaned = data.slice(1).map(row => ({
        group: row[0] || '',
        name: row[1] || '',
        ghandi: row[2] === 0 ? 0 : (row[2] || '')
      }));
      console.log("DEBUG: cleaned participants from Excel", cleaned);
      setParticipants(cleaned);
      setAssigned({});
      setButtonClicked({});
      setScores({});
      setForceResetKey(prev => prev + 1);
      setLoadingIndex(null);
      setHiddenRooms({});
    };
    reader.readAsBinaryString(file);
  };

  // ==============================================
  // 참가자 입력 처리
  // ==============================================
  const handleInput = (i, key, val) => {
    const updated = [...participants];
    updated[i][key] =
      val === '' ? '' : (key === 'ghandi' || key === 'group') ? Number(val) : val;
    setParticipants(updated);
  };

  const handleScoreChange = (name, val) => {
    const key = name ? name.trim().toLowerCase() : "";
    setScores(prev => ({ ...prev, [key]: val }));
  };

  // ==============================================
  // 셔플 함수
  // ==============================================
  const shuffle = (arr) =>
    arr.map(v => [v, Math.random()])
       .sort((a, b) => a[1] - b[1])
       .map(v => v[0]);

  // ==============================================
  // 개별 배정
  // ==============================================
  const assignIndividual = (idx) => {
    const user = participants[idx];
    if (!user.group || !user.name || user.ghandi === '' || buttonClicked[idx]) return;
    setButtonClicked(prev => ({ ...prev, [idx]: true }));

    const groupIndex = user.group - 1;
    const availableRooms = [];
    for (let i = 0; i < roomCount; i++) {
      const room = assigned[i] || [];
      const sameGroup = room.find(p => p?.group === user.group);
      if (!sameGroup && !room[groupIndex]) {
        availableRooms.push(i);
      }
    }
    if (availableRooms.length === 0) return;

    const randomRoom = shuffle(availableRooms)[0];
    setLoadingIndex(idx);
    setTimeout(() => {
      setAssigned(prev => {
        const updated = { ...prev };
        if (!updated[randomRoom]) updated[randomRoom] = [];
        updated[randomRoom][groupIndex] = user;
        console.log("DEBUG: assigned after individual assignment", updated);
        return updated;
      });
      setButtonClicked(prev => ({ ...prev, [idx]: true }));
      setLoadingIndex(null);
      alert(`${user.name}님은 ${roomLabels[randomRoom]}에 배정되었습니다.`);
    }, 1200);
  };

  // ==============================================
  // 자동 배정
  // ==============================================
  const autoAssign = () => {
    const alreadyAssignedIdx = new Set(
      Object.values(assigned).flat().map(p => p?.name)
    );
    const grouped = [[], [], [], []];
    participants.forEach((p, i) => {
      if (p.group >= 1 && p.group <= 4 && !alreadyAssignedIdx.has(p.name)) {
        grouped[p.group - 1].push({ ...p, idx: i });
      }
    });
    const result = { ...assigned };
    grouped.forEach((group, gIdx) => {
      const limited = shuffle(group);
      let roomIdx = 0;
      limited.forEach(p => {
        while (roomIdx < roomCount && result[roomIdx]?.[gIdx]) {
          roomIdx++;
        }
        if (roomIdx < roomCount) {
          if (!result[roomIdx]) result[roomIdx] = [];
          result[roomIdx][gIdx] = p;
        }
      });
    });
    setAssigned(result);
    const clicked = { ...buttonClicked };
    Object.values(result)
      .flat()
      .forEach(p => {
        if (p) clicked[p.idx] = true;
      });
    setButtonClicked(clicked);
    console.log("DEBUG: assigned after auto assignment", result);
  };

  // ==============================================
  // 강제 배정
  // ==============================================
  const forceAssign = (idx, roomIdx) => {
    const user = participants[idx];
    if (!user || user.group < 1 || user.group > 4 || !user.name) return;
    const groupIdx = user.group - 1;
    let oldRoom = -1;
    const updated = { ...assigned };
    // 기존 방에서 제거
    for (let i = 0; i < roomCount; i++) {
      if (updated[i]?.[groupIdx]?.name === user.name) oldRoom = i;
    }
    const targetRoom = updated[roomIdx] || [];
    const existing = targetRoom[groupIdx];
    if (existing) {
      if (oldRoom !== -1) {
        if (!updated[oldRoom]) updated[oldRoom] = [];
        updated[oldRoom][groupIdx] = existing;
      }
    } else if (oldRoom !== -1) {
      delete updated[oldRoom][groupIdx];
    }
    if (!updated[roomIdx]) updated[roomIdx] = [];
    updated[roomIdx][groupIdx] = user;
    setAssigned(updated);
    setButtonClicked(prev => ({ ...prev, [idx]: true }));
    console.log("DEBUG: assigned after force assignment", updated);
  };

  // ==============================================
  // 간단 합계 계산
  // ==============================================
  const calculateRoomTotal = (room) => {
    return (room || []).reduce((sum, p) => {
      const key = p?.name ? p.name.trim().toLowerCase() : "";
      const change = parseInt(scores[key] || 0, 10);
      return sum + (change - Number(p?.ghandi || 0));
    }, 0);
  };

  // ==============================================
  // 최종 렌더링 (추가 출력: 방배정표, 최종결과표)
  // ==============================================
  function renderAllocationTable() {
    return (
      <div style={{ ...tableContainerStyle, overflowX: "auto" }}>
        <h3>방배정표</h3>
        {/* 기존 코드 그대로 유지 */}
        <table style={tableStyle}>
          <thead>
            <tr>
              {roomLabels.map((label, i) => {
                if (hiddenRooms[i]) return null;
                return (
                  <th
                    key={i}
                    colSpan={2}
                    style={{ ...headerStyle, width: colWidths.nickname + colWidths.small }}
                  >
                    {label}
                  </th>
                );
              })}
            </tr>
            <tr>
              {roomLabels.map((label, i) => {
                if (hiddenRooms[i]) return null;
                return (
                  <React.Fragment key={i}>
                    <th style={{ ...headerStyle, width: colWidths.nickname }}>닉네임</th>
                    <th style={{ ...headerStyle, width: colWidths.small }}>G핸디</th>
                  </React.Fragment>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {roomLabels.map((label, i) => {
                  if (hiddenRooms[i]) return null;
                  const arr = assigned[i] || [];
                  const p = arr[rowIndex];
                  return (
                    <React.Fragment key={`${i}-${rowIndex}`}>
                      <td style={baseCellStyle}>{p ? p.name : ""}</td>
                      <td style={{ ...baseCellStyle, color: "blue" }}>
                        {p ? displayGhandi(p.ghandi) : ""}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              {roomLabels.map((label, i) => {
                if (hiddenRooms[i]) return null;
                const arr = assigned[i] || [];
                const sum = arr.reduce((acc, p) => {
                  const sc = toNumberSafe(Number(scores[p?.name] || 0)) - toNumberSafe(p?.ghandi);
                  return acc + sc;
                }, 0);
                return (
                  <React.Fragment key={i}>
                    <td style={{ ...footerStyle, textAlign: "center", color: "black" }}>합계</td>
                    <td style={{ ...footerStyle, textAlign: "center", color: "blue" }}>{sum}</td>
                  </React.Fragment>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  function renderFinalResultTable() {
    return (
      <div style={{ ...tableContainerStyle, overflowX: "auto" }}>
        <FinalResultTable
          rooms={assigned}
          scores={scores}
          roomLabels={roomLabels}
          hiddenRooms={hiddenRooms}
          showScore={showScore}
          showBanddang={showBanddang}
          toggleRoomVisibility={toggleRoomVisibility}
          setShowScore={setShowScore}
          setShowBanddang={setShowBanddang}
        />
      </div>
    );
  }

  return (
    <div className="container">
      {/* 상단 제목 */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: '24px', fontWeight: 'bold' }}>페이지 제목: </label>
        <input
          type="text"
          value={topTitle}
          onChange={(e) => setTopTitle(e.target.value)}
          style={{ fontSize: '24px', width: '400px', marginLeft: '10px' }}
        />
      </div>
      <h1 style={{ fontSize: '24px', margin: '8px 0' }}>{topTitle}</h1>

      {/* 제어 영역 */}
      <ControlPanel
  roomCount={roomCount}
  onRoomCountChange={setRoomCount}
  uploadKey={uploadKey}
  onExcelUpload={handleExcelUpload}
  onAutoAssign={autoAssign}      // Stroke 모드의 자동배정 함수
  onClear={initParticipants}      // Stroke 모드의 클리어 함수
/>

      {/* 방 이름 수정 / 숨김 */}
      <div style={{ marginBottom: 20, fontSize: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3>🏷 방 이름 수정</h3>
        {roomLabels.map((label, i) => {
          const currentCount = assigned[i] ? assigned[i].filter(p => p && p.name).length : 0;
          return (
            <div key={i} style={{ marginBottom: 5 }}>
              <label>
                {i + 1}번 방 →&nbsp;
                <input
                  type="text"
                  value={label}
                  onChange={(e) => handleRoomLabelChange(i, e.target.value)}
                  style={{ width: '180px', fontSize: '16px' }}
                />
              </label>
              &nbsp;(<span style={{ color: 'blue' }}>현재 {currentCount}명</span>)
              &nbsp;
              <label>
                <input
                  type="checkbox"
                  checked={!hiddenRooms[String(i)]}
                  onChange={() => toggleRoomVisibility(String(i))}
                />
                표시
              </label>
            </div>
          );
        })}
      </div>

      {/* 참가자 입력 */}
      <div style={{ fontSize: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <h3>👥 참가자 입력</h3>
  {participants.map((p, i) => (
    <div className="participant-row" key={i}>
  {/* 조 */}
  <input
    placeholder="조"
    type="number"
    value={p.group}
    onChange={e => handleInput(i, 'group', e.target.value)}
  />

  {/* 닉네임 */}
  <input
    placeholder="닉네임"
    value={p.name}
    onChange={e => handleInput(i, 'name', e.target.value)}
  />

  {/* G핸디 */}
  <input
    placeholder="G핸디"
    type="number"
    value={p.ghandi}
    onChange={e => handleInput(i, 'ghandi', e.target.value)}
  />

  {/* 스코어 */}
  <input
    placeholder="스코어"
    type="number"
    value={scores[p.name?.trim().toLowerCase()] || ''}
    onChange={e => handleScoreChange(p.name, e.target.value)}
  />

  {/* 방배정 버튼 */}
  <button
  disabled={buttonClicked[i] || loadingIndex === i}
  onClick={() => assignIndividual(i)}
  className="assign-btn"
>
  {loadingIndex === i
    ? <span className="spinner" />    // ↙ 여기에 스피너
    : '방배정'}
  </button>

  {/* 강제배정 select */}
  <select
    onChange={e => forceAssign(i, Number(e.target.value))}
    defaultValue=""
  >
    <option value="">강제배정</option>
    {roomLabels.map((label, ridx) => (
      <option key={ridx} value={ridx}>{label}</option>
    ))}
  </select>
</div>
  ))}
</div>

      {/* 방 배정 결과 (간단 합계) */}
      <div style={{ marginTop: 30, fontSize: '18px', textAlign: 'center' }}>
      <h3>🏠 방 배정 결과 (간단 합계)</h3>
      <div className="result-container">
      {roomLabels.map((label, i) => {
          if (hiddenRooms[String(i)]) return null;
          return (
            <div key={i} className="result-box">          
              <strong>{label} (총점: {calculateRoomTotal(assigned[i])})</strong>
              <ul style={{ marginTop: 5 }}>
                {(assigned[i] || []).map((p, idx) => {
                  const keyName = p?.name ? p.name.trim().toLowerCase() : "";
                  const change = parseInt(scores[keyName] || 0, 10);
                  const result = change - Number(p?.ghandi || 0);
                  return (
                    <li key={idx}>
                      {p?.name} | 조: {p?.group} | G핸디: {displayGhandi(p?.ghandi)} | 스코어: {change >= 0 ? '+' + change : change} | 결과: {result >= 0 ? '+' + result : result}
                    </li>
                  );
                })}
                {!(assigned[i]?.length) && <li>⏳ 아직 없음</li>}
              </ul>
            </div>
          );
        })}
      </div>
      </div>

      {/* 추가 출력 (표) */}
      <div style={{ marginTop: 30, fontSize: '18px' }}>
        <h3>📊 추가 출력 (표)</h3>
        <div style={{ marginBottom: 10 }}>
          <button
            onClick={() => setTableView("allocation")}
            style={{ fontSize: '16px' }}
          >
            방배정표
          </button>
          <button
            onClick={() => setTableView("final")}
            style={{ fontSize: '16px', marginLeft: '10px' }}
          >
            최종결과표
          </button>
        </div>
        <div style={tableContainerStyle}>
          {tableView === "allocation" && (
            <RoomAllocationTable
              rooms={assigned}
              roomLabels={roomLabels}
              hiddenRooms={hiddenRooms}
            />
          )}
          {tableView === "final" && (
            <FinalResultTable
              rooms={assigned}
              scores={scores}
              roomLabels={roomLabels}
              hiddenRooms={hiddenRooms}
              showScore={showScore}
              showBanddang={showBanddang}
              toggleRoomVisibility={toggleRoomVisibility}
              setShowScore={setShowScore}
              setShowBanddang={setShowBanddang}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default StrokeModeApp;
