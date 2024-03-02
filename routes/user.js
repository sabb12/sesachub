const express = require("express");
const router = express.Router();
const controller = require("../controller/Cuser");

/* GET */
// /user
router.get("/", controller.main);

/* POST */
// /user/signup
router.post("/signup", controller.signup);

// /user/signin
router.post("/signin", controller.signin);

// /user/logout
router.post("/logout", controller.logout);

/* Delete */

// /user
router.delete("/", controller.deleteUser);

module.exports = router;
