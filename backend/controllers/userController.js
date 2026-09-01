const Users = require("../models/Users");
const Projects = require("../models/Projects");
const Review = require("../models/Review");
const Notification = require("../models/Notification");
const { addRankingPoints } = require("../services/rankingService");

const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params

        const user = await Users.findOne({ username }).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const projects = await Projects.find({ owner: user._id });
        const totalLikes = projects.reduce((acc, curr) => acc = acc + curr.likes.length, 0);
        const projectIds = projects.map((proj) => proj._id);
        const totalReviews = await Review.countDocuments({
            project: {
                $in: projectIds
            }
        })
        const authoredReviews = await Review.find({ user: user._id })
            .populate("project", "title")
            .sort({ createdAt: -1 })
            .limit(10);
        const recentProjects = projects
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);
        const activity = [
            ...recentProjects.map((project) => ({ type: "project", createdAt: project.createdAt, project: { _id: project._id, title: project.title } })),
            ...authoredReviews.map((review) => ({ type: "review", createdAt: review.createdAt, rating: review.rating, project: review.project })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 15);

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        const isFollowing = req.user
            ? user.followers.some((id) => id.toString() === req.user.id)
            : false;

        return res.status(200).json({
            success: true,
            user,
            totalProjects: projects.length,
            totalLikes,
            totalReviews,
            followersCount: user.followers.length,
            followingCount: user.following.length,
            isFollowing,
            activity,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const toggleFollow = async (req, res) => {
    try {
        const { username } = req.params;
        const currentUserId = req.user.id;

        const targetUser = await Users.findOne({ username });
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (targetUser._id.toString() === currentUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself",
            });
        }

        const currentUser = await Users.findById(currentUserId);

        const alreadyFollowing = targetUser.followers.some(
            (id) => id.toString() === currentUserId
        );

        if (alreadyFollowing) {
            targetUser.followers = targetUser.followers.filter(
                (id) => id.toString() !== currentUserId
            );
            currentUser.following = currentUser.following.filter(
                (id) => id.toString() !== targetUser._id.toString()
            );
        } else {
            targetUser.followers.push(currentUserId);
            currentUser.following.push(targetUser._id);

            await addRankingPoints(targetUser._id, "RECEIVE_FOLLOWER");

            await Notification.create({
                recipient:targetUser._id,
                sender:currentUserId,
                type:"follow",
            })
        }

        await targetUser.save();
        await currentUser.save();

        return res.status(200).json({
            success: true,
            isFollowing: !alreadyFollowing,
            followersCount: targetUser.followers.length,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getFollowers = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await Users.findOne({ username }).populate(
            "followers",
            "name username profileImage bio"
        );
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            followers: user.followers,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getFollowing = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await Users.findOne({ username }).populate(
            "following",
            "name username profileImage bio"
        );
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            following: user.following,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getAllUsers = async (req, res) => {

    try {

        const users = await Users.find({
            _id: { $ne: req.user.id }
        }).select("name username bio profileImage skills githubUrl portfolioUrl followers");

        const userIds = users.map((u) => u._id);

        const [projectsData, reviewsData] = await Promise.all([
            Projects.aggregate([
                { $match: { owner: { $in: userIds } } },
                {
                    $group: {
                        _id: "$owner",
                        totalProjects: { $sum: 1 },
                        totalLikes: { $sum: { $size: "$likes" } },
                    },
                },
            ]),
            Review.aggregate([
                {
                    $lookup: {
                        from: "projects",
                        localField: "project",
                        foreignField: "_id",
                        as: "projectInfo",
                    },
                },
                { $unwind: "$projectInfo" },
                { $match: { "projectInfo.owner": { $in: userIds } } },
                {
                    $group: {
                        _id: "$projectInfo.owner",
                        totalReviews: { $sum: 1 },
                    },
                },
            ]),
        ]);

        const projectsMap = new Map();
        for (const p of projectsData) {
            projectsMap.set(p._id.toString(), {
                totalProjects: p.totalProjects,
                totalLikes: p.totalLikes,
            });
        }

        const reviewsMap = new Map();
        for (const r of reviewsData) {
            reviewsMap.set(r._id.toString(), r.totalReviews);
        }

        const usersWithStats = users.map((user) => {
            const stats = projectsMap.get(user._id.toString()) || {
                totalProjects: 0,
                totalLikes: 0,
            };
            const totalReviews = reviewsMap.get(user._id.toString()) || 0;

            const isFollowing = user.followers.some(
                (id) => id.toString() === req.user.id
            );

            const { followers, ...userObj } = user.toObject();

            return {
                ...userObj,
                totalProjects: stats.totalProjects,
                totalLikes: stats.totalLikes,
                totalReviews,
                followersCount: followers.length,
                isFollowing,
            };
        });

        return res.status(200).json({
            success: true,
            users: usersWithStats
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

module.exports = { getUserProfile, getAllUsers, toggleFollow, getFollowers, getFollowing }
