const express = require("express");
const router = express.Router();
const controller = require("../controller/Cadmin");
// const permission = (req, res, next) => {
//     if (req.session.permission != 'admin') {
//         return res.render('user/signin', { message: '진입 불가능한 경로입니다.' }); // 세션이 없으면 로그인 페이지로 리디렉션
//     }
//     next();
// };
// router.get("/", permission,controller.main); //메인페이지진입
// router.get("/",controller.main); //메인페이지진입
router.get("/user", controller.userList); //유저 리스트 출력
router.patch("/user", controller.userPwReset); //비밀번호 초기화
router.delete("/user", controller.userDelete); //유저 삭제
router.get("/reserve", controller.reserveList); //해당 날짜/스터디룸에대한 예약현황
router.delete("/reserve", controller.reserveDelete); //예약취소
router.patch("/permission", controller.permissionAprove); //권한부여
module.exports = router;
