const Notification = require("../models/Notification");
const Projects = require("../models/Projects");
const Reviews = require("../models/Review");
const Users = require("../models/Users")
const mongoose = require("mongoose");
const { calculateAverageRating, getReviewStats } = require("../utils/calculateRating");
const { addRankingPoints } = require("../services/rankingService");



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

        await addRankingPoints(userId, "CREATE_PROJECT");

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

        const projectIds = projects.map((p) => p._id);

        const reviewsData = await Reviews.aggregate([
            { $match: { project: { $in: projectIds } } },
            {
                $group: {
                    _id: "$project",
                    count: { $sum: 1 },
                    totalRating: { $sum: "$rating" },
                },
            },
        ]);

        const reviewsMap = new Map();
        for (const r of reviewsData) {
            reviewsMap.set(r._id.toString(), {
                reviewsCount: r.count,
                averageRating: Number((r.totalRating / r.count).toFixed(1)),
            });
        }

        const updatedProjects = projects.map((proj) => {
            const likesCount = proj.likes.length;
            const isLiked = proj.likes.some((id) => id.toString() === userId);
            const stats = reviewsMap.get(proj._id.toString()) || { reviewsCount: 0, averageRating: 0 };

            return {
                ...proj.toObject(),
                likesCount,
                isLiked,
                reviewsCount: stats.reviewsCount,
                averageRating: stats.averageRating,
            }
        })

        return res.status(200).json({
            success: true,
            projects: updatedProjects,
        })
    } catch (error) {

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

        const currentUser = await Users.findById(userId).select("savedProjects");
        const isSaved = (currentUser?.savedProjects || []).some(
            (savedId) => savedId.toString() === id.toString()
        );

        const reviews = await Reviews.find({ project: id });
        const stats = getReviewStats(reviews);

        const enrichedProject = {
            ...project.toObject(),
            isLiked,
            isSaved,
            likesCount: project.likes.length,
            averageRating: stats.averageRating,
            reviewsCount: stats.reviewsCount
        };

        return res.status(200).json({
            success: true,
            isLiked,
            isSaved,
            likesCount: project.likes.length,
            project: enrichedProject,
            averageRating: stats.averageRating,
            reviewsCount: stats.reviewsCount
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
}

const getExploreProjects = async (req, res) => {
    try {
        const userId = req.user.id;

        const [projects, currentUser] = await Promise.all([
            Projects.find({})
                .populate("owner", "username fullName profileImage")
                .sort({ createdAt: -1 }),
            Users.findById(userId).select("savedProjects"),
        ]);

        const savedProjectIds = new Set(
            (currentUser?.savedProjects || []).map((id) => id.toString())
        );

        const projectIds = projects.map((p) => p._id);

        const reviewsData = await Reviews.aggregate([
            { $match: { project: { $in: projectIds } } },
            {
                $group: {
                    _id: "$project",
                    count: { $sum: 1 },
                    totalRating: { $sum: "$rating" },
                },
            },
        ]);

        const reviewsMap = new Map();
        for (const r of reviewsData) {
            reviewsMap.set(r._id.toString(), {
                reviewsCount: r.count,
                averageRating: Number((r.totalRating / r.count).toFixed(1)),
            });
        }

        const updatedProject = projects.map((proj) => {
            const likesCount = proj.likes.length;
            const isLiked = proj.likes.some((id) => id.toString() === userId);
            const reviewStats = reviewsMap.get(proj._id.toString()) || {
                reviewsCount: 0,
                averageRating: 0,
            };

            return {
                ...proj.toObject(),
                likesCount,
                isLiked,
                isSaved: savedProjectIds.has(proj._id.toString()),
                reviewsCount: reviewStats.reviewsCount,
                averageRating: reviewStats.averageRating,
            };
        });

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
        const { id } = req.params;

        const project = await Projects.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            })
        }

        if (project.owner.toString() !== req.user.id) {
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


        return res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            project
        })
    } catch (error) {

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

        await Users.updateMany(
            { savedProjects: id },
            { $pull: { savedProjects: id } }
        );

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully."
        });

    } catch (error) {

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

            await addRankingPoints(project.owner, "RECEIVE_PROJECT_LIKE");

            await Notification.create({
                recipient:project.owner,
                sender:userId,
                type:"like",
                project:project._id,
            })
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

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
const getProjectByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const loggedInUserId = req.user.id;

        // Find profile owner
        const user = await Users.findOne({ username }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }

        // Get all projects of profile owner
        const projects = await Projects.find({
            owner: user._id,
        }).sort({ createdAt: -1 });

        const projectIds = projects.map((p) => p._id);

        const reviewsData = await Reviews.aggregate([
            { $match: { project: { $in: projectIds } } },
            {
                $group: {
                    _id: "$project",
                    count: { $sum: 1 },
                    totalRating: { $sum: "$rating" },
                },
            },
        ]);

        const reviewsMap = new Map();
        for (const r of reviewsData) {
            reviewsMap.set(r._id.toString(), {
                reviewsCount: r.count,
                averageRating: Number((r.totalRating / r.count).toFixed(1)),
            });
        }

        const updatedProjects = projects.map((proj) => {
            const likesCount = proj.likes.length;

            const isLiked = proj.likes.some(
                (id) => id.toString() === loggedInUserId
            );

            const stats = reviewsMap.get(proj._id.toString()) || { reviewsCount: 0, averageRating: 0 };

            return {
                ...proj.toObject(),
                likesCount,
                isLiked,
                reviewsCount: stats.reviewsCount,
                averageRating: stats.averageRating,
            };
        });

        return res.status(200).json({
            success: true,
            message: "Projects Retrieved Successfully",
            projects: updatedProjects,
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const toggleSaveProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        // Check project exists
        const project = await Projects.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        const user = await Users.findById(userId);

        const alreadySaved = (user.savedProjects || []).some(
            (id) => id.toString() === projectId.toString()
        );

        if (alreadySaved) {
            user.savedProjects = user.savedProjects.filter(
                (id) => id.toString() !== projectId.toString()
            );

            await user.save();

            return res.status(200).json({
                success: true,
                saved: false,
                message: "Project removed from saved",
            });
        }

        user.savedProjects.push(projectId);

        await user.save();

        return res.status(200).json({
            success: true,
            saved: true,
            message: "Project saved successfully",
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getSavedProjects = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await Users.findById(userId).populate({
            path: "savedProjects",
            populate: {
                path: "owner",
                select: "name username profileImage",
            },
        });

        const validSavedProjects = user.savedProjects.filter(
            (project) => project && project._id
        );

        if (validSavedProjects.length !== user.savedProjects.length) {
            const validIds = validSavedProjects.map((p) => p._id);
            user.savedProjects = validIds;
            await user.save();
        }

        return res.status(200).json({
            success: true,
            savedProjects: validSavedProjects,
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { createProjects, getMyProjects, getProjectById, getExploreProjects, updateProject, deleteProject, getProjectForEdit, toggleLikes, getProjectByUsername, toggleSaveProject, getSavedProjects };