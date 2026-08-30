const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getUnreadReviewCount, markReviewAsRead } = require("../controllers/reviewController");

router.get("/reviews/unread-count", authMiddleware, getUnreadReviewCount);
router.patch("/reviews/:reviewId/read", authMiddleware, markReviewAsRead);

module.exports = router;
