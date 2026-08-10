const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const getNotifications = require("../controllers/notificationController");

router.get("/notifications" , authMiddleware , getNotifications);

module.exports = router