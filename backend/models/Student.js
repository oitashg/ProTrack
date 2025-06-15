const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
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
        cfHandle: {
            type: String,
            required: true,
            trim: true,
        },
        currentRating: {
            type: Number,
            required: true,
            default: 0,
        },
        maxRating: {
            type: Number,
            required: true,
            default: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
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