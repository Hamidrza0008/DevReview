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

        const conversations = await Conversation.aggregate([
            { $match: { participants: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: "messages",
                    let: { convId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$conversationId", "$$convId"] },
                                        { $eq: ["$isRead", false] },
                                        { $ne: ["$sender", new mongoose.Types.ObjectId(userId)] },
                                    ],
                                },
                            },
                        },
                        { $count: "count" },
                    ],
                    as: "unreadDocs",
                },
            },
            {
                $addFields: {
                    unreadCount: {
                        $ifNull: [{ $arrayElemAt: ["$unreadDocs.count", 0] }, 0],
                    },
                },
            },
            { $unset: "unreadDocs" },
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participants",
                    pipeline: [
                        { $project: { username: 1, name: 1, profileImage: 1 } },
                    ],
                },
            },
            { $sort: { lastMessageAt: -1 } },
        ]);

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
        const { limit: limitStr, before } = req.query;

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

        const limit = Math.min(Math.max(parseInt(limitStr, 10) || 30, 1), 50);

        const query = { conversationId };
        if (before) {
            if (!mongoose.Types.ObjectId.isValid(before)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid cursor",
                });
            }
            query._id = { $lt: new mongoose.Types.ObjectId(before) };
        }

        const messages = await Message.find(query)
            .populate("sender", "username name profileImage")
            .sort({ createdAt: -1 })
            .limit(limit + 1);

        const hasMore = messages.length > limit;
        const sliced = hasMore ? messages.slice(0, limit) : messages;

        sliced.reverse();

        const nextCursor = hasMore && sliced.length > 0 ? sliced[0]._id.toString() : null;

        return res.status(200).json({
            success: true,
            data: {
                messages: sliced,
                hasMore,
                nextCursor,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await Message.aggregate([
            {
                $match: {
                    isRead: false,
                    sender: { $ne: new mongoose.Types.ObjectId(userId) },
                },
            },
            {
                $lookup: {
                    from: "conversations",
                    localField: "conversationId",
                    foreignField: "_id",
                    as: "conversation",
                },
            },
            { $unwind: "$conversation" },
            {
                $match: {
                    "conversation.participants": new mongoose.Types.ObjectId(userId),
                },
            },
            { $count: "total" },
        ]);

        const totalUnread = result.length > 0 ? result[0].total : 0;

        return res.status(200).json({
            success: true,
            data: { totalUnread },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const markAsRead = async (req, res) => {
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

        const result = await Message.updateMany(
            {
                conversationId: conversationId,
                sender: { $ne: new mongoose.Types.ObjectId(req.user.id) },
                isRead: false,
            },
            { $set: { isRead: true } }
        );

        return res.status(200).json({
            success: true,
            data: { modifiedCount: result.modifiedCount },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const user = await Users.findById(userId).select("name username profileImage");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
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
    getUnreadCount,
    markAsRead,
    getUserById,
};
