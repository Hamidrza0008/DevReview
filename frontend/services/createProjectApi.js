export const createProject = async (formdata) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formdata)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to create project",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to create project" };
    }
};