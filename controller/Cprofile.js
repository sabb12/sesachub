const { user, reservation } = require("../models");

// const { u_id, nk_name } = req.session;

exports.main = (req, res) => {
    res.render("profile/main");
};
exports.confirmation = (req, res) => {
    res.render("profile/confirmation");
};
exports.posting = (req, res) => {
    res.render("profile/posting");
};

exports.findOneUser = async (req, res) => {
    try {
        const { u_id, nk_name } = req.query;
        const userInfo = await user.findOne({ where: { u_id, nk_name } });
        console.log("profile userInfo ::", userInfo);
        res.send({ userInfo });
    } catch (error) {
        console.log("findOneUser controller err :: ", error);
        res.status(500).send("server error!");
    }
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

exports.findAllReservation = async (req, res) => {
    try {
        // 세션 사용할 경우 u_id 지우기
        const { u_id } = req.query;
        const reservationData = await reservation.findAll({
            where: { u_id },
            attributes: ["r_id", "day", "st_room", "time", "count"],
            include: [
                {
                    model: user,
                    attributes: [],
                },
            ],
        });
        res.send({ reservationData });
    } catch (error) {
        console.log("findAllReservation controller err :: ", error);
        res.status(500).send("server error!");
    }
};
