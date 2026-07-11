const Users = require("../models/Users");
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


        const existingUser = await Users.findOne({
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

        const user = await Users.create({
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

        await Users.findOneAndUpdate(
            { email },
            { isVerified: true }
        )

        await OTP.deleteOne({ email });

        return res.status(200).json({
            message: "Email verified successfully",
            success: true
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: error.message
        });
    }

}


const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });

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

    res.cookie(
        "token",
        token,
        {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    )

    return res.status(200).json({
        message: "Login successful",
        success: true,
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

        const user = await Users.findOne({ email });

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

const getMe = async (req, res) => {
    try {
        const userId = req.user.id

        const user = await Users.findById(userId).select("-password");

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server error"
        })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false, // production me true (https)
            sameSite: "strict",
        })

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server error"
        });

    }
}

const updateMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const allowedFields = [
            "name",
            "username",
            "role",
            "bio",
            "skills",
            "profileImage",
            "githubUrl",
            "portfolioUrl"
        ]

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        })

        if (updates.skills && !Array.isArray(updates.skills)) {
            updates.skills = [];
        }

        const updateUser = await Users.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        return res.status(200).json({
            message: "User Updated Successfully",
            success: "true",
            user: updateUser
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}


module.exports = { signUp, login, verifyOTP, forgotPassword, resetPassword, getMe, logout, updateMe }