const cron = require('node-cron');
const Cron = require('../models/Cron');
const { syncAllStudents } = require('../services/codeforcesSync');

let task = null;

async function scheduleJob(app) {
  // Fetch the latest cron expression
  const cfg = await Cron.findOne() || await Cron.create({});
  if (task) task.stop();

  task = cron.schedule(cfg.schedule, async () => {
    console.log(`[${new Date().toISOString()}] Starting CF sync…`);
    await syncAllStudents();
    console.log(`CF sync completed.`);
  }, { timezone: 'Asia/Kolkata' });

  console.log(`Cron scheduled: "${cfg.schedule}"`);
}

// Initialize on server start
module.exports = (app) => {
  scheduleJob(app);

  // Re‑schedule whenever config changes
  app.on('cronConfigChanged', (newSchedule) => {
    console.log(`Rescheduling cron to "${newSchedule}"`);
    scheduleJob(app);
  });
};
