// server.js
require('dotenv').config({ path: '.env.backend' });
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
// 최종 경로: POST /api/auth/login

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
