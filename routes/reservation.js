const express = require("express");
const router = express.Router();
const controller = require("../controller/Creservation");

// GET /reservation
router.get("/", controller.reservation);

module.exports = router;
