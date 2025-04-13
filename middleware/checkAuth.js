// middleware/checkAuth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
  // 요청 헤더에서 토큰 추출 (예: Authorization: Bearer <token>)
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: '인증 토큰이 없습니다.' });
  }
  
  const token = authHeader.split(' ')[1]; // 'Bearer ' 부분 제거

  try {
    // JWT_SECRET 키로 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
    // 검증 성공 시 req.user 등에 사용자 정보를 담아서 다음 단계로
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
  }
}

module.exports = checkAuth;
