export const getUserProfile = async (username) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`, {
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/`, {
            method: "GET",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getFollowers = async (username) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/followers`, {
            method: "GET",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getFollowing = async (username) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/following`, {
            method: "GET",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};
