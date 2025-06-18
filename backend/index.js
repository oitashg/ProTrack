const express = require('express');
const app = express()
const cors = require('cors')

const studentRoutes = require('./routes/Student')

const database = require('./config//database')

const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 4000

database.connect()
//calling the cron scheduler
require('./config/cron')

app.use(express.json())
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
)

app.use("/api/student", studentRoutes)

//def route
app.get("/", (req,res) => {
    return res.json({
        success: true,
        message: "Your server is up and running...",
    })
})

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`)
})