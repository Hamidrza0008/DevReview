const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth.middleware");
const { uploadLimiter } = require("../middleware/rateLimiter.middleware");


router.post("/", uploadLimiter, authMiddleware, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }


    res.json({
      success: true,
      imageUrl: req.file?.path,
    });
  });
});
module.exports = router;