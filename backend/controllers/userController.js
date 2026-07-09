const Users = require("../models/Users");
const Projects = require("../models/Projects");
const Review = require("../models/Review");

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

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            user,
            totalProjects: projects.length,
            totalLikes,
            totalReviews,
        })
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
        }).select("name username bio profileImage skills githubUrl portfolioUrl");

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

                return {
                    ...user.toObject(),
                    totalProjects: projects.length,
                    totalLikes,
                    totalReviews,
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

module.exports = { getUserProfile, getAllUsers }