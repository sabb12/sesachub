const express = require("express");
const router = express.Router();
const controller = require("../controller/Cuser");

/* GET */
// /user
router.get("/", controller.main);

/* POST */
// /user/signup
router.post("/signup", controller.signup);

module.exports = router;
