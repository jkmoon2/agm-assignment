// src/components/FinalResultTable.js
import React from 'react';

const tableContainerStyle = { overflowX: 'auto', marginTop: '20px', marginBottom: '20px' };
const tableStyle = { borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' };
const baseCellStyle = { border: '1px solid #ccc', padding: '8px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const headerStyle = { ...baseCellStyle, backgroundColor: '#f0f0f0', fontWeight: 'bold', fontSize: '18px' };
const footerStyle = { ...baseCellStyle, backgroundColor: '#e8e8e8', fontWeight: 'bold' };

// 컬럼 너비 설정
const colWidths = { nickname: 160, small: 30 };

// 숫자 형식 설정 함수 (예: +숫자, -숫자)
const formatNum = (num) => (num >= 0 ? `+${num}` : `${num}`);

// FinalResultTable 컴포넌트
const FinalResultTable = ({ rooms, scores, roomLabels, hiddenRooms, showScore, showBanddang }) => {
  // 전체 방 목록에서 hiddenRooms에 의해 보이는 방만 선택
  const allRooms = Array.from({ length: roomLabels.length }, (_, i) => String(i));
  const visibleRooms = allRooms.filter(room => !hiddenRooms[room]);
  const rowCount = 4;

  // 각 방에서 최고 스코어(최대값)를 가진 인덱스를 계산 (반땅 적용 대상)
  const roomHighest = {};
  visibleRooms.forEach(room => {
    const arr = rooms[room] || [];
    let highestIndex = -1;
    let highestScore = -Infinity;
    for (let i = 0; i < rowCount; i++) {
      const p = arr[i];
      const sc = Number(scores[p?.name] || 0);
      if (sc > highestScore) {
        highestScore = sc;
        highestIndex = i;
      }
    }
    if (highestIndex !== -1) {
      roomHighest[room] = highestIndex;
    }
  });

  // 각 참가자의 데이터를 계산 (적용스코어, 최종결과 등)
  const roomData = {};
  visibleRooms.forEach(room => {
    const arr = rooms[room] || [];
    roomData[room] = Array.from({ length: rowCount }).map((_, i) => {
      const p = arr[i] || {};
      const origScore = Number(scores[p.name] || 0);
      const isHighest = roomHighest[room] === i;
      // showBanddang이 true이면 최고 점수인 경우 반으로 처리 (Math.floor 사용)
      const appliedScore = showBanddang ? (isHighest ? Math.floor(origScore * 0.5) : origScore) : origScore;
      const finalScore = appliedScore - Number(p.ghandi || 0);
      return {
        name: p.name || "",
        ghandi: p.ghandi || 0,
        score: origScore,
        banddang: appliedScore,
        finalScore: finalScore,
      };
    });
  });

  // 각 방의 총합 계산 (G핸디, 스코어, 반땅, 최종결과)
  const roomTotals = {};
  visibleRooms.forEach(room => {
    const data = roomData[room];
    let totalGhandi = 0, totalScore = 0, totalBanddang = 0, totalFinal = 0;
    for (let i = 0; i < rowCount; i++) {
      const d = data[i];
      totalGhandi += Number(d.ghandi);
      totalScore += d.score;
      totalBanddang += d.banddang;
      totalFinal += d.finalScore;
    }
    roomTotals[room] = { totalGhandi, totalScore, totalBanddang, totalFinal };
  });

  // 방의 순위를 계산 (최종결과 기준, G핸디가 낮은 순으로 우선)
  const sortedRooms = [...visibleRooms].sort((a, b) => {
    const diff = roomTotals[a].totalFinal - roomTotals[b].totalFinal;
    if (diff !== 0) return diff;
    return roomTotals[a].totalGhandi - roomTotals[b].totalGhandi;
  });
  const roomRank = {};
  sortedRooms.forEach((room, idx) => {
    roomRank[room] = idx + 1;
  });

  return (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {visibleRooms.map(room => {
              const colCount = 2 + (showScore ? 1 : 0) + (showBanddang ? 1 : 0) + 1;
              return (
                <th
                  key={room}
                  colSpan={colCount}
                  style={{ ...headerStyle, width: colWidths.nickname + 4 * colWidths.small }}
                >
                  {roomLabels[Number(room)]}
                </th>
              );
            })}
          </tr>
          <tr>
            {visibleRooms.map(room => (
              <React.Fragment key={room}>
                <th style={{ ...headerStyle, width: colWidths.nickname }}>닉네임</th>
                <th style={{ ...headerStyle, width: colWidths.small }}>G핸디</th>
                {showScore && (
                  <th style={{ ...headerStyle, width: colWidths.small }}>스코어</th>
                )}
                {showBanddang && (
                  <th style={{ ...headerStyle, width: colWidths.small }}>반땅</th>
                )}
                <th style={{ ...headerStyle, width: colWidths.small }}>결과</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {visibleRooms.map(room => {
                const d = roomData[room][rowIndex];
                return (
                  <React.Fragment key={`${room}-${rowIndex}`}>
                    <td style={{ ...baseCellStyle, width: colWidths.nickname }}>{d.name}</td>
                    <td style={{ ...baseCellStyle, width: colWidths.small, color: 'black' }}>{d.ghandi}</td>
                    {showScore && (
                      <td style={{ ...baseCellStyle, width: colWidths.small, color: 'black' }}>
                        {formatNum(d.score)}
                      </td>
                    )}
                    {showBanddang && (
                      <td style={{ ...baseCellStyle, width: colWidths.small, color: 'blue' }}>
                        {formatNum(d.banddang)}
                      </td>
                    )}
                    <td style={{ ...baseCellStyle, width: colWidths.small, color: 'red' }}>
                      {formatNum(d.finalScore)}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            {visibleRooms.map(room => {
              const totals = roomTotals[room];
              return (
                <React.Fragment key={room}>
                  <td style={{ ...footerStyle, width: colWidths.small, color: 'black' }}>합계</td>
                  <td style={{ ...footerStyle, width: colWidths.small, color: 'black' }}>
                    {totals.totalGhandi}
                  </td>
                  {showScore && (
                    <td style={{ ...footerStyle, width: colWidths.small, color: 'black' }}>
                      {formatNum(totals.totalScore)}
                    </td>
                  )}
                  {showBanddang && (
                    <td style={{ ...footerStyle, width: colWidths.small, color: 'blue' }}>
                      {formatNum(totals.totalBanddang)}
                    </td>
                  )}
                  <td style={{ ...footerStyle, width: colWidths.small, color: 'red' }}>
                    {formatNum(totals.totalFinal)}
                  </td>
                </React.Fragment>
              );
            })}
          </tr>
          <tr>
            {visibleRooms.map(room => {
              const colCount = 2 + (showScore ? 1 : 0) + (showBanddang ? 1 : 0) + 1;
              const rank = roomRank[room];
              return (
                <React.Fragment key={room}>
                  {Array.from({ length: colCount - 1 }).map((_, i) => (
                    <td key={i} style={{ ...footerStyle }}></td>
                  ))}
                  <td style={{ ...footerStyle }}>
                    {rank ? (
                      <span>
                        <span style={{ color: 'blue', fontWeight: 'bold', fontSize: '18px' }}>{rank}</span>
                        <span style={{ color: 'blue', fontWeight: 'bold', fontSize: '18px' }}> 등</span>
                      </span>
                    ) : ""}
                  </td>
                </React.Fragment>
              );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default FinalResultTable;
