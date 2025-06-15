import Cron from "../models/Cron";

// Get current schedule
export async function getCurrentSchedule(req, res) {
    try {
        let cfg = await Cron.findOne();
        if (!cfg) cfg = await Cron.create({});
        res.json(cfg);
    } 
    catch (error) {
        console.error('Error fetching cron configuration:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Update schedule (e.g. body = { schedule: '0 3 * * *' })
export async function updateSchedule(req, res) {
    try {
        const { schedule } = req.body;
        let cfg = await Cron.findOneAndUpdate(
            {},
            { schedule, lastUpdated: Date.now() },
            { upsert: true, new: true }
        );
        // Emit an event so our cron runner can re-schedule immediately:
        req.app.emit('cronConfigChanged', cfg.schedule);
        res.json(cfg);
    } 
    catch (error) {
        console.error('Error updating cron configuration:', error);
        res.status(500).json({ message: 'Server error' });
    }
}