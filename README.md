# Student Progress Management System

## 📖 Overview

**ProTrack** is a web application designed to track and visualize the competitive programming progress of students using data fetched from the Codeforces API. It provides administrators with an intuitive interface to manage student records, monitor contest performance, analyze problem-solving trends, and automate inactivity reminders via email.

## 🔑 Key Features

1. **Student Table View**

   * List all enrolled students with:

     * Name, Email, Phone Number
     * Codeforces Handle, Current Rating, Max Rating
   * Actions per row:

     * Add, Edit, Delete student
     * Download entire dataset as CSV
     * View detailed profile (opens Student Profile View)
   * Display last data-sync timestamp for each student

2. **Student Profile View**

   * **Contest History**

     * Filter by: last 30 / 90 / 365 days
     * Rating trend graph
     * List of contests including:

       * Rating change
       * Rank
       * Problems unsolved by the student (to date)
   * **Problem Solving Data**

     * Filter by: last 7 / 30 / 90 days
     * Metrics:

       * Most difficult problem solved (rating)
       * Total problems solved
       * Average problem rating
       * Average problems per day
     * Bar chart of solves by rating bucket
     * Submission heat map (calendar view)

3. **Codeforces Data Sync**

   * Nightly cron job (default: 2 AM) to fetch and update all students' Codeforces data
   * Configurable schedule and frequency
   * Real-time fetch if a student's handle changes in the main table

4. **Inactivity Detection & Reminders**

   * After each sync, detect students with no submissions in the last 7 days
   * Send automated email reminders
   * Track and display reminder count per student
   * Option to disable reminders on a per-student basis

## 📂 Project Structure

```
student-progress-management-system/
├── backend/
│   ├── config/                  # Environment and DB configs
│   ├── controllers/             # Business logic and request handling
│   ├── models/                  # Mongoose models (Student, Contest, etc.)
│   ├── node_modules/
│   ├── routes/                  # Express route definitions
│   ├── services/
│   │   └── codeforcesSync.js    # Codeforces sync logic and utilities
│   ├── .env                     # Backend environment variables
│   ├── .gitignore
│   ├── index.js                 # Entry point for backend server
│   ├── package-lock.json
│   └── package.json
├── frontend/
│   ├── node_modules/
│   ├── public/                  # Static assets
│   ├── src/                     # React components and app logic
│   ├── .env                     # Frontend environment variables
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   └── package.json

```

## 🛠️ Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/oitashg/ProTrack.git
   cd Protrack
   ```

2. **Install dependencies**

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Environment variables** Copy `.env.example` to `.env` and update:

   ```ini
   # Backend: backend/.env
   MONGODB_URL=mongodb://localhost:27017/studentProgress
   
   MAIL_HOST = smtp.gmail.com
   MAIL_USER = xyz@gmail.com
   MAIL_PASS = yourpasskey

   # Frontend: frontend/.env
   VITE_APP_BASE_URL=http://localhost:4000/api
   ```

4. **Start the development server**

   ```bash
   # Terminal 1
   cd backend
   npm run dev

   # Terminal 2
   cd frontend
   npm start
   ```

   The frontend will be available at `http://localhost:5173` and backend at `http://localhost:4000`.

## ⚙️ Configuration

* **Cron Schedule**: When sync time is filled by user, it is scheduled to sync the overall data of the student
by the help of cronJob 
* **Real-time sync**: When a student’s Codeforces handle is updated via the UI, data is fetched immediately regardless of cron.

## Cron Patterns 

   field          allowed values
   -----          --------------
   second         0-59
   minute         0-59
   hour           0-23
   day of month   1-31
   month          1-12 (or names, see below)
   day of week    0-7 (0 or 7 is Sunday, or use names)

   `*` Asterisks: Any value
   `1-3,5` Ranges: Ranges and individual values
   `*/2` Steps: Every two units

   Example: '0 0 2 * * *' means at 2:00 AM every day
   
## Codeforces API

* You can get all the information about Codeforces data like data of user, contest or problems along with Methods and Return Objects from [Codeforces API](https://codeforces.com/apiHelp)

## 🧹 Usage

1. Navigate to **Students** to add or manage records.
2. Click on a student row to view their **Profile**.
3. Use the filter dropdowns in **Contest History** and **Problem Data** to adjust time ranges.
4. Toggle email reminders in the student profile to enable/disable automated emails.
5. Download the full student list as CSV using the **Export** button.

## Video Walkthrough

Watch the video here -> [ProTrack](https://drive.google.com/file/d/169O4oAksGcYzPrsW1fgZ3oiORr0hMuNC/view?usp=sharing)