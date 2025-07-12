import { Worker } from 'bullmq';
import { sendReminderEmail } from './emailSender.js';
import { emailQueue } from './queues.js';
import dotenv from 'dotenv';
dotenv.config();

new Worker('send-email', async job => {
    await sendReminderEmail(job.data.student);
}, 
{
  connection: emailQueue.opts.connection,
  concurrency: 5   // up to 5 emails at once
});

console.log('📨 Email worker started, waiting for jobs...');
