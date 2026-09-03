export const toggleSaveProject = async (projectId) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/save`,
            {
                method: "POST",
                credentials: "include",
            }
        );

        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
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

        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};