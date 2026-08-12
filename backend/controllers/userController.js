const Users = require("../models/Users");
const Projects = require("../models/Projects");
const Review = require("../models/Review");
const Notification = require("../models/Notification");

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

        const usersWithStats = await Promise.all(
            users.map(async (user) => {

                const projects = await Projects.find({ owner: user._id });

                const totalLikes = projects.reduce(
                    (acc, curr) => acc + curr.likes.length,
                    0
                );

                const projectIds = projects.map(project => project._id);

                const totalReviews = await Review.countDocuments({
                    project: { $in: projectIds }
                });

                const isFollowing = user.followers.some(
                    (id) => id.toString() === req.user.id
                );

                const { followers, ...userObj } = user.toObject();

                return {
                    ...userObj,
                    totalProjects: projects.length,
                    totalLikes,
                    totalReviews,
                    followersCount: followers.length,
                    isFollowing,
                };
            })
        );

        return res.status(200).json({
            success: true,
            users: usersWithStats
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getUserProfile, getAllUsers, toggleFollow, getFollowers, getFollowing }
