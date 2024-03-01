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

/* Delete */
// /user
router.delete("/", controller.deleteUser);

module.exports = router;