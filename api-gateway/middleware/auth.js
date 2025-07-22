const { admin } = require("../utils/firebase");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // No token → proceed as anonymous (don't block)
    req.user = null;
    return next();
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
  } catch (error) {
    console.error("Token verification failed", error);
    req.user = null; // Still allow request as anonymous
  }

  next();
};

module.exports = authenticate;