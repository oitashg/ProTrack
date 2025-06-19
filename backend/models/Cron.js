const mongoose = require("mongoose")

const cronSchema = new mongoose.Schema(
    {
        cronTime: {
            type: String,
            required: true,
            trim: true,
            default: '0 0 2 * * *' // Default cron time
        },
    }
)

module.exports = mongoose.model("Cron", cronSchema)