const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        trim: true,
        default: "",
    },
    profileImage: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    skills: {
        type: [String],
        default: []
    },
    githubUrl: {
        type: String,
        default: ""
    },
    portfolioUrl: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    savedProjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "projects",
        },
    ],
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Users", userSchema, "users");