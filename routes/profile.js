const express = require("express");
const router = express.Router();
const controller = require("../controller/Cprofile");

/* ----------------- GET ----------------- */
// /profile
router.get("/", controller.main);

// /profile/confirmation
router.get("/confirmation", controller.confirmation);

// /profile/user
router.get("/user", controller.findOneUser);

// /profile/reservation
router.get("/reservation", controller.findAllReservation);

/* ----------------- PATCH ----------------- */
// /profile
router.patch("/", controller.updateProfile);

module.exports = router;
