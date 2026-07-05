const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },


    description: {
        type: String,
        required: true,
        trim: true
    },


    thumbnail: {
        type: String,
        default: ""
    },


    techStack: [
        {
            type: String
        }
    ],


    githubUrl: {
        type: String,
        default: ""
    },


    liveUrl: {
        type: String,
        default: ""
    },


    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },


    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        }
    ],
}, { timestamps: true })

const projects = mongoose.model("projects", projectSchema);

module.exports = projects;