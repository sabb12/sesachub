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
        },
        {
            freezeTableName: true,
            timestamps: false,
        },
    );
    return bookMark;
};

module.exports = bookMarkModel;
