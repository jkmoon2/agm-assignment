// routes/admin.js
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

// 관리자 전용 API 예시
router.get('/dashboard-data', checkAuth, (req, res) => {
  // 여기서 req.user 정보를 확인하고, 필요한 데이터를 반환
  return res.json({
    message: '관리자 전용 데이터입니다.',
    user: req.user,  // JWT에 담긴 username 등
  });
});

module.exports = router;
