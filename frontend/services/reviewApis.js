export const addReviews = async (id, reviewRating, reviewComment) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/review`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                rating: reviewRating,
                review: reviewComment,
            })
        })

        return await response.json()
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Something went wrong"
        };
    }
}

export const getReviews = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/review`, {
            method: "GET",
            credentials: "include",
        })

        return await response.json();
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Something went wrong"
        };
    }
}

export const deleteReview = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/review`, {
            method: "DELETE",
            credentials: "include",
        })
        return await response.json();
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Something went wrong"
        };
    }
}