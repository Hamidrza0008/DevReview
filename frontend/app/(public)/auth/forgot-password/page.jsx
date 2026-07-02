import { Suspense } from "react";
import ForgotPassword from "@/Components/Auth/ForgotPassword"

const ForgotPasswordPage = () => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <ForgotPassword />
            </Suspense>
        </>
    )
}
export default ForgotPasswordPage;