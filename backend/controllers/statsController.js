const Users = require("../models/Users");
const Reviews = require("../models/Review");
const Projects = require("../models/Projects");

const getStats = async (req, res) => {
    try {
        const [developers, projects, reviews, likesResult] = await Promise.all([
            Users.countDocuments(),
            Projects.countDocuments(),
            Reviews.countDocuments(),
            Projects.aggregate([
                { $project: { count: { $size: "$likes" } } },
                { $group: { _id: null, total: { $sum: "$count" } } },
            ]),
        ])

        const likes = likesResult.length > 0 ? likesResult[0].total : 0;

        return res.status(200).json({
            success: true,
            developers,
            projects,
            reviews,
            likes,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch stats",
            error: error.message,
        });
    }
}

module.exports = {getStats}