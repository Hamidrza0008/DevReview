const mongoose = require("mongoose");
const Users = require("./Users");

const notificationSchema = new mongoose.Schema({
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
    type:{
        type:String,
        enum:["like" , "review", "follow"],
        required:true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Notification  = mongoose.model("Notification" , notificationSchema);
module.exports = Notification;