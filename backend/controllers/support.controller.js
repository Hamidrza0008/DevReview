const SupportRequest = require("../models/Support");

const createSupportRequest = async (req, res) => {
  try {
    const { category, subject, message, name, email } = req.body;

    if (!category || !subject || !message || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const supportRequest = await SupportRequest.create({
      user: req.user.id,
      name,
      email,
      category,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Support request submitted successfully",
      data: supportRequest,
    });
  } catch (error) {
    console.error("Create Support Request Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createSupportRequest,
};