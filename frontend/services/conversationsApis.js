export const getConversationsApi = async (params = {}) => {
    try {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.set("limit", params.limit);
        if (params.before) searchParams.set("before", params.before);
        const queryString = searchParams.toString();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/chat/conversations${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch conversations",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch conversations" };
    }
};

export const sendMessageApi = async (receiverId, text) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ receiverId, text }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to send message",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to send message" };
    }
};

export const getMessagesApi = async (conversationId, { limit = 20, before } = {}) => {
    try {
        const params = new URLSearchParams({ limit: String(limit) });
        if (before) params.set("before", before);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${conversationId}?${params.toString()}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch messages",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch messages" };
    }
};

export const getUserByIdApi = async (userId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/user/${userId}`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch user details",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch user details" };
    }
};

export const getUnreadCountApi = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/unread-count`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch unread count",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch unread count" };
    }
};

export const markConversationAsReadApi = async (conversationId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${conversationId}/read`, {
            method: "PATCH",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to mark conversation as read",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to mark conversation as read" };
    }
};
