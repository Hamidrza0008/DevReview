const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware")

const { signUp, verifyOTP, login, googleAuth, forgotPassword, resetPassword , getMe , logout , updateMe } = require("../controllers/auth.controller");
const {getUserProfile} = require("../controllers/userController")
router.post("/signup", signUp);

router.post("/verify-otp", verifyOTP);

router.post("/login", login);

router.post("/google", googleAuth);

router.post("/forgot-password" , forgotPassword);

router.post("/reset-password" , resetPassword);

router.get("/me" ,authMiddleware , getMe );
router.patch("/me" ,authMiddleware , updateMe );

router.post("/logout", logout);



module.exports = router;