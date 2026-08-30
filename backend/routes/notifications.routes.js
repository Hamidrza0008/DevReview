const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getNotifications, markNotificationRead, markAllNotificationsRead, getUnreadNotificationCount } = require("../controllers/notificationController");

router.get("/notifications/unread-count", authMiddleware, getUnreadNotificationCount);
router.get("/notifications" , authMiddleware , getNotifications);
router.patch("/notifications/read-all", authMiddleware, markAllNotificationsRead);
router.patch("/notifications/:id/read", authMiddleware, markNotificationRead);

module.exports = router
