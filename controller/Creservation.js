const { reservation, user } = require("../models");

exports.findAllReservation = (req, res) => {
    res.render("reservation/reservation");
};

exports.createReservation = async (req, res) => {
    try {
        const { u_id, day, st_room, time, count } = req.body;

        // TODO: 세션이 만료된 회원은 예약 불가능
        // if (!req.session && !req.session.u_id) {
        //     res.send("세션이 만료되었습니다. 다시 로그인 해주세요.");
        // return;
        // }

        // 회원 id, 권한 있는지 확인 (권한은 join)
        const isUser = await user.findOne({ where: { u_id } });

        if (!isUser || !["user", "student", "admin"].includes(isUser.permission)) {
            res.send("예약할 수 없는 회원입니다.");
            return;
        }

        // 선택한 공간에 해당 날짜와 시간에 예약 있는지 확인
        const existReservation = await reservation.findAll({ where: { st_room, day } });
        console.log("existReservation ::", existReservation);
        if (existReservation.some((reservation) => reservation.time === time)) {
            res.send("선택한 날짜와 시간에 해당 공간은 이미 예약이 있습니다.");
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
                res.send("예약 완료");
            });
    } catch (error) {
        console.log("createReservation controller err :: ", error);
        res.status(500).send("server error!");
    }
};
