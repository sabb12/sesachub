const { user, reservation } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const saltRounds = 10;
// 초기화시 사용
function hashPw(pw) {
    return bcrypt.hashSync(pw, saltRounds);
}
//전체회원조희
exports.userList = async (req, res) => {
    const { category, search } = req.query;
    console.log(category, search);
    const page = req.query.page || 1;
    const pageSize = 10;
    let userList;
    try {
        let totalCount; //전체 유저 데이터의 숫자
        let totalPages; //전체유저 /10 해서 소수점 올림
        let offset; //오프셋 계산
        if (req.query.permission === "null") {
            console.log("진입");
            totalCount = await user.count({ where: { permission: null } });
            totalPages = Math.ceil(totalCount / pageSize);
            offset = (page - 1) * pageSize;
            if (category && search) {
                totalCount = await user.count({
                    where: {
                        [category]: {
                            [Op.like]: `%${search}%`,
                        },
                        permission: null,
                    },
                });
                totalPages = Math.ceil(totalCount / pageSize);
                if (totalPages === 1) {
                    totalPages = 0;
                }
                userList = await user.findAll({
                    where: {
                        [category]: {
                            [Op.like]: `%${search}%`,
                        },
                        permission: null,
                    },
                    limit: pageSize,
                    offset: offset,
                });
            } else if (!search && category) {
                res.render("admin/user", {
                    userList: [],
                    page: "",
                    totalPages: "",
                    permission: false,
                    category: category,
                    search: search,
                });
            } else {
                userList = await user.findAll({
                    where: { permission: null },
                    limit: pageSize,
                    offset: offset,
                });
            }
            res.render("admin/user", {
                userList: userList,
                page: page,
                totalPages: totalPages,
                permission: false,
                category: category,
                search: search,
            });
        } else {
            totalCount = await user.count();
            totalPages = Math.ceil(totalCount / pageSize);
            offset = (page - 1) * pageSize;
            if (category && search) {
                totalCount = await user.count({
                    where: {
                        [category]: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                });
                totalPages = Math.ceil(totalCount / pageSize);
                if (totalPages === 1) {
                    totalPages = 0;
                }
                totalCount = await user.count({
                    where: {
                        [category]: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                });
                totalPages = Math.ceil(totalCount / pageSize);
                offset = (page - 1) * pageSize;
                userList = await user.findAll({
                    where: {
                        [category]: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    limit: pageSize,
                    offset: offset,
                });
            } else if (!search && category) {
                res.render("admin/user", {
                    userList: [],
                    page: "",
                    totalPages: "",
                    permission: false,
                    category: category,
                    search: search,
                });
            } else {
                userList = await user.findAll({
                    limit: pageSize,
                    offset: offset,
                });
            }
            console.log("전체회원", category, search);
            res.render("admin/user", {
                userList: userList,
                page: page,
                totalPages: totalPages,
                permission: true,
                category: category,
                search: search,
            });
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
        console.log(req.query.r_id);
        const result = await reservation.destroy({
            where: { r_id: req.query.r_id },
        });
        if (result) {
            console.log("성공");
            res.send({ result: true });
        } else {
            res.send({ result: false });
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
