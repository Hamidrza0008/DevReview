export const getLeaderboard = async (page = 1, limit = 20) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/leaderboard?page=${page}&limit=${limit}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch leaderboard",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch leaderboard" };
    }
};

export const getMyRanking = async () => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/leaderboard/me`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch your ranking",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch your ranking" };
    }
};
