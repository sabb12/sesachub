const express = require("express");
const router = express.Router();
const controller = require("../controller/Cboard");

router.get("/", controller.boardList); // 커뮤니티 진입
router.get("/insert", controller.boardWritePage); // 게시글 등록 페이지
router.post("/insert", controller.boardInsert); // 게시글 등록 요청 전송
router.get("/board", controller.board); // 커뮤니티 해당글 진입경로
router.get("/update", controller.boardUpdatePage); // 게시글 수정 페이지
router.patch("/", controller.boardPatch); // 게시글 수정 요청 전송
router.delete("/", controller.boardDelete); // 게시글 삭제

router.post("/comment", controller.commentInsert); // 댓글 대댓글 등록
router.delete("/comment", controller.commentDelete); // 댓글 대댓글 삭제
router.patch("/comment", controller.commentPatch); // 댓글 대댓글 수정
router.post("/like", controller.handleLike); // 해당 게시글 좋아요 등록 취소

router.post("/bookmark", controller.bookmarkInsert); // 북마크 등록
module.exports = router;
