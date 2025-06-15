const mongoose = require("mongoose");

const cronConfigSchema = new mongoose.Schema({
  schedule: {
    type: String,
    default: "0 2 * * *",
  }, // every day at 2 AM
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cron", cronConfigSchema);