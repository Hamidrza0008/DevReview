export const toggleFollow = async (username) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/follow`, {
            method: "POST",
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.log(error);
    }
}
