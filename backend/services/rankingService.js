const Leaderboard = require("../models/Leaderboard");

const POINTS = {
    CREATE_PROJECT: 20,
    RECEIVE_PROJECT_LIKE: 5,
    GIVE_REVIEW: 5,
    RECEIVE_REVIEW: 10,
    RECEIVE_FOLLOWER: 2,
    PROFILE_COMPLETED: 10,
    GITHUB_ADDED: 5,
    LIVE_DEMO_ADDED: 5,
};

const CATEGORY_MAP = {
    CREATE_PROJECT: "projectPoints",
    RECEIVE_PROJECT_LIKE: "likePoints",
    GIVE_REVIEW: "reviewPoints",
    RECEIVE_REVIEW: "reviewPoints",
    RECEIVE_FOLLOWER: "followerPoints",
    PROFILE_COMPLETED: "projectPoints",
    GITHUB_ADDED: "projectPoints",
    LIVE_DEMO_ADDED: "projectPoints",
};

const addRankingPoints = async (userId, action) => {
    try {
        const points = POINTS[action];
        if (points === undefined) return;

        const category = CATEGORY_MAP[action];

        const leaderboard = await Leaderboard.findOneAndUpdate(
            { user: userId },
            {
                $inc: {
                    score: points,
                    [category]: points,
                },
            },
            { new: true, upsert: true }
        );

        return leaderboard;
    } catch (error) {
        // Silently fail to not break main functionality
    }
};

const removeRankingPoints = async (userId, action) => {
    try {
        const points = POINTS[action];
        if (points === undefined) return;

        const category = CATEGORY_MAP[action];

        const leaderboard = await Leaderboard.findOneAndUpdate(
            { user: userId },
            {
                $inc: {
                    score: -points,
                    [category]: -points,
                },
            },
            { new: true }
        );

        if (leaderboard) {
            await Leaderboard.findOneAndUpdate(
                { user: userId, score: { $lt: 0 } },
                { $set: { score: 0 } }
            );
            await Leaderboard.findOneAndUpdate(
                { user: userId, [category]: { $lt: 0 } },
                { $set: { [category]: 0 } }
            );
        }

        return leaderboard;
    } catch (error) {
        // Silently fail to not break main functionality
    }
};

const ensureLeaderboard = async (userId) => {
    try {
        const existing = await Leaderboard.findOne({ user: userId });
        if (existing) return existing;

        return await Leaderboard.create({ user: userId, score: 0 });
    } catch (error) {
        // Silently fail
    }
};

const recalculateScore = async (userId) => {
    try {
        const leaderboard = await Leaderboard.findOne({ user: userId });
        if (!leaderboard) return;

        leaderboard.score =
            leaderboard.projectPoints +
            leaderboard.reviewPoints +
            leaderboard.likePoints +
            leaderboard.followerPoints;

        await leaderboard.save();
        return leaderboard;
    } catch (error) {
        // Silently fail
    }
};

module.exports = {
    POINTS,
    addRankingPoints,
    removeRankingPoints,
    ensureLeaderboard,
    recalculateScore,
};
