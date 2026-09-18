export const toggleSaveProject = async (projectId) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/save`,
            {
                method: "POST",
                credentials: "include",
            }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to toggle save project",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to toggle save project" };
    }
};

export const getSavedProjects = async (params = {}) => {
    try {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.set("limit", params.limit);
        if (params.before) searchParams.set("before", params.before);
        const queryString = searchParams.toString();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/projects/saved/me${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch saved projects",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch saved projects" };
    }
};