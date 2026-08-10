export const getNotifications = async () => {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
            method: "GET",
            credentials: "include",
        });

        return await response.json()

    } catch (error) {
        console.log(error);

    }
}

