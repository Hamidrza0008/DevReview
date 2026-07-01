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
        ref: "User",
        required: true
    },


    likes: {
        type: Number,
        default: 0
    },


    reviews: {
        type: Number,
        default: 0
    },
} , {timestamps:true})

const project = mongoose.model("projects" , projectSchema);

module.exports = project;