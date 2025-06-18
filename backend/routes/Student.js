const express = require('express');
const router = express.Router();

const {addStudent, editStudent, deleteStudent, getAllStudents, toggleEmail} = require('../controllers/Student')

router.post("/add", addStudent)
router.post("/edit", editStudent)
router.delete("/delete/:id", deleteStudent)
router.get("/getAllStudents", getAllStudents)
router.post("/toggleEmail", toggleEmail)

module.exports = router;