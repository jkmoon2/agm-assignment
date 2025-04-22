import React from 'react';

// 스트로크 모드용 최종결과표
export function StrokeResultTable({
  rooms,
  scores,
  roomLabels,
  hiddenRooms,
  showScore,
  showBanddang,
  toggleRoomVisibility,
  setShowScore,
  setShowBanddang,
  tableContainerStyle,
  tableStyle,
  baseCellStyle,
  headerStyle,
  footerStyle,
  colWidths
}) {
  const rowCount = 4;
  const data = [];

  roomLabels.forEach((label, i) => {
    if (hiddenRooms[i]) return;
    const arr = rooms[i] || [];
    // 이름, 스코어, 반땅, 결과까지 계산…
    let highestScore = -Infinity,
        highestIdx = -1;
    const entries = arr.map((p, idx) => {
      const sc = Number(scores[p?.name?.trim().toLowerCase()] || 0);
      if (sc > highestScore) {
        highestScore = sc;
        highestIdx = idx;
      }
      return { p, sc, banddang: 0, result: 0 };
    });
    // G핸디 합계
    const ghandiSum = entries.reduce(
      (sum, e) => sum + Number(e.p?.ghandi || 0),
      0
    );
    // 반땅 & 결과
    let banddangSum = 0,
        total = 0;
    entries.forEach((e, idx) => {
      e.bandang = showBanddang && idx === highestIdx
        ? Math.floor(e.sc / 2)
        : e.sc;
      e.result = e.bandang - Number(e.p?.ghandi || 0);
      banddangSum += e.bandang;
      total += e.result;
    });
    data.push({ roomIndex: i, label, entries, ghandiSum, banddangSum, total });
  });

  // 순위 매기기
  const sorted = [...data].sort((a, b) => {
    const d = a.total - b.total;
    return d !== 0 ? d : a.ghandiSum - b.ghandiSum;
  });
  sorted.forEach((d, idx) => {
    d.rank = idx + 1;
  });

  // === 렌더링 ===
  return (
    <div style={tableContainerStyle}>
      <div style={{ marginBottom: 10 }}>
        <h4>방별 표시/숨김</h4>
        {roomLabels.map((label, i) => (
          <label key={i} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={!hiddenRooms[i]}
              onChange={() => toggleRoomVisibility(i)}
            />{' '}
            {label}
          </label>
        ))}
        <div style={{ marginTop: 10 }}>
          <label style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={showScore}
              onChange={e => setShowScore(e.target.checked)}
            />{' '}
            스코어
          </label>
          <label>
            <input
              type="checkbox"
              checked={showBanddang}
              onChange={e => setShowBanddang(e.target.checked)}
            />{' '}
            반땅
          </label>
        </div>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            {data.map(d => {
              const colCount = 2 + (showScore ? 1 : 0) + (showBanddang ? 1 : 0) + 1;
              return (
                <th
                  key={d.roomIndex}
                  colSpan={colCount}
                  style={headerStyle}
                >
                  {d.label}
                </th>
              );
            })}
          </tr>
          <tr>
            {data.map(d => (
              <React.Fragment key={d.roomIndex}>
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
          {Array.from({ length: rowCount }).map((_, ri) => (
            <tr key={ri}>
              {data.map(d => {
                const e = d.entries[ri];
                const colCount = 2 + (showScore ? 1 : 0) + (showBanddang ? 1 : 0) + 1;
                if (!e) {
                  return Array.from({ length: colCount }).map((_, ci) => (
                    <td key={`${ri}-${d.roomIndex}-${ci}`} style={baseCellStyle}></td>
                  ));
                }
                return (
                  <React.Fragment key={`${ri}-${d.roomIndex}`}>
                    <td style={{ ...baseCellStyle, width: colWidths.nickname }}>
                      {e.p.name}
                    </td>
                    <td style={baseCellStyle}>{e.p.ghandi}</td>
                    {showScore && (
                      <td style={baseCellStyle}>
                        {e.sc >= 0 ? '+' + e.sc : e.sc}
                      </td>
                    )}
                    {showBanddang && (
                      <td style={{ ...baseCellStyle, color: 'blue' }}>
                        {e.bandang >= 0 ? '+' + e.bandang : e.bandang}
                      </td>
                    )}
                    <td style={{ ...baseCellStyle, color: 'red' }}>
                      {e.result >= 0 ? '+' + e.result : e.result}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {/* 합계 행 */}
          <tr>
            {data.map(d => {
              const colCount = 2 + (showScore ? 1 : 0) + (showBanddang ? 1 : 0) + 1;
              return (
                <React.Fragment key={'sum-' + d.roomIndex}>
                  {Array.from({ length: colCount - 1 }).map((_, ci) => (
                    <td key={`sum-empty-${ci}`} style={footerStyle}></td>
                  ))}
                  <td style={{ ...footerStyle, color: 'red' }}>
                    {d.total >= 0 ? '+' + d.total : d.total}
                  </td>
                </React.Fragment>
              );
            })}
          </tr>
          {/* 순위 행 */}
          <tr>
            {data.map(d => {
              const colCount = 2 + (showScore ? 1 : 0) + (showBanddang ? 1 : 0) + 1;
              return (
                <React.Fragment key={'rank-' + d.roomIndex}>
                  {Array.from({ length: colCount - 1 }).map((_, ci) => (
                    <td key={`rank-empty-${ci}`} style={footerStyle}></td>
                  ))}
                  <td style={{ ...footerStyle, color: 'blue', fontWeight: 'bold' }}>
                    {d.rank ? d.rank + '등' : ''}
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

// AGM 포볼 모드용 팀결과표는 별도 컴포넌트로 분리하거나,
// StrokeResultTable 컴포넌트를 약간 변형해서 사용하시면 됩니다.
