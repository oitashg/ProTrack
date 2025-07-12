const express = require('express');
const router = express.Router();

const { getAllProblems } = require('../controllers/Problem');

router.get("/getAllProblems", getAllProblems)

module.exports = router;