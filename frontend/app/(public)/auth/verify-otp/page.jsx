import { Suspense } from "react";
import VerifyOtp from "@/Components/Auth/VerifyOtp"

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