const Projects = require("../models/Projects");

const createProjects = async(req, res) => {
    try {
        const userId = req.user.id;

        const {
            title,
            description,
            thumbnail,
            techStack,
            githubUrl,
            liveUrl
        } = req.body;

        const project = await Projects.create({
            title,
            description,
            thumbnail,
            techStack,
            githubUrl,
            liveUrl,

            owner: userId,
        })

        return res.status(200).json({
            success: true,
            message: "Project Created Successfully",
            project
        })
    } catch (error) {
        res.status(500).json({

            success: false,
            message: error.message

        })
    }
}

module.exports = createProjects;