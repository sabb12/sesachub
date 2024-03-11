const express = require("express");
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");
const reservationRouter = require("./routes/reservation");
const boardRouter = require("./routes/board");
const adminRouter = require("./routes/admin");
const {course } = require("./models");
const app = express();
const PORT = 8080;
const URL = "localhost";
const { sequelize } = require("./models");
const session = require("express-session");
require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/static", express.static(__dirname + "/static"));

// body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// session 설정
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
            // maxAge: 1000 * 60 * 30 // 30 min
            httpOnly: true,
        },
    }),
);
const sessionCheck =async (req, res, next) => {
    let courseList = await course.findAll();

    if (typeof req.session === 'undefined' || !req.session.u_id) {
         res.render("user/signin", { courseList: courseList, message: "로그인 하셔야 이용 가능합니다.." });

        if (req.session.permission !== "admin") {
            return res.render("index",{message: "진입 불가능한 경로입니다." });
        }
        return
    } 
    
    next();
};
// 각 페이지 렌더링 시 세션 정보 주입하는 미들웨어 (라우팅 코드 위에 작성)
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.get("/", (req, res) => {
    res.render("index");
});
app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/reservation",sessionCheck, reservationRouter);
app.use("/board",sessionCheck, boardRouter);
app.use("/admin",sessionCheck, adminRouter);

app.get("*", (req, res) => {
    res.render("404");
});

sequelize
    .sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`http://${URL}:${PORT}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });
