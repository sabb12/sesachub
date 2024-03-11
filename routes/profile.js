const express = require("express");
const router = express.Router();
const controller = require("../controller/Cprofile");

/* ----------------- GET ------------------ */
// /profile
router.get("/", controller.main);

// /profile/confirmation
router.get("/confirmation", controller.confirmation);

// /profile/posting
router.get("/posting", controller.findAllPosting);

// /profile/deleteAccount
router.get("/deleteAccount", controller.deleteAccount);

/* ----------------- PATCH ------------------ */
// /profile
router.patch("/", controller.updateProfile);

// /profile/password
router.patch("/password", controller.updatePassword);
/* ----------------- DELETE ------------------ */
// /profile/image
router.delete("/image", controller.deleteProfileImg);
// /profile/reservation
router.delete("/reservation", controller.deleteReservation);

// /profile/bookmark
router.delete("/bookmark", controller.deleteBookmark);
module.exports = router;
