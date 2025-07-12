import { Queue, QueueEvents } from 'bullmq';
import dotenv from 'dotenv';
// import { redisClient } from './client.js';
dotenv.config();

export const emailQueue = new Queue('send-email', { connection: {url: process.env.REDIS_URL} });
export const emailQueueEvents = new QueueEvents('send-email', { connection: {url: process.env.REDIS_URL}  });

// Optional: listen for failures in this service
emailQueueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`Job ${jobId} failed:`, failedReason);
});

console.log('📨 Email queue initialized');