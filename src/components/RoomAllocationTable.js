// src/components/RoomAllocationTable.js
import React from 'react';

// 기본 스타일 (필요에 따라 여러분의 스타일 객체로 수정)
const tableContainerStyle = { overflowX: 'auto', marginTop: '20px', marginBottom: '20px' };
const tableStyle = { borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' };
const baseCellStyle = { border: '1px solid #ccc', padding: '8px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const headerStyle = { ...baseCellStyle, backgroundColor: '#f0f0f0', fontWeight: 'bold', fontSize: '18px' };
const footerStyle = { ...baseCellStyle, backgroundColor: '#e8e8e8', fontWeight: 'bold' };

// 예) 닉네임 열과 작은 열의 너비 (필요에 따라 조정)
const colWidths = { nickname: 160, small: 30 };

// G핸디 값을 출력하는 함수 (0이면 "0"으로 출력)
function displayGhandi(val) {
  if (val === 0 || val === "0") return "0";
  return val;
}

const RoomAllocationTable = ({ rooms, roomLabels, hiddenRooms }) => {
  // roomLabels 배열 전체(예: ["1번 방", "2번 방", ...])에서, hiddenRooms에 의해 표시 여부가 true(또는 false)인 방을 걸러냅니다.
  const allRooms = Array.from({ length: roomLabels.length }, (_, i) => String(i));
  const visibleRooms = allRooms.filter(room => !hiddenRooms[room]);

  const rowCount = 4; // 각 방에 4명의 슬롯(고정)으로 가정

  // 각 방의 G핸디 합계 계산
  const roomHandySum = {};
  visibleRooms.forEach(room => {
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
            {visibleRooms.map(room => (
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
            {visibleRooms.map(room => (
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
              {visibleRooms.map(room => {
                const p = rooms[room]?.[rowIndex];
                return (
                  <React.Fragment key={`${room}-${rowIndex}`}>
                    <td
                      style={{ ...baseCellStyle, width: colWidths.nickname }}
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
            {visibleRooms.map(room => (
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
};

export default RoomAllocationTable;
