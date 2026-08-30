const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Users = require("../models/Users");

const sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;
        const senderId = req.user.id;

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver is required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid receiver ID",
            });
        }

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message text is required",
            });
        }

        if (text.trim().length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Message cannot exceed 5000 characters",
            });
        }

        if (receiverId === senderId) {
            return res.status(400).json({
                success: false,
                message: "Cannot send a message to yourself",
            });
        }

        const receiver = await Users.findById(receiverId).select("_id");
        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: "Receiver not found",
            });
        }

        const sortedParticipants = [senderId, receiverId].sort();

        let conversation = await Conversation.findOne({
            participants: { $all: sortedParticipants },
            $expr: { $eq: [{ $size: "$participants" }, 2] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: sortedParticipants,
            });
        }

        const message = await Message.create({
            conversationId: conversation._id,
            sender: senderId,
            text: text.trim(),
        });

        conversation.lastMessage = text.trim();
        conversation.lastMessageSender = senderId;
        conversation.lastMessageAt = new Date();

        await conversation.save();

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: {
                message,
                conversationId: conversation._id,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await Conversation.find({
            participants: userId,
        })
            .populate("participants", "username name profileImage")
            .sort({ lastMessageAt: -1 });

        return res.status(200).json({
            success: true,
            data: conversations,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID",
            });
        }

        const conversation = await Conversation.findById(conversationId).select("participants");

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        const isParticipant = conversation.participants.some(
            (id) => id.toString() === req.user.id
        );

        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message: "You are not a participant in this conversation",
            });
        }

        const messages = await Message.find({ conversationId })
            .populate("sender", "username name profileImage")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    sendMessage,
    getConversations,
    getMessages,
};
