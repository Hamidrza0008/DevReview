const express = require("express");
const router = express.Router();

const {
  createSupportRequest,
} = require("../controllers/support.controller");

const authMiddleware = require("../middleware/auth.middleware");
const { supportLimiter } = require("../middleware/rateLimiter.middleware");

router.post("/", supportLimiter, authMiddleware, createSupportRequest);

module.exports = router;