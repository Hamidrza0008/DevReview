export const getProjectByUsername = async (username) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/projects/${username}`, {
            method: "GET",
            credentials: "include",
        })
        return await res.json();
    } catch (error) {
        console.log(error.message);
    }
}