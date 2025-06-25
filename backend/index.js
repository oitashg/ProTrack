const express = require('express');
const app = express()
const cors = require('cors')

const studentRoutes = require('./routes/Student')
const contestRoutes = require('./routes/Contest')
const problemRoutes = require('./routes/Problem')
const cronRoutes = require('./routes/Cron')

const database = require('./config//database')
const getCronTime = require('./config/cron');

const dotenv = require('dotenv');
dotenv.config()

const PORT = process.env.PORT || 4000

//calling database connection
database.connect()

//calling the cron scheduler
getCronTime()

app.use(express.json())
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
)

app.use("/api/student", studentRoutes)
app.use("/api/contest", contestRoutes)
app.use("/api/problem", problemRoutes)
app.use("/api/cron", cronRoutes)

//def route
app.get("/", (req,res) => {
    return res.json({
        success: true,
        message: "Your server is up and running...",
    })
})

//starting the server
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`)
})