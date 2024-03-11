const express = require("express");
const router = express.Router();
const controller = require("../controller/Cadmin");

router.get("/user", controller.userList); //유저 리스트 출력
router.patch("/user", controller.userPwReset); //비밀번호 초기화
router.delete("/user", controller.userDelete); //유저 삭제
router.get("/reserve", controller.reserveList); //해당 날짜/스터디룸에대한 예약현황
router.delete("/reserve", controller.reserveDelete); //예약취소
router.patch("/permission", controller.permissionAprove); //권한부여
router.patch("/course", controller.courseUpdate); //클레스 수정
router.get("/course", controller.courseList);
router.patch("/courseupdate", controller.courseupdate);
module.exports = router;
