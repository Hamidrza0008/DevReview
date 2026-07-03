const express = require("express");
const router = express.Router();

const {getUserProfile, getAllUsers} = require("../controllers/userController");
const authMiddleware = require("../middleware/auth.middleware");


router.get("/:username" , getUserProfile);
router.get("/" ,authMiddleware, getAllUsers);


module.exports = router;