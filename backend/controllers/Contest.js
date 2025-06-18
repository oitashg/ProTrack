import Contest from "../models/Contest.js";

export async function getAllContests(req, res) {
    try {
        // Fetch all contest history
        const contests = await Contest.find()
            .populate("student")
            .exec();

        res.status(200).json(contests);
    } 
    catch (error) {
        console.log('Error fetching contest history:', error);
        res.status(500).json({ message: 'Server error' });
    }
}