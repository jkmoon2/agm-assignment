// src/utils/helpers.js

// 숫자 변환
export function toNumberSafe(val) {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
}

// 글자 길이에 따라 font-size 조절
export function fitFontSize(text = "", maxLen = 6, baseSize = 18, minSize = 14) {
  if (text.length <= maxLen) return { fontSize: `${baseSize}px` };
  const ratio = maxLen / text.length;
  const newSize = Math.max(minSize, Math.floor(baseSize * ratio));
  return { fontSize: `${newSize}px` };
}

// G핸디 0 처리
export function displayGhandi(val) {
  return toNumberSafe(val) === 0 ? "0" : val;
}

// 배열 섞기
export function shuffle(arr) {
  if (!arr?.length) return [];
  return arr
    .map(item => [item, Math.random()])
    .sort((a, b) => a[1] - b[1])
    .map(pair => pair[0]);
}
