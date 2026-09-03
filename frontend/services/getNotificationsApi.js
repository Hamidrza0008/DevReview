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

        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const markNotificationRead = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`, {
            method: "PATCH",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const markAllNotificationsRead = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`, {
            method: "PATCH",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getUnreadNotificationCountApi = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/unread-count`, {
            method: "GET",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};
