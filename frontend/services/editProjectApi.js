export const getProjectDetails = async (id) => {

    try {
        const respone = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
            method: "GET",
            credentials: "include",
        })

        return await respone.json();

    } catch (error) {
        console.log(error);
    }
}

export const updateProject = async (id , formdata) => {
    try {
        const respone = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/edit`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(formdata)
        })

        return await respone.json();
    } catch (error) {
        console.log(error);
    }
}

export const deleteProject = async (id) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );

        return await response.json();
    } catch (error) {
        console.log(error);
    }
};