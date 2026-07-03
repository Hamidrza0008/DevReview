export const getUserProfile = async(username) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`);
        console.log(response)

        return await response.json();
    } catch (error) {
        console.log(error);
    }
} 
export const getAllUsers = async() => {
    try {
        const respone = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/` , {
            method:"GET",
            credentials:"include",
        })

        return await respone.json()
    } catch (error) {
        console.log(error);
    }
}