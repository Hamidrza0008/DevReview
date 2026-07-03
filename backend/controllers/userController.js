const Users = require("../models/Users");

const getUserProfile = async(req, res) => {
    try {
        const { username } = req.params

        const user = await Users.findOne({ username }).select("-password");

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

const getAllUsers = async(req , res ) => {

    try {
        
        const allUsers = await Users.find({_id: { $ne: req.user.id }}).select("name username bio profileImage skills githubUrl portfolioUrl");

        return res.status(200).json({
            success:true,
            allUsers,
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports={getUserProfile , getAllUsers}