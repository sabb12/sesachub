const boardModel = (sequelize, DataTypes) => {
    const board = sequelize.define(
        "board",
        {
            b_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            u_id: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            category: {
                type: DataTypes.ENUM("study", "employ", "qualification", "free"),
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        },
    );
    return board;
};

module.exports = boardModel;
