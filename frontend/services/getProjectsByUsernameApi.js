export const getProjectByUsername = async (username, params = {}) => {
    try {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.set("limit", params.limit);
        if (params.before) searchParams.set("before", params.before);
        const queryString = searchParams.toString();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/user/projects/${username}${queryString ? `?${queryString}` : ""}`;

        const res = await fetch(url, {
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