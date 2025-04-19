// src/StrokeModeApp.js

/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

// ==============================================
// [1] 안전한 숫자 변환 함수
//     -> 입력된 값이 숫자로 변환되지 않으면 0을 반환합니다.
// ==============================================
function toNumberSafe(val) {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
}

// ==============================================
// [2] 인라인 스타일 정의
// ==============================================
const tableContainerStyle = {
  overflowX: 'auto',
  marginTop: '20px',
  marginBottom: '20px',
};

const tableStyle = {
  borderCollapse: 'collapse',
  width: '100%',
  tableLayout: 'fixed',
};

const baseCellStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const headerStyle = {
  ...baseCellStyle,
  backgroundColor: '#f0f0f0',
  fontWeight: 'bold',
  fontSize: '18px',
};

const footerStyle = {
  ...baseCellStyle,
  backgroundColor: '#e8e8e8',
  fontWeight: 'bold',
};

const rankNumberStyle = {
  color: 'blue',
  fontWeight: 'bold',
  fontSize: '18px',
};

const rankLabelStyle = {
  color: 'blue',
  fontWeight: 'bold',
  fontSize: '18px',
};

// 닉네임 열 폭: 160px, 나머지 작은 열 폭: 30px
const colWidths = {
  nickname: 160,
  small: 30,
};

// ==============================================
// [3] 글자 길이에 따라 폰트 크기 자동 조절 함수
// ==============================================
function fitFontSize(text = "", maxLen = 6, baseSize = 18, minSize = 14) {
  if (text.length <= maxLen) return { fontSize: `${baseSize}px` };
  const ratio = maxLen / text.length;
  const newSize = Math.max(minSize, Math.floor(baseSize * ratio));
  return { fontSize: `${newSize}px` };
}

// ==============================================
// [4] G핸디 표시 함수
//     -> 값이 0이면 "0"으로, 아니면 그대로 출력합니다.
// ==============================================
function displayGhandi(val) {
  return toNumberSafe(val) === 0 ? "0" : val;
}

// ==============================================
// [5] getScore 함수
//     -> 참가자의 이름을 소문자 + trim 하여, scores 객체에서 점수를 가져옵니다.
//     -> (사용되지 않아도 에러는 아니므로 남겨둠.)
// ==============================================
function getScore(name, scores) {
  const key = name ? name.trim().toLowerCase() : "";
  return toNumberSafe(scores[key]);
}

