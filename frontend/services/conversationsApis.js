export const getConversationsApi = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/conversations`, {
            method: "GET",
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.log(error);
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

        return await response.json();
    } catch (error) {
        console.log(error);
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

        return await response.json();
    } catch (error) {
        console.log(error);
    }
};

export const getUserByIdApi = async (userId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/user/${userId}`, {
            method: "GET",
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.log(error);
    }
};

export const getUnreadCountApi = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/unread-count`, {
            method: "GET",
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.log(error);
    }
};

export const markConversationAsReadApi = async (conversationId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${conversationId}/read`, {
            method: "PATCH",
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.log(error);
    }
};
