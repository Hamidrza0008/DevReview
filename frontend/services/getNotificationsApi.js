export const getNotifications = async ({ limit = 20, before } = {}) => {
    try {
        const params = new URLSearchParams({ limit: String(limit) });
        if (before) params.set("before", before);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/notifications?${params.toString()}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch notifications",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch notifications" };
    }
};

export const markNotificationRead = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`, {
            method: "PATCH",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to mark notification as read",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to mark notification as read" };
    }
};

export const markAllNotificationsRead = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`, {
            method: "PATCH",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to mark all notifications as read",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to mark all notifications as read" };
    }
};

export const getUnreadNotificationCountApi = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/unread-count`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch unread notification count",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch unread notification count" };
    }
};
