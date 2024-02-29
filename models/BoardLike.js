const boardLikeModel = (sequelize, DataTypes) => {
    const boardLike = sequelize.define(
        "board_like",
        {
            bl_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
        },
        {
            freezeTableName: true,
            timestamps: false,
        },
    );
    return boardLike;
};

module.exports = boardLikeModel;
