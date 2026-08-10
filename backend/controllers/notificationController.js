const Notification = require("../models/Notification");

const getNotifications = (req, res) => {
    try {
        const userId = req.user.id;

        const notifications = await Notification.find({
            recipient: userId,
        })
            .populate("sender", "name profileImage")
            .populate("project", "title")
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            notifications
        })


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = getNotifications