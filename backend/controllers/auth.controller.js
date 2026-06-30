const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");


const signUp = async (req, res) => {

    try {
        const {
            name,
            username,
            email,
            password,
        } = req.body;


        const existingUser = await User.findOne({
            $or: [
                { email }, { username }
            ]
        })

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });


        if (!user) {
            return res.status(400).json({
                message: "User registration failed"
            })
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

        await OTP.create({
            email,
            otp,
            expiresAt,
            type: "VERIFY_EMAIL"
        })

        await sendEmail(email, otp);

        return res.status(200).json({
            message: "OTP sent successfully",
            success: true
        })


    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: error.message
        });
    }
}

const verifyOTP = async (req, res) => {

    try {
        const { email, otp } = req.body;

        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({
                message: "OTP not found or expired"
            })
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            })
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({
                message: "OTP Expired"
            })
        }

        await User.findOneAndUpdate(
            { email },
            { isVerified: true }
        )

        await OTP.deleteOne({ email });

        return res.status(200).json({
            message: "Email verified successfully",
            success: true
        });

    }  catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: error.message
        });
    }

}


const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "User not found"
        });
    }

    if (!user.isVerified) {
        return res.status(400).json({
            message: "Please verify your email first"
        });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
        message: "Login successful",
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    })
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await OTP.create({
            email,
            otp,
            expiresAt,
            type: "RESET_PASSWORD"
        })

        await sendEmail(email, otp);

        return res.status(200).json({
            message: "Password reset OTP sent successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);
    }

}

const resetPassword = async (req, res) => {

    try {
        const {
            email,
            otp,
            newpassword
        } = req.body;

        const otpRecord = await OTP.findOne({
            email,
            otp,
            type: "RESET_PASSWORD"
        })

        if (!otpRecord) {
            return res.status(400).json({
                message: "OTP Not Found Or Invalid OTP"
            })
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({
                message: "OTP expired"
            })
        }

        const hashedPassword = await bcrypt.hash(newpassword, 10);

        await User.findOneAndUpdate(
            { email },
            { password: hashedPassword }
        )

        await OTP.findOneAndDelete({
            email,
            type: "RESET_PASSWORD"
        })

        return res.status(200).json({
            message: "Password reset successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }

}

module.exports = { signUp, login, verifyOTP, forgotPassword, resetPassword }