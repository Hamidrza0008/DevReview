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

        return await response.json()

    } catch (error) {
        console.log(error);

    }
}

export const markNotificationRead = async (id) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
    });
    return response.json();
};

export const markAllNotificationsRead = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`, {
        method: "PATCH",
        credentials: "include",
    });
    return response.json();
};

export const getUnreadNotificationCountApi = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/unread-count`, {
        method: "GET",
        credentials: "include",
    });
    return response.json();
};

