const CourseModel = (sequelize, DataTypes) => {
    const Course = sequelize.define(
        "course",
        {
            cs_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            course_name: {
                type: DataTypes.STRING(255),
            },
        },
        {
            freezeTableName: true,
            timestamps: false,
        },
    );
    return Course;
};

module.exports = CourseModel;
