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

export const getAllUsers = async (params = {}) => {
    try {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.set("limit", params.limit);
        if (params.before) searchParams.set("before", params.before);
        const queryString = searchParams.toString();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/users/${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
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

export const getFollowers = async (username, params = {}) => {
    try {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.set("limit", params.limit);
        if (params.before) searchParams.set("before", params.before);
        const queryString = searchParams.toString();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/followers${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
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

export const getFollowing = async (username, params = {}) => {
    try {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.set("limit", params.limit);
        if (params.before) searchParams.set("before", params.before);
        const queryString = searchParams.toString();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/following${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
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
