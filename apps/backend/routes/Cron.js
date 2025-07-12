const express = require('express');
const router = express.Router();

const { setCronTimeHandler, fetchCronTimeHandler } = require('../controllers/Cron');

router.post("/setCronTime", setCronTimeHandler)
router.get("/getCronTime", fetchCronTimeHandler)

module.exports = router;