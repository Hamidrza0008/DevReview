export const createProject = async (formdata) => {
    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials:"include",
            body: JSON.stringify(formdata)
        })

        return await response.json();

    } catch (error) {
        console.log(error.message);
    }
}