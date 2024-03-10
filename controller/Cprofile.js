const { Op } = require("sequelize");
const { user, reservation, board, bookMark } = require("../models");

exports.main = async (req, res) => {
    try {
        const { u_id, nk_name } = req.session;
        const userInfo = await user.findOne({ where: { u_id, nk_name } });
        // console.log("profile userInfo ::", userInfo);
        res.render("profile/main", { userInfo });
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
        await user.update({ pw, nk_name, phone, email }, { where: { u_id, name } });
        res.send("프로필 수정 완료");
    } catch (error) {
        console.log("updateProfile controller err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.deleteProfileImg = async (req, res) => {
    try {
        const { u_id } = req.session;

        // TODO: 기본 프로필 이미지로 변경
        await user.update({ profile_img: "profile_img" }, { where: { u_id } });
        res.send("프로필 이미지가 삭제되었습니다.");
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
        const {} = req.body;
        const deletedBookmark = await bookMark.destroy({ where: { u_id } });
        res.send("북마크가 삭제되었습니다.");
    } catch (error) {
        console.log("Cprofile deleteBookmark err :: ", error);
        res.status(500).send("server error!");
    }
};
