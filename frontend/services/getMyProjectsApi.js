export const getMyProjects = async (params = {}) => {
    try {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.set("limit", params.limit);
        if (params.before) searchParams.set("before", params.before);
        const queryString = searchParams.toString();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/projects/my${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch your projects",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch your projects" };
    }
};