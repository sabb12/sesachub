const express = require("express");
const router = express.Router();
const controller = require("../controller/Cprofile");
const uploadDetail = require("../util/multer");

/* ----------------- GET ------------------ */
// /profile
router.get("/", controller.main);

// /profile/confirmation
router.get("/confirmation", controller.confirmation);

// /profile/posting
router.get("/posting", controller.findAllPosting);

// /profile/deleteAccount
router.get("/deleteAccount", controller.deleteAccount);

/* ------------------ POST ------------------ */
// pagination
router.post("/posting/", controller.findPosts);

/* ----------------- PATCH ------------------ */
// /profile
router.patch("/", controller.updateProfile);

// /profile/password
router.patch("/password", controller.updatePassword);

// /profile/image
router.patch("/image", uploadDetail.single("profile_img"), controller.updateProfileImg);

/* ----------------- DELETE ------------------ */
// /profile/image
router.delete("/image", controller.deleteProfileImg);
// /profile/reservation
router.delete("/reservation", controller.deleteReservation);

// /profile/bookmark
router.delete("/bookmark", controller.deleteBookmark);
module.exports = router;
