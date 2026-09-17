export const getProjectByUsername = async (username) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/projects/${username}`, {
            method: "GET",
            credentials: "include",
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch user projects",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch user projects" };
    }
};