// ==============================================
// [6] RoomAllocationTable
//     -> 각 방에 배정된 참가자들과 G핸디 합계를 출력하는 표
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
//     -> (반땅 계산 + 순위) + "방별 표시/숨김" + "스코어/반땅 표시" 옵션
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
  const allRooms = Array.from({ length: roomLabels.length }, (_, i) => String(i));
  const visibleRooms = allRooms.filter(r => !hiddenRooms[r]);

  // ------- "배열" 방식의 roomData 생성 (기존: 객체 방식 -> iterable 오류)
  // roomData = [
  //   { roomIndex: 0, finalScores: [...], total: X, banddangSum: Y, ghandiSum: Z, rank: ? },
  //   ...
  // ]
  const roomData = [];
  for (let i = 0; i < roomLabels.length; i++) {
    if (hiddenRooms[i]) continue; // 숨김 방 제외
    const arr = rooms[i] || [];
    // 각 방의 4명 정보를 보완
    const completeArr = Array.from({ length: rowCount }, (_, idx) => arr[idx] || { group: "", name: "", ghandi: "" });
    // 최고 스코어(반땅 대상) 찾기
    let highestIndex = -1;
    let highestScore = -Infinity;
    let banddangSum = 0;
    let total = 0;
    let ghandiSum = 0;

    const finalScores = completeArr.map((p, idx) => {
      const sc = toNumberSafe(scores[p?.name?.trim().toLowerCase()] || 0);
      if (sc > highestScore) {
        highestScore = sc;
        highestIndex = idx;
      }
      return { p, sc, banddang: 0, result: 0 };
    });

    // ghandi 합산
    finalScores.forEach(fs => {
      ghandiSum += toNumberSafe(fs.p.ghandi);
    });

    // 반땅 적용 및 total 계산
    finalScores.forEach((fs, idx) => {
      fs.bandang = (idx === highestIndex && showBanddang) ? Math.floor(fs.sc * 0.5) : fs.sc;
      fs.result = fs.bandang - toNumberSafe(fs.p.ghandi);
      banddangSum += fs.bandang;
      total += fs.result;
    });

    roomData.push({
      roomIndex: i,
      finalScores,
      banddangSum,
      total,
      ghandiSum,
    });
  }

  // DEBUG
  console.log("DEBUG: FinalResultTable roomData (array) =", roomData);

  // ------- 순위 산출 (총결과 오름차순, 동점이면 ghandiSum 낮은 순)
  const sorted = [...roomData].sort((a, b) => {
    const diff = a.total - b.total;
    if (diff !== 0) return diff;
    return a.ghandiSum - b.ghandiSum;
  });
  sorted.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  // roomData 배열의 순서를 (roomIndex 오름차순)으로 되돌림
  roomData.sort((a, b) => a.roomIndex - b.roomIndex);
  // rank 다시 주입
  roomData.forEach(rd => {
    const found = sorted.find(s => s.roomIndex === rd.roomIndex);
    rd.rank = found ? found.rank : null;
  });

  const formatNum = (num) => (num >= 0 ? `+${num}` : `${num}`);

  return (
    <div style={tableContainerStyle}>
      {/* ───── (추가) 방별 표시/숨김, 스코어/반땅 옵션 ───── */}
      <div style={{ marginBottom: '10px', fontSize: '16px' }}>
        <h4>🕵️ 방별 표시/숨김</h4>
        {roomLabels.map((label, i) => (
          <label key={i} style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={!hiddenRooms[String(i)]}
              onChange={() => toggleRoomVisibility(String(i))}
            />
            {label}
          </label>
        ))}
        <div style={{ marginTop: '10px' }}>
          <label style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={showScore}
              onChange={(e) => setShowScore(e.target.checked)}
            />
            스코어 표시
          </label>
          <label>
            <input
              type="checkbox"
              checked={showBanddang}
              onChange={(e) => setShowBanddang(e.target.checked)}
            />
            반땅 표시
          </label>
        </div>
      </div>
      {/* ───── 테이블 시작 ───── */}
      <table style={tableStyle}>
        <thead>
          <tr>
            {roomData.map(rd => {
              const colCount = 2 + (showScore ? 1 : 0) + (showBanddang ? 1 : 0) + 1;
              return (
                <th
                  key={rd.roomIndex}
                  colSpan={colCount}
                  style={{ ...headerStyle, width: colWidths.nickname + 4 * colWidths.small }}
                >
                  {roomLabels[rd.roomIndex]}
                </th>
              );
            })}
          </tr>
          <tr>
            {roomData.map(rd => (
              <React.Fragment key={rd.roomIndex}>
                <th style={{ ...headerStyle, width: colWidths.nickname }}>닉네임</th>
                <th style={{ ...headerStyle, width: colWidths.small }}>G핸디</th>
                {showScore && <th style={{ ...headerStyle, width: colWidths.small }}>스코어</th>}
                {showBanddang && <th style={{ ...headerStyle, width: colWidths.small }}>반땅</th>}
                <th style={{ ...headerStyle, width: colWidths.small }}>결과</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 4 }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {roomData.map(rd => {
                const fs = rd.finalScores[rowIndex];
                const colCount = 2 + (showScore ? 1 : 0) + (showBanddang ? 1 : 0) + 1;
                if (!fs) {
                  // 이 인덱스에 참가자 없음 -> 빈 셀
                  return (
                    <React.Fragment key={rd.roomIndex + "-" + rowIndex}>
                      {Array.from({ length: colCount }).map((_, c) => (
                        <td key={c} style={baseCellStyle}></td>
                      ))}
                    </React.Fragment>
                  );
                }
                return (
                  <React.Fragment key={rd.roomIndex + "-" + rowIndex}>
                    <td
                      style={{
                        ...baseCellStyle,
                        ...fitFontSize(fs.p.name, 10, 18, 14),
                        width: colWidths.nickname,
                      }}
                    >
                      {fs.p.name}
                    </td>
                    <td style={{ ...baseCellStyle, color: 'black' }}>
                      {displayGhandi(fs.p.ghandi)}
                    </td>
                    {showScore && (
                      <td style={{ ...baseCellStyle, color: 'black' }}>
                        {formatNum(fs.sc)}
                      </td>
                    )}
                    {showBanddang && (
                      <td style={{ ...baseCellStyle, color: 'blue' }}>
                        {formatNum(fs.bandang)}
                      </td>
                    )}
                    <td style={{ ...baseCellStyle, color: 'red' }}>
                      {formatNum(fs.result)}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {/* 1) 합계 (빨간색) */}
          <tr>
            {roomData.map(rd => {
              const colCount = 2 + (showScore ? 1 : 0) + (showBanddang ? 1 : 0) + 1;
              return (
                <React.Fragment key={rd.roomIndex}>
                  {Array.from({ length: colCount - 1 }).map((_, c) => (
                    <td key={c} style={footerStyle}></td>
                  ))}
                  <td style={{ ...footerStyle, color: "red" }}>
                    {formatNum(rd.total)}
                  </td>
                </React.Fragment>
              );
            })}
          </tr>
          {/* 2) 순위 (파란색) */}
          <tr>
            {roomData.map(rd => {
              const colCount = 2 + (showScore ? 1 : 0) + (showBanddang ? 1 : 0) + 1;
              return (
                <React.Fragment key={rd.roomIndex}>
                  {Array.from({ length: colCount - 1 }).map((_, c) => (
                    <td key={c} style={footerStyle}></td>
                  ))}
                  <td style={{ ...footerStyle, color: "blue", fontWeight: "bold" }}>
                    {rd.rank ? rd.rank + "등" : ""}
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
function App() {
  const [topTitle, setTopTitle] = useState("AGM 수동 배정 (반땅룰 적용)");
  const [roomCount, setRoomCount] = useState(4);
  const [participants, setParticipants] = useState([]);
  const [assigned, setAssigned] = useState({});
  const [buttonClicked, setButtonClicked] = useState({});
  const [uploadKey, setUploadKey] = useState(0);
  const [forceResetKey, setForceResetKey] = useState(0);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [scores, setScores] = useState({});
  // tableView은 한 번만 선언
  const [tableView, setTableView] = useState("none");
  const [roomLabels, setRoomLabels] = useState([]);
  const [hiddenRooms, setHiddenRooms] = useState({});
  const [showScore, setShowScore] = useState(true);
  const [showBanddang, setShowBanddang] = useState(true);

  useEffect(() => {
    const defaultLabels = Array.from({ length: roomCount }, (_, i) => `${i + 1}번 방`);
    setRoomLabels(defaultLabels);
    initParticipants();
    setHiddenRooms({});
  }, [roomCount]);

  // ==============================================
  // 초기화 함수
  // ==============================================
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
      <div style={tableContainerStyle}>
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
    // 여기서는 사용하지 않고, 
    // 최종결과표는 아래 FinalResultTable 컴포넌트로 대체
    return null;
  }

  return (
    <div style={{ padding: 20 }}>
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
      <div style={{ marginBottom: 10, fontSize: '18px' }}>
        <label>방 개수: </label>
        <input
          type="number"
          min="1"
          max="10"
          value={roomCount}
          onChange={(e) => setRoomCount(Number(e.target.value))}
          style={{ width: 50, marginLeft: 6 }}
        />
        <input
          key={uploadKey}
          type="file"
          accept=".xlsx"
          onChange={handleExcelUpload}
          style={{ marginLeft: 10 }}
        />
        <button onClick={autoAssign} style={{ marginLeft: 10, fontSize: '16px' }}>
          자동배정
        </button>
        <button onClick={initParticipants} style={{ marginLeft: 10, fontSize: '16px' }}>
          클리어
        </button>
      </div>

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
          <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
            <input
              placeholder="조"
              type="number"
              value={p.group}
              onChange={(e) => handleInput(i, 'group', e.target.value)}
              style={{ width: 40, fontSize: '16px' }}
            />
            <input
              placeholder="닉네임"
              value={p.name}
              onChange={(e) => handleInput(i, 'name', e.target.value)}
              style={{ width: 100, fontSize: '16px' }}
            />
            <input
              placeholder="G핸디"
              type="number"
              value={p.ghandi}
              onChange={(e) => handleInput(i, 'ghandi', e.target.value)}
              style={{ width: 60, fontSize: '16px' }}
            />
            <input
              placeholder="스코어(+/-)"
              type="number"
              value={scores[p.name ? p.name.trim().toLowerCase() : ''] || ''}
              onChange={(e) => handleScoreChange(p.name, e.target.value)}
              style={{ width: 80, fontSize: '16px' }}
            />
            <button disabled={buttonClicked[i]} onClick={() => assignIndividual(i)} style={{ fontSize: '16px' }}>
              {loadingIndex === i ? '⏳ 배정 중...' : '방배정'}
            </button>
            <select
              key={forceResetKey}
              defaultValue=""
              onChange={(e) => forceAssign(i, Number(e.target.value))}
              style={{ fontSize: '16px' }}
            >
              <option value="">🔒강제배정</option>
              {roomLabels.map((label, ridx) => (
                <option key={ridx} value={ridx}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* 방 배정 결과 (간단 합계) */}
      <div style={{ marginTop: 30, fontSize: '18px', textAlign: 'center' }}>
        <h3>🏠 방 배정 결과 (간단 합계)</h3>
        {roomLabels.map((label, i) => {
          if (hiddenRooms[String(i)]) return null;
          return (
            <div key={i} style={{ display: 'inline-block', border: '1px solid #aaa', padding: 10, margin: 10, textAlign: 'left' }}>
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

      {/* 추가 출력 (표) */}
      <div style={{ marginTop: 30, fontSize: '18px' }}>
        <h3>📊 추가 출력 (표)</h3>
        <div style={{ marginBottom: 10 }}>
          <button onClick={() => setTableView("allocation")} style={{ fontSize: '16px' }}>
            방배정표
          </button>
          <button onClick={() => setTableView("final")} style={{ fontSize: '16px', marginLeft: '10px' }}>
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

export default App;
