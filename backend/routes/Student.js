const express = require('express');
const router = express.Router();

const {addStudent, editStudent, deleteStudent} = require('../controllers/Student')

router.post("/add", addStudent)
router.post("/edit", editStudent)
router.delete("/delete", deleteStudent)

module.exports = router;