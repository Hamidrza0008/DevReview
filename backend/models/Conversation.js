const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
     participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
    ],

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
} , {
    timestamps:true,
})

const Conversation = mongoose.model("Conversation" , conversationSchema);

module.exports = Conversation;