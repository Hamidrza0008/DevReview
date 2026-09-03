export const getExploreProjects = async () => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projects/explore`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};