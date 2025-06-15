const express = require('express');
const app = express()

const studentRoutes = require('./routes/Student')
const cronRoutes= require('./routes/Cron')

const database = require('./config//database')
const cronRunner = require('./config/cron')

const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 4000

database.connect()

app.use(express.json())
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
)

app.use("/api/student", studentRoutes)
app.use("/api/cron", cronRoutes)

cronRunner(app)

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