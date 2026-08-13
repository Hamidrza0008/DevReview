export const getConversationsApi = async() => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/conversations` , {
            method:"GET",
            credentials:"include"
        })

        return await response.json();
    } catch (error) {
        console.log(error);
    }
}
