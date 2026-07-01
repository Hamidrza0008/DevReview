export const getUserProfile = async(username) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`);
        console.log(response)

        return await response.json();
    } catch (error) {
        console.log(error);
    }
} 