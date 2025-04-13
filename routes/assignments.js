// routes/assignments.js
const express = require('express');
const router = express.Router();

// 임시 저장소 변수 (실제 운영에서는 데이터베이스 사용)
let assignmentsData = {};

// POST: 배정 데이터를 저장
router.post('/', (req, res) => {
  const { assignments } = req.body;
  if (!assignments) {
    return res.status(400).json({ success: false, message: "배정 데이터가 없습니다." });
  }
  assignmentsData = assignments;
  res.json({ success: true, message: "배정 데이터 저장 완료", assignments: assignmentsData });
});

// GET: 배정 데이터를 조회
router.get('/', (req, res) => {
  res.json({ success: true, assignments: assignmentsData });
});

module.exports = router;
