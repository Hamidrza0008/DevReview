const Notification = require("../models/Notification");

const getNotifications = async(req, res) => {
    try {
        const userId = req.user.id;

        const notifications = await Notification.find({
            recipient: userId,
        })
            .populate("sender", "name username profileImage")
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

const markNotificationRead = async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, recipient: req.user.id },
        { $set: { isRead: true } },
        { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });
    return res.status(200).json({ success: true, notification });
};

const markAllNotificationsRead = async (req, res) => {
    await Notification.updateMany({ recipient: req.user.id, isRead: false }, { $set: { isRead: true } });
    return res.status(200).json({ success: true });
};

module.exports = { getNotifications, markNotificationRead, markAllNotificationsRead }
