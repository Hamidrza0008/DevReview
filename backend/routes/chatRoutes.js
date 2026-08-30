const express = require("express");
const router = express.Router();

const { sendMessage, getConversations, getMessages, getUnreadCount, markAsRead, getUserById } = require("../controllers/chatController");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/send", authMiddleware, sendMessage);
router.get("/conversations", authMiddleware, getConversations);
router.get("/messages/:conversationId", authMiddleware, getMessages);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.patch("/messages/:conversationId/read", authMiddleware, markAsRead);
router.get("/user/:userId", authMiddleware, getUserById);

module.exports = router;
