const express = require("express");
const router = express.Router();

const { sendMessage, getConversations, getMessages, getUserById } = require("../controllers/chatController");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/send", authMiddleware, sendMessage);
router.get("/conversations", authMiddleware, getConversations);
router.get("/messages/:conversationId", authMiddleware, getMessages);
router.get("/user/:userId", authMiddleware, getUserById);

module.exports = router;
