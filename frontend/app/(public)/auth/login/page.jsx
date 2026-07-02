import { Suspense } from "react";
import Login from "@/Components/Auth/Login"

const LoginPage = () => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Login />
            </Suspense>
            </>
    )
}
export default LoginPage;