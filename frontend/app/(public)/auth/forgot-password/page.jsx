import { Suspense } from "react";
import ForgotPassword from "@/Components/Auth/ForgotPassword"

export const metadata = {
  title: "Forgot Password",
  description: "Reset your DevReview account password.",
};

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