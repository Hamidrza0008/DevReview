const express = require("express");
const router = express.Router();

const {sendMessage , getConversations} = require("../controllers/chatController");

router.post("/send" , sendMessage);
router.get("/conversations", getConversations);


module.exports = router;