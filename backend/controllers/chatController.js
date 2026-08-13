const Conversation = require("../models/Conversation");

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
            participants:{
                $all:[senderId , receiverId]
            }
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId , receiverId]
            })
        }


    } catch (error) {

    }
}