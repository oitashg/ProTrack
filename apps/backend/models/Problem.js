const mongoose = require("mongoose")

const problemSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        rating: {
            type: Number,
            required: true,
            min: 0
        },
        date: {
            type: Date,
            required: true,
            default: Date.now()
        },
    }
)

module.exports = mongoose.model("Problem", problemSchema)