const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const logger = require("../middleware/logger");
const rateLimiter = require('../middleware/rateLimiter');


// router.use(authenticate);
// router.use(logger); 
router.get("/protected",(req, res) => {
  res.send("You are authenticated and this is a protected route.");
});
module.exports = router;