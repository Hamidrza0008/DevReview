const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {createProjects , getMyProjects , getProjectById , getExploreProjects, updateProject, deleteProject} = require("../controllers/projectController.js");


router.post("/" , authMiddleware , createProjects);
router.get("/my" , authMiddleware , getMyProjects);
router.get("/explore", getExploreProjects);
router.get("/:id" , authMiddleware , getProjectById);
router.delete("/:id" , authMiddleware , deleteProject);
router.put("/:id/edit" , authMiddleware , updateProject);



module.exports = router;