"use client"
import { createContext, useContext, useState, useEffect } from "react";
import { getMe, logOutMe } from "@/services/authApis";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [initialized, setInitialized] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);
    const fetchUser = async () => {
        try {
            const res = await getMe();
            setUser(res.user);

        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
            setInitialized(true);
        }
    };

    useEffect(() => {
        fetchUser()
    }, [])


    const logout = async () => {
        try {
            await logOutMe();

            setUser(null);
            router.push("/")
            showToast("success", "Logged out successfully. See you soon!");

        } catch (error) {
            console.log(error);
            showToast("error", "Something went wrong while logging out.");
        }
    }

    return <AuthContext.Provider value={{ user, setUser, loading, logout, initialized, fetchUser }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);
