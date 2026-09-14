import { Suspense } from "react";
import VerifyOtp from "@/Components/Auth/VerifyOtp"

export const metadata = {
  title: "Verify Email",
  description: "Verify your email address to complete your DevReview account setup.",
};

const verifyOtp = () => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyOtp />
            </Suspense>
        </>
    )
}

export default verifyOtp;