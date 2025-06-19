import Cron from "../models/Cron.js";

export async function setCronTimeHandler(req, res) {
    try {
        const {updatedValues} = req.body

        const data = await Cron.findOneAndUpdate(
        {},
        {cronTime: updatedValues},
        {new: true})

        res.status(200).json({
            message: 'Cron time set successfully', 
            data: data
        })
    } 
    catch (error) {
        console.log('Error setting cron time:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function fetchCronTimeHandler(req, res) {
    try {
        const data = await Cron.find()

        res.status(200).json(data);
    } 
    catch (error) {
        console.log('Error setting cron time:', error);
        res.status(500).json({ message: 'Server error' });
    }
}