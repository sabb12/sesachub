const reservationModel = (sequelize, DataTypes) => {
    const reservation = sequelize.define(
        "reservation",
        {
            r_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            u_id: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            day: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            st_room: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            time: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            count: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            timestamps: false,
        },
    );
    return reservation;
};

module.exports = reservationModel;
