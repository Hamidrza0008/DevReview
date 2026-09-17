export const toggleFollow = async (username) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/follow`, {
            method: "POST",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to update follow status",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to update follow status" };
    }
};
