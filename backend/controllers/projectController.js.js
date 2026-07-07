const Projects = require("../models/Projects");
const Reviews = require("../models/Review");
const User = require("../models/Users")
const mongoose = require("mongoose");



const createProjects = async (req, res) => {
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


const getMyProjects = async (req, res) => {
    try {
        const projects = await Projects.find({
            owner: req.user.id
        }).sort({ createdAt: -1 })

        const userId = req.user.id;

        const updatedProjects = projects.map((project) => {

            const likesCount = project.likes.length;

            const isLiked = project.likes.some(
                (id) => id.toString() === userId
            );

            return {
                ...project.toObject(),
                likesCount,
                isLiked,
            };
        });
        return res.status(200).json({
            success: true,
            projects: updatedProjects,
        })
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Project ID",
            });
        }

        const project = await Projects.findById(id).populate("owner", "username fullname profileImage");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            })
        }

        const isLiked = project.likes.some((id) => id.toString() === userId);

        const reviews = await Reviews.find({ project: id });
        const reviewsCount = reviews.length
        const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        const avgRating = reviewsCount > 0 ? Number(totalRating / reviewsCount).toFixed(1) : 0;


        return res.status(200).json({
            success: true,
            isLiked,
            likesCount: project.likes.length,
            project,
            averageRating: avgRating,
            reviewsCount: reviewsCount

        })
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
}

const getExploreProjects = async (req, res) => {
    try {
        const userId = req.user.id;

        const projects = await Projects.find({})
            .populate("owner", "username fullName profileImage")
            .sort({ createdAt: -1 }
        );

        


        // const updatedProject = projects.map((proj) => {

        //     const likesCount = proj.likes.length;
        //     const isLiked = proj.likes.some((id) => id.toString() === userId);

        //     return {
        //         ...proj.toObject(),
        //         likesCount,
        //         isLiked,
        //     }
        // })

        const updatedProject = await Promise.all(
            projects.map(async (proj) => {

                const reviews = await Reviews.find({
                    project: proj._id
                });

                const likesCount = proj.likes.length;
                const isLiked = proj.likes.some((id) => id.toString() === userId);

                const reviewsCount = reviews.length;
                const totalRating = reviews.reduce((acc , curr) => acc+curr.rating  , 0);
                const averageRating = reviewsCount>0?Number((totalRating/reviewsCount).toFixed(1)) : 0;

                return {
                    ...proj.toObject(),
                    likesCount,
                    isLiked,
                    reviewsCount,
                    averageRating
                }
            })


        )

        return res.status(200).json({
            success: true,
            projects: updatedProject,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getProjectForEdit = async (req, res) => {
    try {
        console.log("rpoject")
        const { id } = req.params;

        const project = await Projects.findById(id);
        console.log(project)

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            })
        }

        console.log({
            projectOwner: project.owner.toString(),
            loggedInUser: req.user.id,
            isEqual: project.owner.toString() === req.user.id,
        });

        if (project.owner.toString() !== req.user.id) {
            console.log("hamid")
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this project."
            })
        }

        return res.status(200).json({
            success: true,
            project,
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Projects.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found"
            })
        }
        // console.log("Project Owner :", project.owner.toString());
        // console.log("Logged User :", req.user.id);
        // console.log("Project Id :", id);

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Sorry , Your are not the Owner of this Project",
            })
        }

        const {
            title,
            description,
            thumbnail,
            techStack,
            githubUrl,
            liveUrl
        } = req.body;

        project.title = title || project.title;
        project.description = description || project.description;
        project.thumbnail = thumbnail || project.thumbnail;
        project.githubUrl = githubUrl || project.githubUrl;
        project.liveUrl = liveUrl || project.liveUrl;

        if (techStack) {
            project.techStack = techStack;
        }

        await project.save();

        console.log("✅ Project saved");

        return res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            project
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
}

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Projects.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Sorry, You are not the owner of this project."
            });
        }

        await project.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully."
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const toggleLikes = async (req, res) => {

    try {
        const { id } = req.params;

        const userId = req.user.id;

        const project = await Projects.findById(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            })
        }

        const alreadyLiked = project.likes.some(
            (id) => id.toString() === userId
        );
        if (alreadyLiked) {
            project.likes = project.likes.filter((id) => id.toString() !== userId);
        }
        else {
            project.likes.push(userId);
        }

        await project.save();

        return res.status(200).json({
            success: true,
            message: alreadyLiked
                ? "Project unliked successfully"
                : "Project liked successfully",
            isLiked: !alreadyLiked,
            likesCount: project.likes.length
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
module.exports = { createProjects, getMyProjects, getProjectById, getExploreProjects, updateProject, deleteProject, getProjectForEdit, toggleLikes };