const express = require('express');
const router = express.Router();

const { getAllContests } = require('../controllers/Contest');

router.get("/getAllContests", getAllContests)

module.exports = router;  