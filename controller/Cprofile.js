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
        res.render("profile/posting", { postings });
    } catch (error) {
        console.log("Cprofile findAllPosting err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.findAllBookmark = async (req, res) => {
    try {
        // const {u_id} = req.session;
        const { u_id } = req.query;
        // 유저의 전체 북마크
        const bookmarks = await bookMark.findAll({ where: { u_id } });
        // bookmarks에서 b_id만 추출한 배열
        const b_ids = bookmarks.map((bookmark) => bookmark.dataValues.b_id);
        // 전체 게시글 중 북마크와 b_id가 같은 글 가져오기
        console.log("b_ids ::", b_ids);
        const bookmarkPostings = await board.findAll({ where: { b_id: { [Op.in]: b_ids } } });
        res.send({ bookmarkPostings });
        res.end();
    } catch (error) {
        console.log("Cprofile findAllBookmark err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.deleteAccount = (req, res) => {
    res.render("profile/deleteAccount");
};

exports.updateProfile = async (req, res) => {
    try {
        // 세션 사용할 경우 u_id 지우기
        const { u_id, pw, name, nk_name, phone, email } = req.body;
        const updateInfo = await user
            // 세션 사용할 경우 where: nk_name 추가
            .update({ pw, nk_name, phone, email }, { where: { u_id, name } })
            .then(() => {
                res.end();
            });
    } catch (error) {
        console.log("updateProfile controller err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        // 세션 사용할 경우 u_id 지우기
        const { r_id, u_id } = req.body;
        const deletedReservation = await reservation.destroy({ where: { r_id, u_id } }).then(() => {
            res.send("예약이 취소되었습니다.");
        });
    } catch (error) {
        console.log("deleteReservation controller err :: ", error);
        res.status(500).send("server error!");
    }
};
