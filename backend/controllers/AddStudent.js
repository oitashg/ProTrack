import Student from "../models/Student.js";

export async function addStudent(req, res) {
    try {
        const { name, email, phone, cfHandle, currentRating, maxRating } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !cfHandle) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new student
        const newStudent = {
            name,
            email,
            phone,
            cfHandle,
            currentRating: currentRating || 0,
            maxRating: maxRating || 0,
        };

        // Save to database (assuming you have a Student model)
        const student = await Student.create(newStudent);
        res.status(201).json(student);
    } 
    catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Server error' });
    }
}