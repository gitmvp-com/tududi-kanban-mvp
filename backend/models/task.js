const { DataTypes } = require('sequelize');
const { nanoid } = require('nanoid');

module.exports = (sequelize) => {
    const Task = sequelize.define('Task', {
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
        status: {
            type: DataTypes.ENUM('todo', 'in_progress', 'done'),
            defaultValue: 'todo',
            allowNull: false,
        },
        priority: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        due_date: {
            type: DataTypes.DATE,
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        project_id: {
            type: DataTypes.INTEGER,
        },
    }, {
        tableName: 'tasks',
        timestamps: true,
    });

    return Task;
};
