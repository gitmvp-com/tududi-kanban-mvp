require('dotenv').config();
const { sequelize, User } = require('../models');
const config = require('../config');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    try {
        console.log('Initializing database...');
        
        const dbDir = path.dirname(config.dbFile);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        await sequelize.sync({ force: true });
        console.log('Database tables created');

        const passwordHash = await User.hashPassword(config.userPassword);
        await User.create({
            email: config.userEmail,
            password_hash: passwordHash,
        });
        console.log(`Default user created: ${config.userEmail}`);

        console.log('Database initialization completed!');
        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

initializeDatabase();
