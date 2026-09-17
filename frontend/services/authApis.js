export const signUp = async (userData) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to create account. Please try again.",
                ...data
            };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            message: error.message || "Network error. Please try again."
        };
    }
};

export const verifyOTP = async (dataPayload) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataPayload)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Invalid verification code. Please try again.",
                ...data
            };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            message: error.message || "Network error. Please try again."
        };
    }
};

export const login = async (dataPayload) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(dataPayload)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Invalid credentials. Please try again.",
                ...data
            };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            message: error.message || "Network error. Please try again."
        };
    }
};

export const googleAuth = async (credential) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ credential })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Google sign-in failed. Please try again.",
                ...data
            };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            message: error.message || "Network error. Please try again."
        };
    }
};

export const forgotPassword = async (dataPayload) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataPayload)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to initiate recovery. Please verify the email address.",
                ...data
            };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            message: error.message || "Network error. Please try again."
        };
    }
};

export const resetPassword = async (dataPayload) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataPayload)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to reset password. Please try again.",
                ...data
            };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            message: error.message || "Network error. Please try again."
        };
    }
};

export const getMe = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                user: null,
                message: data?.message || "Session expired or invalid",
                ...data
            };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            user: null,
            message: error.message || "Network error"
        };
    }
};

export const logOutMe = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Logout failed",
                ...data
            };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            message: error.message || "Network error"
        };
    }
};

export const updateProfile = async (formData) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Update Profile Error",
                ...data
            };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || "Update Profile Error" };
    }
};

export const changePassword = async (passwords) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/password`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(passwords),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Failed to update password",
                ...data
            };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            message: error.message || "Network error"
        };
    }
};
