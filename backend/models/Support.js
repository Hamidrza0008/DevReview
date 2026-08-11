const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: String,
      enum: ["bug", "feature", "feedback", "support"],
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["new", "contacted"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

const SupportRequest = mongoose.model(
  "SupportRequest",
  supportRequestSchema
);
module.exports = SupportRequest;