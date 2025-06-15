import Student from "../models/Student";

export async function reminderEmail(req, res){
    try{
        const { emailDisabled } = req.body;
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { emailDisabled },
            { new: true }
        );
        res.json(student);
    }
    catch(error) {
        console.error('Error updating email preference:', error);
        res.status(500).json({ message: 'Server error' });
    }
}