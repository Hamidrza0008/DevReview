export const getExploreProjects = async ({ limit = 20, before } = {}) => {
    try {
        const params = new URLSearchParams({ limit: String(limit) });
        if (before) params.set("before", before);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projects/explore?${params.toString()}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch explore projects",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch explore projects" };
    }
};