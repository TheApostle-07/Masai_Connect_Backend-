require('dotenv').config();
const Redis = require('ioredis');

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

// Check Redis connection
redisClient.on('connect', () => {
    console.log('✅ Connected to Redis successfully');
});

redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});

redisClient.ping()
    .then((res) => console.log('Redis Response:', res)) // Should log "PONG"
    .catch((err) => console.error('Redis Connection Failed:', err));

module.exports = redisClient;
