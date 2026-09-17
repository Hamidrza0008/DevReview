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

export const getSavedProjects = async () => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projects/saved/me`,
            {
                method: "GET",
                credentials: "include",
            }
        );

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