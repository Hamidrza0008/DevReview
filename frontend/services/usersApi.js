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
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/followers`, {
            method: "GET",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getFollowing = async (username) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/following`, {
            method: "GET",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};
