export const getStats = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch stats",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch stats" };
    }
};