// src/pages/AdminLogin.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[AdminLogin] 전송 값:', { username, password });
    try {
      // '/api/auth/login' 경로로 요청 (프록시 설정이 제대로 되어 있다면 백엔드로 전송됨)
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/admin'); // 로그인 성공 시 관리자 대시보드로 이동
      } else {
        setErrorMsg('로그인에 실패하였습니다.');
      }
    } catch (error) {
      console.error('[AdminLogin] 로그인 에러:', error);
      setErrorMsg('로그인에 실패하였습니다.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>관리자 로그인</h1>
      
      {/* 로그인 폼 (아이디, 비밀번호 입력 + 로그인 버튼) */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: '240px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div>
          <label>Username:</label>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', fontSize: '16px', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', fontSize: '16px', padding: '8px', marginTop: '4px' }}
          />
        </div>

        {errorMsg && (
          <p style={{ color: 'red', margin: '5px 0' }}>{errorMsg}</p>
        )}

        <button type="submit" style={{ fontSize: '16px', padding: '8px' }}>
          로그인
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
