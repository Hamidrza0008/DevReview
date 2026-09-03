export const getMyProjects = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/my`, {
            method: "GET",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};