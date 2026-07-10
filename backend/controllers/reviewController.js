const Reviews = require("../models/Review");
const Projects = require("../models/Projects");
const mongoose = require("mongoose");
const { report } = require("../routes/projectRoutes");

const addReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, review } = req.body;
        const { id } = req.params;

        const project = await Projects.findById(id);

        if (!project) {
            return res.status(404).json({
                "success": false,
                "message": "Project not found"
            })
        }

        if (userId === project.owner.toString()) {
            return res.status(403).json({
                "success": false,
                "message": "You cannot review your own project."
            })
        }
        if (rating < 1 || rating > 5) {
            return res.status(403).json({
                success: false,
                message: "Invalid Rating",
            })
        }

        if (!review || !review.trim()) {
            return res.status(403).json({
                success: false,
                message: "Invalid Reivew",
            })
        }

        const isExists = await Reviews.findOne({
            project: id,
            user: userId,
        })

        if (isExists) {
            return res.status(403).json({
                success: false,
                "message": "You have already reviewed this project."
            })
        }

        const newReview = await Reviews.create({
            project: id,
            user: userId,
            rating,
            review
        })

        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            review: newReview,
        });


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const project = await Projects.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found",
            })
        }

        const reviews = await Reviews.find({
            project: id,
        }).populate("user", "username name profileImage").sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            reviews,
            reviewsCount: reviews.length,

        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Project ID",
            });
        }

        const project = await Projects.findById(id);
        if (!project) {
            return res.status(404).json({
                "success": false,
                "message": "Project not found."
            })
        }

        const review = await Reviews.findOne({
            project: id,
            user: userId,
        })

        if (!review) {
            return res.status(404).json({
                "success": false,
                "message": "Review not found."
            })
        }

        await review.deleteOne();
        return res.status(200).json(
            {
                "success": true,
                "message": "Review deleted successfully."
            }
        )
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getReviewForEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const project = await Projects.findById(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found",
            })
        }

        const review = await Reviews.findOne({
            project: id,
            user: userId
        })

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review Not Found",
            })
        }

        return res.status(200).json({
            success: true,
            review,
        })


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const editReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        console.log(res.body)
        const { reviewRating, reviewComment} = req.body;

        if (!reviewComment || !reviewRating || reviewRating < 1 || reviewRating > 5 || reviewComment.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Invalid Input Found"
            })
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Project ID"
            });
        }

        const project = await Projects.findById(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found"
            })
        }


        const existingReview = await Reviews.findOne({
            project: id,
            user: userId
        })

        if (!existingReview) {
            return res.status(404).json({
                success: false,
                message: "Reveiw Not Found"
            })
        }

        existingReview.rating = reviewRating;
        existingReview.review = reviewComment;
        existingReview.isEdited = true;

        await existingReview.save();

        return res.status(200).json({
            success: true,
            message: "Review updated successfully.",
            review: existingReview,
        });


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getCurrentUserReview = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. User ke saare projects
        const projects = await Projects.find({
            owner: userId,
        }).select("_id title likes");

        const projectIds = projects.map(project => project._id);

        // 2. User ne diye hue reviews
        const givenReviews = await Reviews.find({
            user: userId,
        })
            .populate("project", "title thumbnail slug")
            .sort({ createdAt: -1 });

        // 3. User ke projects pe aaye reviews
        const receivedReviews = await Reviews.find({
            project: {
                $in: projectIds,
            },
        })
            .populate("user", "username name profileImage")
            .populate("project", "title thumbnail")
            .sort({ createdAt: -1 });

        // 4. Likes Details
        const projectLikes = projects.map(project => ({
            projectId: project._id,
            title: project.title,
            likesCount: project.likes.length,
            likes: project.likes,
        }));

        // 5. Total Likes
        const totalLikes = projects.reduce((total, project) => {
            return total + project.likes.length;
        }, 0);

        return res.status(200).json({
            success: true,

            stats: {
                totalProjects: projects.length,
                totalLikes,
                totalGivenReviews: givenReviews.length,
                totalReceivedReviews: receivedReviews.length,
            },

            givenReviews,

            receivedReviews,

            projectLikes,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { addReviews, getReviews, deleteReview, getReviewForEdit, editReview , getCurrentUserReview };
