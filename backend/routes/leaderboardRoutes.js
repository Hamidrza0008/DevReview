const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
    getLeaderboard,
    getMyRanking,
    getUserRanking,
    initializeMissingLeaderboards,
} = require("../controllers/leaderboardController");

router.get("/", getLeaderboard);
router.get("/me", authMiddleware, getMyRanking);
router.get("/user/:userId", getUserRanking);
router.post("/initialize", authMiddleware, (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin access required" });
    }
    next();
}, initializeMissingLeaderboards);

module.exports = router;
