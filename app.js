const express = require("express");
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

app.use("/board", boardRouter);
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
