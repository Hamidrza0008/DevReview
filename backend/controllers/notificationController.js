const mongoose = require("mongoose");
const Notification = require("../models/Notification");

const getNotifications = async(req, res) => {
    try {
        const userId = req.user.id;
        const { limit: limitStr, before } = req.query;

        const limit = Math.min(Math.max(parseInt(limitStr, 10) || 20, 1), 50);

        const query = { recipient: userId };
        if (before) {
            if (!mongoose.Types.ObjectId.isValid(before)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid cursor",
                });
            }
            query._id = { $lt: new mongoose.Types.ObjectId(before) };
        }

        const notifications = await Notification.find(query)
            .populate("sender", "name username profileImage")
            .populate("project", "title")
            .sort({ createdAt: -1 })
            .limit(limit + 1);

        const hasMore = notifications.length > limit;
        if (hasMore) notifications.pop();

        const nextCursor = hasMore && notifications.length > 0
            ? notifications[notifications.length - 1]._id.toString()
            : null;

        return res.status(200).json({
            success: true,
            notifications,
            hasMore,
            nextCursor,
        })


    } catch (error) {

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

const getUnreadNotificationCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({ recipient: req.user.id, isRead: false });
        return res.status(200).json({
            success: true,
            data: { unreadCount: count },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { getNotifications, markNotificationRead, markAllNotificationsRead, getUnreadNotificationCount }
