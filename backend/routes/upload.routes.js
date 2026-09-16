const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth.middleware");
const { uploadLimiter } = require("../middleware/rateLimiter.middleware");


router.post("/", uploadLimiter, authMiddleware, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Image upload error:", err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size exceeds the 5MB limit",
        });
      }
      if (err.message === "Only JPG, JPEG, PNG and WEBP images are allowed.") {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Failed to upload image. Please try again later.",
      });
    }


    res.json({
      success: true,
      imageUrl: req.file?.path,
    });
  });
});
module.exports = router;