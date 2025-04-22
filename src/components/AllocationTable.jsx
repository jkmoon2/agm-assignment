import React from 'react';

export function AllocationTable({
  rooms,
  roomLabels,
  hiddenRooms,
  tableContainerStyle,
  tableStyle,
  baseCellStyle,
  headerStyle,
  footerStyle,
  colWidths
}) {
  const rowCount = 4;
  const visibleRooms = roomLabels
    .map((_, i) => String(i))
    .filter(r => !hiddenRooms[r]);

  // G핸디 합산
  const roomHandySum = {};
  visibleRooms.forEach(room => {
    const arr = rooms[room] || [];
    roomHandySum[room] = arr.reduce(
      (sum, p) => sum + (p && p.ghandi != null ? Number(p.ghandi) : 0),
      0
    );
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
                style={{
                  ...headerStyle,
                  width: colWidths.nickname + colWidths.small
                }}
              >
                {roomLabels[Number(room)]}
              </th>
            ))}
          </tr>
          <tr>
            {visibleRooms.map(room => (
              <React.Fragment key={room}>
                <th style={{ ...headerStyle, width: colWidths.nickname }}>
                  닉네임
                </th>
                <th style={{ ...headerStyle, width: colWidths.small }}>
                  G핸디
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, ri) => (
            <tr key={ri}>
              {visibleRooms.map(room => {
                const p = (rooms[room] || [])[ri];
                return (
                  <React.Fragment key={`${room}-${ri}`}>
                    <td
                      style={{
                        ...baseCellStyle,
                        width: colWidths.nickname
                      }}
                    >
                      {p?.name || ''}
                    </td>
                    <td
                      style={{
                        ...baseCellStyle,
                        width: colWidths.small,
                        color: 'blue'
                      }}
                    >
                      {p?.ghandi != null ? p.ghandi : ''}
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
                <td style={{ ...footerStyle, width: colWidths.nickname }}>
                  합계
                </td>
                <td
                  style={{
                    ...footerStyle,
                    width: colWidths.small,
                    color: 'blue'
                  }}
                >
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
