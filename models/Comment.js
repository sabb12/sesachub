const commentModel = (sequelize, DataTypes) => {
    const comment = sequelize.define(
        "comment",
        {
            c_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            b_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            nk_name: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            content: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("PUBLIC", "PRIVATE"),
                allowNull: false,
                defaultValue: "PUBLIC",
            },
            parent_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            freezeTableName: true,
        },
    );
    return comment;
};

module.exports = commentModel;
