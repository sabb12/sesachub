const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { user, reservation, board, bookMark, course } = require("../models");

const bcrypt = require("bcrypt");
const saltRounds = 10;

function hashPw(pw) {
    return bcrypt.hashSync(pw, saltRounds);
}
function comparePw(inputPw, hashedPw) {
    return bcrypt.compareSync(inputPw, hashedPw);
}

exports.main = async (req, res) => {
    try {
        const { u_id } = req.session;
        const userInfo = await user.findOne({ where: { u_id } });
        const courseInfo = await course.findOne({ where: { cs_id: userInfo.cs_id } });
        // console.log("userInfo ::", userInfo);
        // console.log("courseInfo ::", courseInfo);
        res.render("profile/main", { userInfo, courseInfo });
    } catch (error) {
        console.log("Cprofile main err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.confirmation = async (req, res) => {
    const page = req.query.page || 1; //
    const objNum = 10; // 한 페이지 내에 담기는 항목의 개수
    try {
        const { u_id } = req.session;
        const totalNum = await reservation.count(); // reservation 테이블의 전체 데이터 수
        const totalPage = Math.ceil(totalNum / objNum);
        const offset = (page - 1) * objNum;
        const reservationData = await reservation.findAll({
            where: { u_id },
            // attributes: ["r_id", "day", "st_room", "time", "count"],
            limit: objNum,
            offset: offset,
        });
        res.render("profile/confirmation", { reservationData, totalPage, page });
    } catch (error) {
        console.log("Cprofile confirmation err :: ", error);
        res.status(500).send("server error!");
    }
};
exports.findAllPosting = async (req, res) => {
    const { u_id } = req.session;
    const page = parseInt(req.query.page) || 1; // 페이지 번호
    const limit = parseInt(req.query.limit) || 5; // 페이지 당 아이템 수

    try {
        const offset = (page - 1) * limit; // 페이지 시작 오프셋 계산
        const postings = await board.findAll({
            limit: limit,
            offset: offset,
            where: { u_id },
            order: [["createdAt", "DESC"]],
        });

        // 유저의 전체 북마크 중 b_id만 추출한 배열
        const bookmarks = await bookMark.findAll({
            where: { u_id },
            order: [["bm_id", "DESC"]],
        });
        const b_ids = bookmarks.map((bookmark) => bookmark.dataValues.b_id);

        // 전체 게시글 중 북마크와 b_id가 같은 글 가져오기
        const bookmarkPostings = await board.findAll({
            limit: limit,
            offset: offset,
            where: { b_id: { [Op.in]: b_ids } },
        });
        res.render("profile/posting", { postings, bookmarkPostings });
    } catch (error) {
        console.log("Cprofile findAllPosting err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.deleteAccount = (req, res) => {
    res.render("profile/deleteAccount");
};

exports.updateProfile = async (req, res) => {
    try {
        const { u_id } = req.session;
        const { pw, nk_name, phone, email } = req.body;

        if (!pw || !nk_name || !email || !phone) {
            return res.send({ success: false, msg: "입력칸을 모두 채워주세요." });
        }

        const userInfo = await user.findOne({ where: { u_id } });

        if (!comparePw(pw, userInfo.pw))
            return res.send("비밀번호를 잘못 입력하셨습니다. 다시 입력해주세요.");

        await user.update({ nk_name, phone, email }, { where: { u_id } });
        res.send("프로필 수정이 완료되었습니다.");
    } catch (error) {
        console.log("updateProfile controller err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { u_id } = req.session;
        const { pw, newPw } = req.body;

        const userInfo = await user.findOne({ where: { u_id } });

        if (!pw || !newPw)
            return res.send({ success: false, msg: "비밀번호를 전부 입력해주세요." });
        if (!comparePw(pw, userInfo.pw))
            return res.send({
                success: false,
                msg: "현재 비밀번호가 일치하지 않습니다. 다시 입력해주세요.",
            });

        const isUpdate = await user.update({ pw: hashPw(newPw) }, { where: { u_id } });

        if (isUpdate) return res.send({ success: true, msg: "비밀번호가 수정되었습니다." });
    } catch (error) {
        console.log("updatePassword controller err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.updateProfileImg = async (req, res) => {
    try {
        const { u_id } = req.session;
        const file = req.file;

        if (!file) {
            return res.status(400).send("파일이 업로드되지 않았습니다.");
        }

        const filePath = file.path; // 파일 경로

        await user.update({ profile_img: filePath }, { where: { u_id } });
        const userInfo = await user.findOne({ where: { u_id } });

        res.send({ updatedImg: userInfo.profile_img });
    } catch (error) {
        console.log("Cprofile updateProfileImg err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.deleteProfileImg = async (req, res) => {
    try {
        const { u_id } = req.session;

        const userInfo = await user.findOne({ where: { u_id } });

        if (userInfo.profile_img !== "uploads\\logo.png") {
            if (fs.existsSync(userInfo.profile_img)) {
                fs.unlinkSync(userInfo.profile_img);
                console.log("이전 이미지 삭제 성공");
            } else {
                console.log("이전 이미지가 존재하지 않습니다.");
            }
        }

        await user.update({ profile_img: "uploads\\logo.png" }, { where: { u_id } });
        res.end();
    } catch (error) {
        console.log("Cprofile deleteProfile err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const { u_id } = req.session;
        const { r_id } = req.body;

        await reservation.destroy({ where: { r_id, u_id } });
        res.send("예약이 취소되었습니다.");
    } catch (error) {
        console.log("deleteReservation controller err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.deleteBookmark = async (req, res) => {
    try {
        const { u_id } = req.session;
        const { b_id } = req.body;

        const success = await bookMark.destroy({ where: { b_id, u_id } });

        if (success) return res.send("북마크가 삭제되었습니다.");
        else return res.send("다시 로그인 후 삭제해주세요");
    } catch (error) {
        console.log("Cprofile deleteBookmark err :: ", error);
        res.status(500).send("server error!");
    }
};
