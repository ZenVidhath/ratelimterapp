const client = require('../redisClient');

const MAX_TOKENS = 10;
const REFILL_INTERVAL = 6;
const REFILL_RATE = 1;
const FIXED_WINDOW = 60;
const ANON_LIMIT = 5;

const rateLimiter = async (req, res, next) => {
  const isAuthenticated = req.user && req.user.email;

  if (isAuthenticated) {
    const key = `user:${req.user.email}`;
    const tokensKey = `tokens:${key}`;
    const lastRefillKey = `last_refill:${key}`;
    const now = Math.floor(Date.now() / 1000);

    try {
      const tokens = await client.get(tokensKey);
      const lastRefill = await client.get(lastRefillKey);

      const currentTokens = tokens ? parseFloat(tokens) : MAX_TOKENS;
      const lastRefillTime = lastRefill ? parseInt(lastRefill) : now;

      const elapsed = now - lastRefillTime;
      const tokensToAdd = Math.floor(elapsed / REFILL_INTERVAL) * REFILL_RATE;
      let newTokenCount = Math.min(currentTokens + tokensToAdd, MAX_TOKENS);

      if (newTokenCount < 1) {
        return res.status(429).json({
          message: '❌ Too many requests (authenticated user)',
        });
      }

      newTokenCount -= 1;

      await client.set(tokensKey, newTokenCount);
      await client.set(lastRefillKey, now);

      res.setHeader('X-RateLimit-Limit', MAX_TOKENS);
      res.setHeader('X-RateLimit-Remaining', newTokenCount);
      return next();
    } catch (err) {
      console.error('Redis error (authenticated):', err);
      return res.status(500).json({ message: 'Server Error' });
    }
  } else {
    // Anonymous: fixed window
    const key =` ratelimit:ip:${req.ip}`;
    try {
      const requests = await client.get(key);
      const current = requests ? parseInt(requests) : 0;

      if (current >= ANON_LIMIT) {
        return res.status(429).json({
          message: '❌ Too many requests (anonymous)',
        });
      }

      if (current === 0) {
        await client.set(key, 1, { EX: FIXED_WINDOW });
      } else {
        await client.incr(key);
      }

      res.setHeader('X-RateLimit-Limit', ANON_LIMIT);
      res.setHeader('X-RateLimit-Remaining', ANON_LIMIT - current - 1);
      return next();
    } catch (err) {
      console.error('Redis error (anonymous):', err);
      return res.status(500).json({ message: 'Server Error' });
    }
  }
};

module.exports = rateLimiter;