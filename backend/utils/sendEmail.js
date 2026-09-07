require("dotenv").config();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email , otp) => {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "DevReview Verification OTP",
            html: `
                    <h2>Your OTP is ${otp}</h2>
                    <p>This OTP is valid for 5 minutes</p>
                `
        })
    } catch (error) {
        console.error("Failed to send email:", error.message);
    }
}

module.exports = sendEmail;