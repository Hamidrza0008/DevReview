const Users = require("../models/Users");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


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
    try {
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

        if (!user.password) {
            return res.status(400).json({
                message: "This account uses Google Sign-In. Please continue with Google."
            });
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Login successful",
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage,
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

}

const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: "Google credential is required"
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture, email_verified } = payload;

        if (!email_verified) {
            return res.status(400).json({
                message: "Google email is not verified"
            });
        }

        let user = await Users.findOne({ $or: [{ googleId }, { email }] });

        if (!user) {
            const base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "") || "user";
            let finalUsername = base;
            let suffix = 0;

            while (await Users.findOne({ username: finalUsername })) {
                suffix += 1;
                finalUsername = `${base}${suffix}`;
            }

            user = await Users.create({
                name,
                username: finalUsername,
                email,
                googleId,
                authProvider: "google",
                profileImage: picture || "",
                isVerified: true,
            });
        } else if (!user.googleId) {
            user.googleId = googleId;
            if (!user.profileImage && picture) user.profileImage = picture;
            user.isVerified = true;
            await user.save();
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Google sign-in successful",
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Google sign-in failed. Please try again."
        });
    }
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

        await OTP.deleteMany({
            email,
            type: "RESET_PASSWORD",
        });

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
        return res.status(500).json({
            success: false,
            message: error.message,
        });
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

        await Users.findOneAndUpdate(
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
        return res.status(500).json({
            success: false,
            message: error.message,
        });
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
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

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
            success: true,
            user: updateUser
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}


module.exports = { signUp, login, googleAuth, verifyOTP, forgotPassword, resetPassword, getMe, logout, updateMe }