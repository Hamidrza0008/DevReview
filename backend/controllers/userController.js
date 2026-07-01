const User = require("../models/User");

const getUserProfile = async(req, res) => {
    try {
        const { username } = req.params

        const user = await User.findOne({ username }).select("-password");

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports={getUserProfile}