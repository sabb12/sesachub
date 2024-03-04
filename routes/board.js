const express = require("express");
const router = express.Router();
const controller = require("../controller/Cboard");

router.get("/", controller.boardList); //커뮤니티 집입경로
router.delete("/", controller.boardDelete);//게시글 삭제
router.post("/",controller.boardInsert)//게시글 등록
router.patch("/",controller.boardPatch)//게시글 수정
router.get("/board", controller.board); //커뮤니티 해당글 진입경로
router.post("/like", controller.handleLike); //해당 게시글 좋아요 등록 취소
router.post("/comment",controller.commentInsert)//댓글 대댓글 등록
module.exports = router;
