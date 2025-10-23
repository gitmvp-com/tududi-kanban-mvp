require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./models');
const config = require('./config');

const app = express();

const sessionStore = new SequelizeStore({ db: sequelize });

app.use(helmet({ hsts: false, forceHTTPS: false, contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('combined'));

app.use(cors({
    origin: config.allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(session({
    secret: config.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 2592000000,
        sameSite: 'lax',
    },
}));

if (config.production) {
    app.use(express.static(path.join(__dirname, '../dist')));
} else {
    app.use(express.static('../public'));
}

const { requireAuth } = require('./middleware/auth');

app.use('/api', require('./routes/auth'));
app.use('/api', requireAuth, require('./routes/tasks'));
app.use('/api', requireAuth, require('./routes/projects'));

app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/') && !req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
        if (config.production) {
            res.sendFile(path.join(__dirname, '../dist', 'index.html'));
        } else {
            res.sendFile(path.join(__dirname, '../public', 'index.html'));
        }
    } else {
        res.status(404).json({ error: 'Not Found' });
    }
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

async function startServer() {
    try {
        await sessionStore.sync();
        const server = app.listen(config.port, config.host, () => {
            console.log(`Server running on http://localhost:${config.port}`);
        });
        server.on('error', (err) => console.error('Server error:', err));
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    startServer();
}

module.exports = app;
