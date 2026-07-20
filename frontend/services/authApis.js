export const signUp = async (userData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })

    return await response.json();
}

export const verifyOTP = async (data) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    return await response.json();
}

export const login = async (data) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    })

    return await response.json();
}

export const googleAuth = async (credential) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ credential })
    })

    return await response.json();
}

export const forgotPassword = async (data) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    return await response.json();
}

export const resetPassword = async (data) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    return await response.json();
}

export const getMe = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
    })

    return await response.json();
}

export const logOutMe = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    })

    return await response.json();
}

export const updateProfile = async (formData) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me` , {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),

        })

        return await response.json()
    } catch (error) {
        console.log("Update Profile Error:", error);
    }
}