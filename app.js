const express = require("express");
const app = express();
const PORT = 8080;
const URL = "localhost";
const { sequelize } = require("./models");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
