const express = require("express");
const router = express.Router();
const controller = require("../controller/Cadmin");

router.get("/", controller.main); //메인페이지진입
router.get("/userList", controller.userList); //유저 리스트 출력
router.patch("/user", controller.userPwReset);
router.delete("/user", controller.userDelete);
router.get("/reserve", controller.reserveList); //해당 날짜/스터디룸에대한 예약현황
router.delete("/reserve", controller.reserveDelete); //예약취소
router.get("/permission", controller.permissionList); //권한없는 회원 리스트조회
router.patch("/permission", controller.permissionAprove); //권한부여
module.exports = router;
