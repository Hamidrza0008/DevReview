const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
     project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projects",
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },

    review: {
        type: String,
        required: true,
        trim: true,
    },

    isEdited: {
        type: Boolean,
        default: false,
    },

    isRead: {
        type: Boolean,
        default: false,
    }

} , {
    timestamps:true
});

reviewSchema.index(
    {
        project:1,
        user:1
    },
    {
        unique : true
    }
)

reviewSchema.index({ project: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ project: 1, isRead: 1 });

const Reviews = mongoose.model("Reviews" , reviewSchema);

module.exports = Reviews;