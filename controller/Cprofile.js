const { user, reservation } = require("../models");

// const { u_id, nk_name } = req.session;

exports.main = async (req, res) => {
    try {
        const { u_id, nk_name } = req.query;
        const userInfo = await user.findOne({ where: { u_id, nk_name } });
        console.log("profile userInfo ::", userInfo);
        // res.send({ userInfo });
        res.render("profile/main", { userInfo });
    } catch (error) {
        console.log("findOneUser controller err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.confirmation = async (req, res) => {
    try {
        // 세션 사용할 경우 u_id 지우기
        const { u_id } = req.query;
        console.log(u_id);
        const reservationData = await reservation.findAll({
            where: { u_id },
        });
        // res.send({ reservationData });
        res.render("profile/confirmation", { reservationData });
    } catch (error) {
        console.log("findAllReservation controller err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.posting = (req, res) => {
    try {
        res.render("profile/posting");
    } catch (error) {
        console.log("findAllPosting controller err :: ", error);
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
