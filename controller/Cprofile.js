const { Op } = require("sequelize");
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
        const { u_id, nk_name } = req.session;
        const userInfo = await user.findOne({ where: { u_id, nk_name } });
        const courseInfo = await course.findOne({ where: userInfo.cs_id });
        // console.log("profile_img userInfo ::", userInfo.profile_img);
        res.render("profile/main", { userInfo, courseInfo });
    } catch (error) {
        console.log("Cprofile main err :: ", error);
        res.status(500).send("server error!");
    }
};
exports.confirmation = async (req, res) => {
    try {
        const { u_id } = req.session;
        const reservationData = await reservation.findAll({
            where: { u_id },
            // attributes: ["r_id", "day", "st_room", "time", "count"],
        });
        res.render("profile/confirmation", { reservationData });
    } catch (error) {
        console.log("Cprofile confirmation err :: ", error);
        res.status(500).send("server error!");
    }
};
exports.findAllPosting = async (req, res) => {
    try {
        const { u_id } = req.session;
        const postings = await board.findAll({ where: { u_id } });

        // 유저의 전체 북마크 중 b_id만 추출한 배열
        const bookmarks = await bookMark.findAll({ where: { u_id } });
        const b_ids = bookmarks.map((bookmark) => bookmark.dataValues.b_id);

        // 전체 게시글 중 북마크와 b_id가 같은 글 가져오기
        const bookmarkPostings = await board.findAll({ where: { b_id: { [Op.in]: b_ids } } });

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
        const { pw, name, nk_name, phone, email } = req.body;

        const userInfo = await user.findOne({ where: { u_id } });
        if (!pw) return res.send("비밀번호를 입력해주세요.");

        if (!comparePw(pw, userInfo.pw))
            return res.send("비밀번호를 잘못 입력하셨습니다. 다시 입력해주세요.");

        await user.update({ nk_name, phone, email }, { where: { u_id, name } });
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
        const file = req.file; // 단일 파일 업로드인 경우
        console.log("profile_img ::", file);

        if (!file) {
            return res.status(400).send("파일이 업로드되지 않았습니다.");
        }

        // 파일 경로를 데이터베이스에 저장하거나 다른 작업 수행
        const filePath = file.path; // 파일 경로

        console.log("filePath ::", filePath);

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

        // TODO: 기본 프로필 이미지로 변경
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
