export const getUserProfile = async(username) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`, {
            credentials: "include",
        });
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

export const getFollowers = async (username) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/followers`);
    return response.json();
};

export const getFollowing = async (username) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/following`);
    return response.json();
};
