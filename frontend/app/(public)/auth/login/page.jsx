import { Suspense } from "react";
import Login, { LoginSkeleton } from "@/Components/Auth/Login"

export const metadata = {
  title: "Login",
  description: "Sign in to your DevReview account to showcase projects and get feedback.",
};

const LoginPage = () => {
    return (
        <>
            <Suspense fallback={<LoginSkeleton/>}>
                <Login />
            </Suspense>
            </>
    )
}
export default LoginPage;