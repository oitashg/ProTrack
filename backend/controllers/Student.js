import Student from "../models/Student.js";
import { syncStudent } from "../services/codeforcesSync.js";
import axios from "axios";

export async function addStudent(req, res) {
    try {
        const { cfHandle } = req.body;

        //extract data from codeforces api
        const {data} = await axios.get(`https://codeforces.com/api/user.info?handles=${cfHandle}`)
        console.log('Codeforces API response:', data);
        const user = data?.result[0]
        console.log('Codeforces data result :', user);
        
        //should be added in form
        const {email, phone} = req.body

        // Validate required fields
        if (!user || !email || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new student
        const newStudent = {
            firstName: user.firstName,
            lastName: user.lastName,
            email,
            phone,
            handle: user.handle,
            rating: user.rating || 0,
            maxRating: user.maxRating || 0,
        };

        // Save to student database 
        const student = await Student.create(newStudent);
        res.status(201).json(student);
    } 
    catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function editStudent(req, res) {
    try {
        const { cfHandle, id } = req.body;
        const student = await Student.findById(id)
        if(!student) return res.status(400).json({ message: 'Student dont exists' });

        //extract data from codeforces api
        const {data} = await axios.get(`https://codeforces.com/api/user.info?handles=${cfHandle}`)
        console.log('Codeforces API response:', data);
        const user = data?.result[0]

        //should be added in form
        const {email, phone} = req.body

        // Validate required fields
        if (!user || !email || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find student by ID and update
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            {
                firstName: user.firstName,
                lastName: user.lastName,
                email,
                phone,
                handle: user.handle,
                rating: user.rating || 0,
                maxRating: user.maxRating || 0,
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

export async function deleteStudent(req, res) {
    try {
        const { id } = req.body;

        // Validate ID
        if (!id) {
            return res.status(400).json({ message: 'Student id is required' });
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