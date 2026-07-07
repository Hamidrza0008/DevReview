const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {createProjects , getMyProjects , getProjectById , getExploreProjects, updateProject, deleteProject , getProjectForEdit, toggleLikes} = require("../controllers/projectController.js");
const { addReviews, getReviews, deleteReview } = require("../controllers/reviewController.js");


router.post("/", authMiddleware, createProjects);

router.get("/my", authMiddleware, getMyProjects);

router.get("/explore",authMiddleware, getExploreProjects);

router.get("/:id/edit", authMiddleware, getProjectForEdit);

router.put("/:id/edit", authMiddleware, updateProject);

router.get("/:id", authMiddleware, getProjectById);

router.post("/:id/review", authMiddleware, addReviews);
router.get("/:id/review", authMiddleware, getReviews);
router.delete("/:id/review", authMiddleware, deleteReview);

router.post("/:id/like", authMiddleware, toggleLikes);

router.delete("/:id", authMiddleware, deleteProject);


module.exports = router;