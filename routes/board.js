const express = require("express");
const router = express.Router();
const controller = require("../controller/Cboard");

router.get("/", controller.boardList); //커뮤니티 집입경로
router.get("/board", controller.board); //커뮤니티 해당글 진입경로
router.post("/like", controller.handleLike); //해당 게시글 좋아요 등록 취소
module.exports = router;
