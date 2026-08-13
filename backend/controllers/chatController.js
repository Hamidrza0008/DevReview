const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;
        const senderId = req.user.id;

        if (!receiverId || !text?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Receiver and message are required",
            });
        }

        const conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId]
            }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const message = await Message.create({
            conversationId: conversation._id,
            sender: senderId,
            text: text.trim()
        })

        conversation.lastMessage = text.trim();
        conversation.lastMessageSender = senderId;
        conversation.lastMessageAt = new Date();

        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data: message,
        })


    } catch (error) {
        console.error("Send Message Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });

    }
}

const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversation = await Conversation.find({
            participants: userId
        })
            .populate("participants", "username name profileImage")
            .sort({ lastMessageAt: -1 });

        return res.status(200).json({
            success: true,
            data: conversations,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });

    }
}



module.exports = {
    sendMessage,getConversations
};