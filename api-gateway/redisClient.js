const redis = require('redis');

// Create Redis client
const client = redis.createClient();

// Handle connection
client.on('connect', () => {
  console.log('✅ Connected to Redis');
});

client.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

client.connect(); // Required in redis v4+

module.exports = client;