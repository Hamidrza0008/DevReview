const express = require("express");
const router = express.Router();

const { sendMessage, getConversations, getMessages } = require("../controllers/chatController");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/send", authMiddleware, sendMessage);
router.get("/conversations", authMiddleware, getConversations);
router.get("/messages/:conversationId", authMiddleware, getMessages);

module.exports = router;