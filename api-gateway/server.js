// server.js

const express = require('express');
const cors = require('cors');
const client = require('./redisClient');
const rateLimiter = require('./middleware/rateLimiter');
const authenticate = require('./middleware/auth');
const logger = require('./middleware/logger');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 9000;

// ✅ CORS setup with exposed headers
app.use(cors({
  origin: ['http://localhost:3000', 'https://ratelimterapp-8q3u.vercel.app'],/// Replace if your React runs on another port
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining']
}));

// 🔐 Middleware order
app.use(authenticate);
app.use(rateLimiter);
app.use(logger);

// ✅ Routes
app.get('/', (req, res) => {
  res.send('✅ API is working. You are within rate limits!');
});

app.use('/', apiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
