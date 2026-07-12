"use client"
import { createContext, useContext, useState, useEffect } from "react";
import { getMe, logOutMe } from "@/services/authApis";
import { AwardIcon } from "lucide-react";
import { useRouter } from "next/navigation";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [initialized, setInitialized] = useState(false);
    const router = useRouter();
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);
    const fetchUser = async () => {
        try {
            const res = await getMe();
            setUser(res.user);
            console.log("GET ME", res);

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
            router.push("/auth/login")

        } catch (error) {
            console.log(error);
        }
    }

    return <AuthContext.Provider value={{ user, setUser, loading, logout, initialized, fetchUser }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);