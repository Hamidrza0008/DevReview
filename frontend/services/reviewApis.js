export const addReviews = async (id, reviewRating, reviewComment) => {
    try {
        let rating = reviewRating;
        let comment = reviewComment;

        if (typeof reviewRating === "object" && reviewRating !== null) {
            rating = reviewRating.rating !== undefined ? reviewRating.rating : reviewRating.reviewRating;
            comment = reviewRating.review !== undefined ? reviewRating.review : reviewRating.reviewComment;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/review`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                rating: rating,
                review: comment,
                reviewRating: rating,
                reviewComment: comment,
            })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to add review",
                ...data
            };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            message: error.message || "Something went wrong"
        };
    }
};

export const getReviews = async (id, params = {}) => {
    try {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.set("limit", params.limit);
        if (params.before) searchParams.set("before", params.before);
        const queryString = searchParams.toString();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/review${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch reviews",
                ...data
            };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            message: error.message || "Something went wrong"
        };
    }
};

export const deleteReview = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/review`, {
            method: "DELETE",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to delete review",
                ...data
            };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            message: error.message || "Something went wrong"
        };
    }
};

export const editReview = async (id, reviewRating, reviewComment) => {
    try {
        let rating = reviewRating;
        let comment = reviewComment;

        if (typeof reviewRating === "object" && reviewRating !== null) {
            rating = reviewRating.reviewRating !== undefined ? reviewRating.reviewRating : reviewRating.rating;
            comment = reviewRating.reviewComment !== undefined ? reviewRating.reviewComment : reviewRating.review;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/review`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                rating: rating,
                review: comment,
                reviewRating: rating,
                reviewComment: comment,
            })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to update review",
                ...data
            };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            message: error.message || "Something went wrong"
        };
    }
};

export const getMyReviews = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/my-reviews`, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch reviews",
                ...data
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Something went wrong" };
    }
};

export const getUnreadReviewCountApi = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/unread-count`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to fetch unread review count",
                ...data
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Something went wrong" };
    }
};

export const markReviewAsReadApi = async (reviewId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}/read`, {
            method: "PATCH",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to mark review as read",
                ...data
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Something went wrong" };
    }
};