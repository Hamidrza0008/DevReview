const rateLimit = require("express-rate-limit");

// General auth limiter (login, signup, forgot-password, reset-password)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // Limit each IP to 15 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        message: "Too many authentication requests from this IP. Please try again after 15 minutes."
    }
});

// Stricter rate limiter specifically for OTP verification to prevent 6-digit brute force
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 6, // Limit each IP to 6 OTP verification attempts per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many OTP verification attempts from this IP. Please try again after 15 minutes."
    }
});

// Rate limiter for chat/message sending
const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many chat messages from this IP. Please try again after 15 minutes."
    }
});

// Rate limiter for project creation
const projectCreateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many project creation requests from this IP. Please try again after 15 minutes."
    }
});

// Rate limiter for review creation/edit
const reviewCreateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many review requests from this IP. Please try again after 15 minutes."
    }
});

// Rate limiter for likes
const likeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many like requests from this IP. Please try again after 15 minutes."
    }
});

// Rate limiter for file uploads
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many upload requests from this IP. Please try again after 15 minutes."
    }
});

// Rate limiter for support requests
const supportLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many support requests from this IP. Please try again after 15 minutes."
    }
});

// Rate limiter for stats endpoint
const statsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP. Please try again after 15 minutes."
    }
});

// Rate limiter for leaderboard endpoint
const leaderboardLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP. Please try again after 15 minutes."
    }
});

module.exports = {
    authLimiter,
    otpLimiter,
    chatLimiter,
    projectCreateLimiter,
    reviewCreateLimiter,
    likeLimiter,
    uploadLimiter,
    supportLimiter,
    statsLimiter,
    leaderboardLimiter
};
