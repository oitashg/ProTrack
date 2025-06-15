import Student from "../models/Student";

export async function deleteStudent(req, res) {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id) {
            return res.status(400).json({ message: 'Student ID is required' });
        }

        // Find and delete student
        const student = await Student.findByIdAndDelete(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully' });
    } 
    catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Server error' });
    }
}