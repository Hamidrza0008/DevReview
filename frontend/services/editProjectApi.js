export const getProjectDetails = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/edit`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch project details",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to fetch project details" };
    }
};

export const updateProject = async (id, formdata) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/edit`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formdata)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to update project",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to update project" };
    }
};

export const deleteProject = async (id) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to delete project",
                ...data,
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Failed to delete project" };
    }
};