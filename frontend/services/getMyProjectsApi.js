export const getMyProjects = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/my`, {
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