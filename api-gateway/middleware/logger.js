const { db } = require('../utils/firebase');

const logger = async (req, res, next) => {
  const logData = {
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date(),
    user: req.user?.uid || 'Anonymous',
    user: req.user?.email || "Anonymous",
    ip: req.ip,
    headers: req.headers,
  };

  try {
    await db.collection('api_logs').add(logData);
    console.log('📄 Log saved to Firestore');
    console.log("👤 User in logger:", req.user);
  } catch (error) {
    console.error('❌ Logging failed:', error);
  }

  next();
};

module.exports = logger;