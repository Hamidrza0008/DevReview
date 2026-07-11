const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");


router.post("/", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Multer Error:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    console.log(req.file);

    res.json({
      success: true,
      imageUrl: req.file?.path,
    });
  });
});
module.exports = router;