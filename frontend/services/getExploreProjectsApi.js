export const getExploreProjects = async () => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projects/explore`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        console.log("Status:", response.status);

        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.log(error);
    }
};