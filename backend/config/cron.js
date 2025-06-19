const cron = require('node-cron');
const { syncAllStudents }  = require('../services/codeforcesSync');
const Cron = require('../models/Cron.js');

async function getCronTime() {
  const cfg = await Cron.find({cronTime: {$exists: true}})
  const syncTime = cfg[0].cronTime
  console.log("Sync time set to:", syncTime);

  // Schedule the sync task using the retrieved cron time
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

//call the cron scheduler
getCronTime()