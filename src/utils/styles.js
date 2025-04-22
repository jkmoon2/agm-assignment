// src/utils/styles.js

// 공통 컨테이너 스타일 (AGMForBallModeApp 에서 사용)
export const containerStyle = { padding: 20 };

// 테이블 주변 컨테이너(스크롤 등) 스타일
export const tableContainerStyle = {
  overflowX: "auto",
  marginTop: "20px",
  marginBottom: "20px"
};

// 테이블 기본 스타일
export const tableStyle = {
  borderCollapse: "collapse",
  width: "100%",
  tableLayout: "fixed"
};

// 테이블 셀 기본 스타일
export const baseCellStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
};

// 테이블 헤더 셀 스타일
export const headerStyle = {
  ...baseCellStyle,
  backgroundColor: "#f0f0f0",
  fontWeight: "bold",
  fontSize: "18px"
};

// 테이블 푸터 셀 스타일
export const footerStyle = {
  ...baseCellStyle,
  backgroundColor: "#e8e8e8",
  fontWeight: "bold"
};

// 닉네임 열 폭, 기타 작은 열 폭
export const colWidths = {
  nickname: 160,
  small: 30   // 스트로크 모드 기본값
};
