import { Suspense } from "react";

import ResetPassword from "@/Components/Auth/ResetPassword"

export const metadata = {
  title: "Reset Password",
  description: "Set a new password for your DevReview account.",
};

const resetPassword = () => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPassword />
            </Suspense>        
        </>
    )
}

export default resetPassword;