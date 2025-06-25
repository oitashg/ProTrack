const cron = require('node-cron');
const { syncAllStudents }  = require('../services/codeforcesSync');
const Cron = require('../models/Cron.js');

async function getCronTime() {
  const cfg = await Cron.find({cronTime: {$exists: true}})
  const syncTime = cfg[0].cronTime
  console.log("Sync time set to:", syncTime);

  // Schedule the sync task using the retrieved cron time
  //Sync time -> Time at which the cron job will run automatically

  //   field          allowed values
  // -----          --------------
  // second         0-59
  // minute         0-59
  // hour           0-23
  // day of month   1-31
  // month          1-12 (or names, see below)
  // day of week    0-7 (0 or 7 is Sunday, or use names)

  //   - `*` Asterisks: Any value
  // - `1-3,5` Ranges: Ranges and individual values
  // - `*/2` Steps: Every two units

  //Example: '0 0 2 * * *' means at 2:00 AM every day
  
  cron.schedule(
  syncTime, 
    () =>{
      syncAllStudents().catch(err => {
        console.error('Error during scheduled sync:', err);
      });
    },
    {timezone: 'Asia/Kolkata'}
  ); 
}

module.exports = getCronTime;