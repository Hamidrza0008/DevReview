const Reviews = require("../models/Review");
const Projects = require("../models/Projects");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const Users = require("../models/Users");
const { addRankingPoints } = require("../services/rankingService");

const addReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, review } = req.body;
        const { id } = req.params;

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

        await addRankingPoints(userId, "GIVE_REVIEW");
        await addRankingPoints(project.owner, "RECEIVE_REVIEW");
        
        const projectOwner = await Users.findById(project.owner).select("notificationPreferences");
        if (projectOwner?.notificationPreferences?.reviewAlerts !== false) {
            await Notification.create({
                recipient:project.owner,
                sender:userId,
                type:"review",
                project:project._id
            })
        }

        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            review: newReview,
        });


    } catch (error) {
        console.error("Add review error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit: limitStr, before } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Project ID",
            });
        }

        const project = await Projects.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found",
            })
        }

        const limit = Math.min(Math.max(parseInt(limitStr, 10) || 20, 1), 50);

        const query = { project: id };
        if (before) {
            if (!mongoose.Types.ObjectId.isValid(before)) {
                return res.status(400).json({ success: false, message: "Invalid cursor" });
            }
            query._id = { $lt: new mongoose.Types.ObjectId(before) };
        }

        const reviews = await Reviews.find(query)
            .populate("user", "username name profileImage")
            .sort({ createdAt: -1 })
            .limit(limit + 1);

        const hasMore = reviews.length > limit;
        if (hasMore) reviews.pop();
        const nextCursor = hasMore && reviews.length > 0
            ? reviews[reviews.length - 1]._id.toString()
            : null;

        const totalCount = await Reviews.countDocuments({ project: id });

        return res.status(200).json({
            success: true,
            reviews,
            reviewsCount: totalCount,
            hasMore,
            nextCursor,
        });

    } catch (error) {
        console.error("Get reviews error:", error);
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
        console.error("Delete review error:", error);
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
        console.error("Edit review error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getCurrentUserReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit: limitStr, before } = req.query;
        const limit = Math.min(Math.max(parseInt(limitStr, 10) || 20, 1), 50);

        // 1. User ke saare projects (needed for stats and likes)
        const projects = await Projects.find({
            owner: userId,
        }).select("_id title likes");

        const projectIds = projects.map(project => project._id);

        // 2. User ne diye hue reviews (paginated)
        const givenQuery = { user: userId };
        if (before) {
            if (!mongoose.Types.ObjectId.isValid(before)) {
                return res.status(400).json({ success: false, message: "Invalid cursor" });
            }
            givenQuery._id = { $lt: new mongoose.Types.ObjectId(before) };
        }

        const givenReviews = await Reviews.find(givenQuery)
            .populate("project", "title thumbnail slug")
            .sort({ createdAt: -1 })
            .limit(limit + 1);

        const hasMoreGiven = givenReviews.length > limit;
        if (hasMoreGiven) givenReviews.pop();
        const nextCursor = hasMoreGiven && givenReviews.length > 0
            ? givenReviews[givenReviews.length - 1]._id.toString()
            : null;

        // 3. Total counts for stats (using aggregation)
        const [givenCountResult, receivedCountResult] = await Promise.all([
            Reviews.countDocuments({ user: userId }),
            Reviews.countDocuments({ project: { $in: projectIds } }),
        ]);

        // 4. User ke projects pe aaye reviews (paginated from same cursor)
        const receivedQuery = { project: { $in: projectIds } };
        if (before) {
            if (!mongoose.Types.ObjectId.isValid(before)) {
                return res.status(400).json({ success: false, message: "Invalid cursor" });
            }
            receivedQuery._id = { $lt: new mongoose.Types.ObjectId(before) };
        }

        const receivedReviews = await Reviews.find(receivedQuery)
            .populate("user", "username name profileImage")
            .populate("project", "title thumbnail")
            .sort({ createdAt: -1 })
            .limit(limit + 1);

        const hasMoreReceived = receivedReviews.length > limit;
        if (hasMoreReceived) receivedReviews.pop();

        // 5. Likes Details
        const projectLikes = projects.map(project => ({
            projectId: project._id,
            title: project.title,
            likesCount: project.likes.length,
            likes: project.likes,
        }));

        // 6. Total Likes
        const totalLikes = projects.reduce((total, project) => {
            return total + project.likes.length;
        }, 0);

        return res.status(200).json({
            success: true,

            stats: {
                totalProjects: projects.length,
                totalLikes,
                totalGivenReviews: givenCountResult,
                totalReceivedReviews: receivedCountResult,
            },

            givenReviews,

            receivedReviews,

            projectLikes,
        });

    } catch (error) {
        console.error("Get current user review error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getUnreadReviewCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const projects = await Projects.find({ owner: userId }).select("_id");
        const projectIds = projects.map(p => p._id);

        const count = await Reviews.countDocuments({
            project: { $in: projectIds },
            isRead: false,
        });

        return res.status(200).json({
            success: true,
            data: { unreadCount: count },
        });
    } catch (error) {
        console.error("Get unread review count error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const markReviewAsRead = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID",
            });
        }

        const review = await Reviews.findById(reviewId).populate("project", "owner");

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        if (review.project.owner.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        if (review.isRead) {
            return res.status(200).json({
                success: true,
                message: "Review already read",
            });
        }

        review.isRead = true;
        await review.save();

        return res.status(200).json({
            success: true,
            message: "Review marked as read",
        });
    } catch (error) {
        console.error("Mark review as read error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { addReviews, getReviews, deleteReview, editReview , getCurrentUserReview, getUnreadReviewCount, markReviewAsRead };
