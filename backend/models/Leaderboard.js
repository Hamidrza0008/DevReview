const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
            unique: true,
        },
        score: {
            type: Number,
            default: 0,
        },
        projectPoints: {
            type: Number,
            default: 0,
        },
        reviewPoints: {
            type: Number,
            default: 0,
        },
        likePoints: {
            type: Number,
            default: 0,
        },
        followerPoints: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

leaderboardSchema.index({ score: -1 });

module.exports = mongoose.model("Leaderboard", leaderboardSchema, "leaderboards");
