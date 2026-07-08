const Users = require("../models/Users");
const Reviews = require("../models/Review");
const Projects = require("../models/Projects");

const getStats = async (req, res) => {
    try {
        const [developers, projects, reviews] = await Promise.all([
            Users.countDocuments(),
            Projects.countDocuments(),
            Reviews.countDocuments(),
        ])

        return res.status(200).json({
            success: true,
            developers,
            projects,
            reviews,
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