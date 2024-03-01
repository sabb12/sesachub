const bookMarkModel = (sequelize, DataTypes) => {
    const bookMark = sequelize.define(
        "bookmark",
        {
            bm_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            b_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            u_id: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            timestamps: false,
        },
    );
    return bookMark;
};

module.exports = bookMarkModel;
