const { DataTypes } = require('sequelize');
const { nanoid } = require('nanoid');

module.exports = (sequelize) => {
    const Project = sequelize.define('Project', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        uid: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            defaultValue: () => nanoid(10),
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'projects',
        timestamps: true,
    });

    return Project;
};
