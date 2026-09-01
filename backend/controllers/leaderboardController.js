const Leaderboard = require("../models/Leaderboard");
const Users = require("../models/Users");
const mongoose = require("mongoose");

const getLeaderboard = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await Leaderboard.countDocuments();

        const entries = await Leaderboard.find({})
            .populate("user", "name username profileImage")
            .sort({ score: -1 })
            .skip(skip)
            .limit(limit);

        const data = entries.map((entry, index) => ({
            rank: skip + index + 1,
            user: entry.user,
            score: entry.score,
        }));

        return res.status(200).json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getMyRanking = async (req, res) => {
    try {
        const userId = req.user.id;

        const leaderboard = await Leaderboard.findOne({ user: userId });

        if (!leaderboard) {
            return res.status(404).json({
                success: false,
                message: "Leaderboard record not found",
            });
        }

        const rank = await Leaderboard.countDocuments({
            score: { $gt: leaderboard.score },
        }) + 1;

        return res.status(200).json({
            success: true,
            data: {
                rank,
                score: leaderboard.score,
                projectPoints: leaderboard.projectPoints,
                reviewPoints: leaderboard.reviewPoints,
                likePoints: leaderboard.likePoints,
                followerPoints: leaderboard.followerPoints,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getUserRanking = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
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

        const leaderboard = await Leaderboard.findOne({ user: userId });

        if (!leaderboard) {
            return res.status(404).json({
                success: false,
                message: "Leaderboard record not found",
            });
        }

        const rank = await Leaderboard.countDocuments({
            score: { $gt: leaderboard.score },
        }) + 1;

        return res.status(200).json({
            success: true,
            data: {
                user,
                rank,
                score: leaderboard.score,
                projectPoints: leaderboard.projectPoints,
                reviewPoints: leaderboard.reviewPoints,
                likePoints: leaderboard.likePoints,
                followerPoints: leaderboard.followerPoints,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const initializeMissingLeaderboards = async (req, res) => {
    try {
        const allUsers = await Users.find({}).select("_id");
        const allUserIds = allUsers.map((u) => u._id);

        const existingLeaderboards = await Leaderboard.find({
            user: { $in: allUserIds },
        }).select("user");
        const existingUserIds = new Set(
            existingLeaderboards.map((l) => l.user.toString())
        );

        const missingUsers = allUserIds.filter(
            (id) => !existingUserIds.has(id.toString())
        );

        if (missingUsers.length > 0) {
            const docs = missingUsers.map((userId) => ({
                user: userId,
                score: 0,
                projectPoints: 0,
                reviewPoints: 0,
                likePoints: 0,
                followerPoints: 0,
            }));

            await Leaderboard.insertMany(docs, { ordered: false });
        }

        return res.status(200).json({
            success: true,
            message: `Initialized ${missingUsers.length} missing leaderboard records`,
            initialized: missingUsers.length,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    getLeaderboard,
    getMyRanking,
    getUserRanking,
    initializeMissingLeaderboards,
};
