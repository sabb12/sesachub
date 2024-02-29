const express = require("express");
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");
const reservationRouter = require("./routes/reservation");
const boardRouter = require("./routes/board");
const app = express();
const PORT = 8080;
const URL = "localhost";
const { sequelize } = require("./models");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/static", express.static(__dirname + "/static"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/reservation", reservationRouter);
app.use("/board", boardRouter);

app.get("*", (req, res) => {
    res.render("404");
});

sequelize
    .sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`http://${URL}:${PORT}/user`);
        });
    })
    .catch((err) => {
        console.error(err);
    });
