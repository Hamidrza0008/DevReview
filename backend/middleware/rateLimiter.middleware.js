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

module.exports = {
    authLimiter,
    otpLimiter
};
