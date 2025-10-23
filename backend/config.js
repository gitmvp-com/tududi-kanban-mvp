module.exports = {
    port: process.env.PORT || 3002,
    host: process.env.HOST || '0.0.0.0',
    secret: process.env.TUDUDI_SESSION_SECRET || 'dev-secret-change-in-production',
    production: process.env.NODE_ENV === 'production',
    allowedOrigins: process.env.TUDUDI_ALLOWED_ORIGINS 
        ? process.env.TUDUDI_ALLOWED_ORIGINS.split(',') 
        : ['http://localhost:8080', 'http://localhost:3002'],
    dbFile: process.env.DB_FILE || './backend/db/tududi.sqlite',
    userEmail: process.env.TUDUDI_USER_EMAIL || 'dev@example.com',
    userPassword: process.env.TUDUDI_USER_PASSWORD || 'password123',
};
