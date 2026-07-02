const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {createProjects , getMyProjects , getProjectById , getExploreProjects} = require("../controllers/projectController.js");


router.post("/" , authMiddleware , createProjects);
router.get("/my" , authMiddleware , getMyProjects);
router.get("/explore", getExploreProjects);
router.get("/:id" , authMiddleware , getProjectById);



module.exports = router;