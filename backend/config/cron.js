const cron = require('node-cron');
const { syncAllStudents }  = require('../services/codeforcesSync');

cron.schedule(
  //This data should come fron UI
  '0 0 2 * * *', 
  () =>{
    syncAllStudents().catch(err => {
      console.error('Error during scheduled sync:', err);
    });
  },
  {timezone: 'Asia/Kolkata'}
); 