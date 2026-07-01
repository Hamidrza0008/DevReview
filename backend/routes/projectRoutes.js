const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const createProjects = require("../controllers/projectController.js");


router.post("/" , authMiddleware , createProjects);



module.exports = router;