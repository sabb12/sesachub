const express = require("express");
const router = express.Router();
const controller = require("../controller/Cprofile");

// GET /profile
router.get("/", controller.main);

module.exports = router;
