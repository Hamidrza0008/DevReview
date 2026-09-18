const express = require("express");
const router = express.Router();
const { getFeaturedProjects } = require("../controllers/projectController");
const { getLandingReviews } = require("../controllers/reviewController");
const { statsLimiter } = require("../middleware/rateLimiter.middleware");

router.get("/projects/featured", statsLimiter, getFeaturedProjects);
router.get("/reviews/landing", statsLimiter, getLandingReviews);

module.exports = router;
