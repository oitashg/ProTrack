import Problem from "../models/Problem.js";

// Function to get all problems for a specific student
export async function getAllProblems(req, res) {
    try {
        // Fetch all problem history
        const problems = await Problem.find()

        res.status(200).json(problems);
    } 
    catch (error) {
        console.log('Error fetching problem history:', error);
        res.status(500).json({ message: 'Server error' });
    }
}