require("dotenv").config();

const development = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "sesac",
    host: "127.0.0.1",
    dialect: "mysql",
};

const prod = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "sesac",
    host: "118.67.132.32",
    dialect: "mysql",
};

module.exports = { development, prod };
