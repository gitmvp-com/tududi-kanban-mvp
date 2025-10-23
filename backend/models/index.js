const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.dbFile,
    logging: false,
    define: {
        timestamps: true,
        underscored: true,
    },
});

const User = require('./user')(sequelize);
const Task = require('./task')(sequelize);
const Project = require('./project')(sequelize);

User.hasMany(Task, { foreignKey: 'user_id' });
Task.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Project, { foreignKey: 'user_id' });
Project.belongsTo(User, { foreignKey: 'user_id' });

Project.hasMany(Task, { foreignKey: 'project_id' });
Task.belongsTo(Project, { foreignKey: 'project_id' });

module.exports = {
    sequelize,
    User,
    Task,
    Project,
};
