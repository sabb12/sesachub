const { reservation, user } = require("../models");

exports.main = (req, res) => {
    res.render("reservation/reservation");
};

exports.reservationData = async (req, res) => {
    try {
        // 로그인 정보가 없거나 세션이 만료된 회원
        if (!req.session || req.session.u_id === undefined) {
            return res.send({ msg: "로그인 후 이용 가능합니다." });
        }

        // 전체 예약 데이터 불러오기
        const reservationData = await reservation.findAll();
        // console.log("reservationData ::", reservationData); // reservationData :: [전체 데이터]

        // reservation 페이지에 데이터 뿌리기
        res.send({ reservationData });
    } catch (error) {
        console.log("reserved controller err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.createReservation = async (req, res) => {
    try {
        const { u_id } = req.session;
        const { day, st_room, time, count } = req.body;

        // TODO: 시간 여러개 선택 시 처리

        // TODO: 세션이 만료된 회원은 예약 불가능
        if (!req.session || req.session.u_id === undefined) {
            return res.send({
                status: "expired",
                msg: "세션이 만료되었습니다. 다시 로그인 후 이용해주세요.",
            });
        }

        // 회원 id, 권한 있는지 확인 (권한은 join)
        const isUser = await user.findOne({ where: { u_id } });

        console.log("isUser ::", isUser);
        if (!isUser || !["user", "student", "admin"].includes(isUser.permission)) {
            return res.send({
                status: "noPermission",
                msg: "예약할 수 없는 회원입니다. 관리자에게 권한을 요청하세요.",
            });
        }

        // 선택한 공간에 해당 날짜와 시간에 예약 있는지 확인
        const existReservation = await reservation.findAll({ where: { st_room, day } });
        console.log("existReservation ::", existReservation);
        if (existReservation.some((reservation) => reservation.time === time)) {
            res.send({
                status: "booked",
                msg: "선택한 날짜와 시간에 해당 공간은 이미 예약이 있습니다.",
            });
            return;
        }

        // 회원이고, 예약되지 않은 룸과 시간이면 예약 가능
        const reserve = await reservation
            .create({
                u_id,
                day,
                st_room,
                time,
                count,
            })
            .then(() => {
                res.send({ status: "success", msg: "예약 완료" });
            });
    } catch (error) {
        console.log("createReservation controller err :: ", error);
        res.status(500).send("server error!");
    }
};
