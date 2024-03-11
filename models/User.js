const UserModel = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "user",
        {
            u_id: {
                type: DataTypes.STRING(30),
                primaryKey: true,
                allowNull: false,
            },
            pw: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            nk_name: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            profile_img: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: "uploads\\logo.png",
            },
            email: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            permission: {
                type: DataTypes.ENUM("user", "student", "admin", "graduate_student"),
                allowNull: true,
            },
            cs_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        },
    );
    return User;
};

module.exports = UserModel;
