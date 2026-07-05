export const toggleLikes = async(id) => {
    try {
        console.log(id);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/like` , {
            method:"POST",
            credentials:"include",
        })

        return await response.json();
    } catch (error) {
        console.log(error);
    }
}