const express = require("express");
const router = express.Router();

const {
  createSupportRequest,
} = require("../controllers/support.controller");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createSupportRequest);

module.exports = router;