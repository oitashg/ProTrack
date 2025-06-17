const express = require('express');
const router = express.Router();

const {addStudent, editStudent, deleteStudent, syncStudents, reminderEmail} = require('../controllers/Student')

router.post("/add", addStudent)
router.post("/edit", editStudent)
router.delete("/delete", deleteStudent)
router.put('/:id', syncStudents)
router.put('/:id/email', reminderEmail)

module.exports = router;