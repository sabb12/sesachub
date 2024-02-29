const boardImgModel = (sequelize, DataTypes) => {
    const boardImg = sequelize.define(
        "board_img",
        {
            img_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            path: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            timestamps: false,
        },
    );
    return boardImg;
};

module.exports = boardImgModel;
