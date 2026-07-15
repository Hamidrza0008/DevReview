require("dotenv").config();


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});


transporter.verify(function (error, success) {

    if (error) {
        console.log(error);
    } else {
        console.log("SMTP Ready");
    }

});

const sendEmail = async (email, otp) => {
    try {

        const info = await transporter.sendMail({
            from: `"DevReview" <${process.env.EMAIL}>`,
            to: email,
            subject: "DevReview Verification OTP",
            html: `
                <h2>Your OTP is ${otp}</h2>
            `,
        });

        console.log(info);

    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = sendEmail;

// const { Resend } = require("resend");

// const resend = new Resend(process.env.RESEND_API_KEY);

// const sendEmail = async (email , otp) => {
    
//     await resend.emails.send({
//         from: "onboarding@resend.dev",
//         to: email,
//         subject: "DevReview Verification OTP",
//         html: `
//                 <h2>Your OTP is ${otp}</h2>
//                 <p>This OTP is valid for 5 minutes</p>
//             `
//     })
// }

// module.exports = sendEmail;