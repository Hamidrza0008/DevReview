const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/statsController");
const { statsLimiter } = require("../middleware/rateLimiter.middleware");

router.get("/", statsLimiter, getStats);

module.exports = router;