const express = require("express");
const { getProjectByUsername } = require("../controllers/projectController.js");
const router = express.Router();

router.get("/:username" , getProjectByUsername);

module.exports = router