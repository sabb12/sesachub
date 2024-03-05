const express = require("express");
const router = express.Router();
const controller = require("../controller/Creservation");

/* GET */
// /reservation
router.get("/", controller.main);

// /reservation/reserved
router.get("/reserved", controller.clickDay);

/* POST */
// /reservation
router.post("/", controller.createReservation);

module.exports = router;
