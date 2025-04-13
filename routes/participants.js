// routes/participants.js
const express = require('express');
const router = express.Router();

// 이 예시에서는 실제 데이터베이스 대신 임시 메모리 변수로 저장하는 예시입니다.
let participantData = [];

// 참가자 데이터 저장 (POST)
router.post('/', (req, res) => {
  const { participants } = req.body;
  if (!participants || !Array.isArray(participants)) {
    return res.status(400).json({ success: false, message: '잘못된 데이터 형식입니다.' });
  }
  participantData = participants; // 실제 프로젝트에서는 DB에 저장합니다.
  res.json({ success: true, message: '참가자 데이터가 저장되었습니다.' });
});

// 참가자 데이터 조회 (GET)
router.get('/', (req, res) => {
  res.json({ success: true, participants: participantData });
});

module.exports = router;
