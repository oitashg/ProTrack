import Student from "../models/Student.js";

export async function editStudent(req, res) {
    try {
        const { id } = req.params;
        const { name, email, phone, cfHandle, currentRating, maxRating } = req.body;

        // Validate required fields
        if (!id || !name || !email || !phone || !cfHandle) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find student by ID and update
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            {
                name,
                email,
                phone,
                cfHandle,
                currentRating: currentRating || 0,
                maxRating: maxRating || 0,
            },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(updatedStudent);
    } 
    catch (error) {
        console.error('Error editing student:', error);
        res.status(500).json({ message: 'Server error' });
    }
}