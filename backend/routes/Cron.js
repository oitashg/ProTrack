const express = require('express');
const router = express.Router();

const {getCurrentSchedule, updateSchedule} = require('../controllers/Cron');

router.get("/current", getCurrentSchedule)
router.put("/update", updateSchedule)

module.exports = router;
