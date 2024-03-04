"use strict";

const Sequelize = require("sequelize");
console.log("corssenv: ", process.env.NODE_ENV); // prod or development
// const config = require(__dirname + "/../config/config.js")["prod"];
let config;
if (process.env.NODE_ENV) {
    // npm run dev, npm start
    config = require(__dirname + "/../config/config.js")[process.env.NODE_ENV];
} else {
    
    config = require(__dirname + "/../config/config.js")["development"];
}

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

//모델 가져오기
const userModel = require("../models/User")(sequelize, Sequelize);
const reservationModel = require("../models/Reservation")(sequelize, Sequelize);
const boardModel = require("../models/Board")(sequelize, Sequelize);
const boardLikeModel = require("../models/BoardLike")(sequelize, Sequelize);
const boardImgModel = require("../models/BoardImg")(sequelize, Sequelize);
const bookMarkModel = require("../models/Bookmark")(sequelize, Sequelize);
const commentModel = require("../models/Comment")(sequelize, Sequelize);
// 외래키 설정
//USER
userModel.hasMany(reservationModel, {
    foreignKey: "u_id",
});
reservationModel.belongsTo(userModel, {
    foreignKey: "u_id",
});
//BOARD
userModel.hasMany(boardModel, {
    foreignKey: "u_id",
});
boardModel.belongsTo(userModel, {
    foreignKey: "u_id",
});
//BOARD LIKE
boardModel.hasMany(boardLikeModel, {
    foreignKey: "b_id",
});
boardLikeModel.belongsTo(boardModel, {
    foreignKey: "b_id",
});
userModel.hasMany(boardLikeModel, {
    foreignKey: "u_id",
});
boardLikeModel.belongsTo(userModel, {
    foreignKey: "u_id",
});
//BOARD IMG
boardModel.hasMany(boardImgModel, {
    foreignKey: "b_id",
});
boardImgModel.belongsTo(boardModel, {
    foreignKey: "b_id",
});
//BOOKMARK
boardModel.hasMany(bookMarkModel, {
    foreignKey: "b_id",
});
bookMarkModel.belongsTo(boardModel, {
    foreignKey: "b_id",
});
userModel.hasMany(bookMarkModel, {
    foreignKey: "u_id",
});
bookMarkModel.belongsTo(userModel, {
    foreignKey: "u_id",
});
//COMMENT
boardModel.hasMany(commentModel, {
    foreignKey: "b_id",
});
commentModel.belongsTo(boardModel, {
    foreignKey: "b_id",
});
userModel.hasMany(commentModel, {
    foreignKey: "nk_name",
});
commentModel.belongsTo(userModel, {
    foreignKey: "nk_name",
});
commentModel.hasMany(commentModel, {
    foreignKey: 'parent_id', // 부모 댓글 id가 저장된 컬럼
    as: 'replies', // 대댓글 모델의 별칭
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.user = userModel;
db.reservation = reservationModel;
db.board = boardModel;
db.boardLike = boardLikeModel;
db.boardImg = boardImgModel;
db.bookMark = bookMarkModel;
db.comment = commentModel;

module.exports = db;
