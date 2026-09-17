export const getUserProfile = async (username) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch user profile",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch user profile" };
    }
};

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch users",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch users" };
    }
};

export const getFollowers = async (username) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/followers`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch followers",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch followers" };
    }
};

export const getFollowing = async (username) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/following`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch following",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch following" };
    }
};
