const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email) => {
    if (!email || typeof email !== "string") return "Email is required";
    if (!EMAIL_REGEX.test(email.trim())) return "Please provide a valid email address";
    return null;
};

const validatePassword = (password) => {
    if (!password || typeof password !== "string") return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    return null;
};

module.exports = { validateEmail, validatePassword };
