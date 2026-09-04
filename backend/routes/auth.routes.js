const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { authLimiter, otpLimiter } = require("../middleware/rateLimiter.middleware");

const { signUp, verifyOTP, login, googleAuth, forgotPassword, resetPassword , getMe , logout , updateMe, changePassword } = require("../controllers/auth.controller");
router.post("/signup", authLimiter, signUp);

router.post("/verify-otp", otpLimiter, verifyOTP);

router.post("/login", authLimiter, login);

router.post("/google", googleAuth);

router.post("/forgot-password", authLimiter, forgotPassword);

router.post("/reset-password", authLimiter, resetPassword);

router.get("/me" ,authMiddleware , getMe );
router.patch("/me" ,authMiddleware , updateMe );
router.patch("/me/password", authMiddleware, changePassword);

router.post("/logout", logout);



module.exports = router;
