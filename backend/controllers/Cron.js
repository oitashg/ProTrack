import getCronTime from "../config/cron.js";
import Cron from "../models/Cron.js";

// Function to set cron time
export async function setCronTimeHandler(req, res) {
    try {
        const {cronTimeData} = req.body
        
        const data = await Cron.findOneAndUpdate(
        {},
        {cronTime: cronTimeData},  
        {new: true})
        
        getCronTime()

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

// Function to fetch cron time
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