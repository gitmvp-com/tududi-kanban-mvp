const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'users',
        timestamps: true,
    });

    User.prototype.validatePassword = async function(password) {
        return await bcrypt.compare(password, this.password_hash);
    };

    User.hashPassword = async function(password) {
        return await bcrypt.hash(password, 10);
    };

    return User;
};
