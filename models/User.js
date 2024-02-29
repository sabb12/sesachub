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
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            nk_name: {
                type: DataTypes.STRING(30),
                allowNull: true,
                defaultValue: "student",
            },
            profile_img: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            study_class: {
                type: DataTypes.ENUM("1", "2", "3", "4", "5", "6", "7", "8", "9"),
                allowNull: false,
            },
            permission: {
                type: DataTypes.ENUM("user", "student", "admin"),
                allowNull: false,
                defaultValue: "user",
            },
        },
        {
            freezeTableName: true,
        },
    );
    return User;
};

module.exports = UserModel;
