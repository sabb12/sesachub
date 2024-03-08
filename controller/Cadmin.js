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
    const page = req.query.page || 1;
    const pageSize = 10;
    let userList;
    try {
        let totalCount; //전체 유저 데이터의 숫자
        let totalPages; //전체유저 /10 해서 소수점 올림
        let offset; //오프셋 계산
        if (req.query.permission === "null") {
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
                    order: [["cs_id", "ASC"]],
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
                    order: [["cs_id", "ASC"]],
                });
                totalPages = Math.ceil(totalCount / pageSize);
                offset = (page - 1) * pageSize;
                userList = await user.findAll({
                    where: {
                        [category]: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    order: [["cs_id", "ASC"]],
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
                    order: [["cs_id", "ASC"]],
                });
            }
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

        if ((day, st_room)) {
            const reserveList = await reservation.findAll({
                where: {
                    day: day,
                    st_room: st_room,
                },
                include: [
                    {
                        model: user,
                        attributes: undefined, // 가져오고 싶은 유저 정보의 열을 선택합니다.
                    },
                ],
                order: [["time", "ASC"]],
            });

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
    try {
        const { u_id, selectValue } = req.body;
        let result;
        if (
            selectValue === "user" ||
            selectValue === "graduate_student" ||
            selectValue === "admin"
        ) {
            result = await user.update(
                {
                    permission: selectValue,
                    cs_id: "10",
                },
                {
                    where: { u_id: req.body.u_id },
                },
            );
        } else {
            result = await user.update(
                {
                    permission: "student",
                },
                {
                    where: { u_id: req.body.u_id },
                },
            );
        }

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
            pw: hashPw("sesac123"),
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
    try {
        const result = await user.destroy({
            where: { u_id: req.query.u_id },
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
// 클레스 수정
exports.courseUpdate = async (req, res) => {
    // try {
    //     const { u_id, course } = req.body;
    //     console.log(u_id, course);
    //     const result = await user.update(
    //         {
    //             course: course,
    //         },
    //         {
    //             where: { u_id: u_id },
    //         },
    //     );
    //     if (result) {
    //         res.send(true);
    //     } else {
    //         res.send(false);
    //     }
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send("Server Error");
    // }
};
