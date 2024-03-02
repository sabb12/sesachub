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
            u_id: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            b_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
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
