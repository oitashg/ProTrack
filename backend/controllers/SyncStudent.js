import Student from "../models/Student.js";
import { syncStudent } from "../services/codeforcesSync.js";

export async function syncStudents(req, res) {
    try{
        const { cfHandle, ...updates } = req.body;
        const student = await Student.findById(req.params.id);
        const oldHandle = student.cfHandle;

        Object.assign(student, updates);
        student.cfHandle = cfHandle;
        await student.save();

        // If handle changed, run an immediate sync for that student
        if (oldHandle !== cfHandle) {
            syncStudent(student).catch(console.error);
        }

        res.json(student);
    }
    catch(error) {
        console.error('Error syncing student:', error);
        res.status(500).json({ message: 'Server error' });
    }
}