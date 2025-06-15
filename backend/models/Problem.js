const mongoose = require("mongoose")

const problemSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        verdict: {
            type: String,
            required: true,
            enum: ["Unsolved", "Attemped", "Solved"],
        },
        when: {
            type: Date,
            required: true,
            default: Date.now,
        },
    }
)

module.exports = mongoose.model("Problem", problemSchema)