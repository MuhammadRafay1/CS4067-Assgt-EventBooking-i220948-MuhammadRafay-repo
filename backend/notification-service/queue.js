const { Queue } = require("bullmq");
const Redis = require("ioredis");

// Redis connection
const redisConnection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// Create a queue for notifications
const notificationQueue = new Queue("notificationQueue", {
  connection: redisConnection,
});

module.exports = notificationQueue;
