const express = require('express');
const router = express.Router();

const {addStudent} = require('../controllers/AddStudent')
const {editStudent} = require('../controllers/EditStudent')
const {deleteStudent} = require('../controllers/DeleteStudent')
const {syncStudents} = require('../controllers/SyncStudent')
const {reminderEmail} = require('../controllers/ReminderEmail')

router.post("/add", addStudent)
router.post("/edit", editStudent)
router.post("/delete", deleteStudent)
router.put('/:id', syncStudents)
router.put('/:id/email', reminderEmail)

module.exports = router;