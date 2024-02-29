const express = require("express");
const router = express.Router();
const controller = require("../controller/Cboard");

router.get("/", controller.boardList);

module.exports = router;
