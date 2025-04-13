// routes/auth.js
const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  // 실제 /api/auth/login 에서 동작 (server.js에서 app.use('/api/auth', router))
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    return res.json({ success: true, token: 'jwtTokenHere' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid' });
  }
});

module.exports = router;
