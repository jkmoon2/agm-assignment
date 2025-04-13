// src/pages/UserPage.js
import React, { useState } from 'react';

const UserPage = () => {
  const [inputPw, setInputPw] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  // 이 예시에서는 임의로 '1234'를 올바른 비밀번호라고 가정
  const CORRECT_PW = '1234';

  const handleCheckPassword = () => {
    if (inputPw === CORRECT_PW) {
      setAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  // 비밀번호가 맞지 않으면, 입력 폼만 보이도록
  if (!authenticated) {
    return (
      <div style={{ padding: 20 }}>
        <h1>사용자 페이지</h1>
        <div style={{ marginBottom: '10px' }}>
          <label>비밀번호 입력: </label>
          <input
            type="password"
            value={inputPw}
            onChange={(e) => setInputPw(e.target.value)}
            style={{ marginLeft: '10px', fontSize: '16px', padding: '6px' }}
          />
          <button
            onClick={handleCheckPassword}
            style={{ marginLeft: '10px', fontSize: '16px', padding: '6px' }}
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  // 인증에 성공하면, 실제 사용자 페이지 내용 표시
  return (
    <div style={{ padding: 20 }}>
      <h1>사용자 페이지</h1>
      <p>비밀번호 인증에 성공했습니다!<br/>여기서 본인의 배정 결과 등을 확인할 수 있습니다.</p>
      {/* 실제 사용자 전용 UI를 표시 */}
    </div>
  );
};

export default UserPage;
