const { user, reservation } = require("../models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// 초기화시 사용
function hashPw(pw) {
    return bcrypt.hashSync(pw, saltRounds);
}
exports.main = (req, res) => {
    res.render("admin/main");
};
//전체회원조희
exports.userList = async (req, res) => {
    try {
        if (req.query.permission === "null") {
            const userList = await user.findAll({
                where: { permission: null },
            });
            res.render("admin/user", { userList: userList });
        } else {
            const userList = await user.findAll();
            res.render("admin/user", { userList: userList });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
//예약현황 리스트
exports.reserveList = async (req, res) => {
    try {
        const { day, st_room } = req.query;
        console.log(day, st_room);

        if ((day, st_room)) {
            const reserveList = await reservation.findAll({
                where: {
                    day: day,
                    st_room: st_room,
                },
            });
            console.log("진입");

            res.send(reserveList);
        } else {
            res.render("admin/reservation");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
// 예약 취소
exports.reserveDelete = async (req, res) => {
    try {
        const result = await reservation.destroy({
            where: { r_id: req.query.r_id },
        });
        if (result) {
            res.send(true);
        } else {
            res.send(false);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
// 권한 부여
exports.permissionAprove = async (req, res) => {
    console.log("진입");
    console.log(req.body);
    try {
        const result = await user.update(
            {
                permission: "student",
            },
            {
                where: { u_id: req.body.u_id },
            },
        );

        if (result) {
            res.send(true);
        } else {
            res.send(false);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
//유저 비밀번호 초기화
exports.userPwReset = async (req, res) => {
    const pwReset = await user.update(
        {
            pw: hashPw("sessac123"),
        },
        {
            where: { u_id: req.body.u_id },
        },
    );

    if (pwReset) {
        res.send(true);
    } else {
        res.send(false);
    }
};
// 유저 탈퇴
exports.userDelete = async (req, res) => {
    const result = await user.destroy({
        where: { u_id: req.query.u_id },
    });
    if (result) {
        res.send(true);
    } else {
        res.send(false);
    }
};
