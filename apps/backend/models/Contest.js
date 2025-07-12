const mongoose = require("mongoose")

const contestSchema = new mongoose.Schema(
    {   
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        contestId: {
            type: Number,
            required: true,
        },
        contestName:{
            type: String,
            required: true,
            trim: true,
        },
        oldRating: {
            type: Number,
            required: true,
            default: 0,
        },
        newRating: {
            type: Number,
            required: true,
            default: 0,
        },
        rank: {
            type: Number,
            required: true,
            default: 0,
        },
        unsolvedProblems: {
            type: Number,
            required: true,
            default: 0,
        },
    }
)

module.exports = mongoose.model("Contest", contestSchema)