const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
            default: "Anonymous",
        },
        lastName: {
            type: String,
            trim: true,
            default: "User",
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        handle: {
            type: String,
            required: true,
            trim: true,
        },
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        maxRating: {
            type: Number,
            required: true,
            default: 0,
        },
        contests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Contest",
            },
        ],
        problems: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Problem",
            },
        ],
        lastProblemSubmitted: {
            type: Date,
            required: true,
            default: Date.now,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        lastSync: {
            type: Date,
            default: Date.now,
        },
        remindersSent: { 
            type: Number, 
            default: 0 
        },
        emailDisabled: { 
            type: Boolean, 
            default: false 
        },
    }
)

module.exports = mongoose.model("Student", studentSchema)