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

## ⚙️ Configuration

* **Cron Schedule**: When sync time is filled by user, it is scheduled to sync the overall data of the student
by the help of cronJob 
* **Real-time sync**: When a student’s Codeforces handle is updated via the UI, data is fetched immediately regardless of cron.

## Cron Patterns 

### Cron Expression Reference

A standard cron expression consists of the following fields:

| Field           | Allowed Values                                              |
|----------------|-------------------------------------------------------------|
| **Second**      | `0-59`                                                      |
| **Minute**      | `0-59`                                                      |
| **Hour**        | `0-23`                                                      |
| **Day of Month**| `1-31`                                                      |
| **Month**       | `1-12` or names (`JAN` to `DEC`)                            |
| **Day of Week** | `0-7` (`0` or `7` is Sunday) or names (`SUN` to `SAT`)      |

> **Note:** Named values are case-insensitive.

### Special Symbols

| Symbol     | Description                              | Example     |
|------------|------------------------------------------|-------------|
| `*`        | Asterisk: Represents **any value**       | `* * * * *` – every minute |
| `1-3,5`    | Ranges: Specifies a **range or list**     | `1-3,5` – 1, 2, 3, and 5   |
| `*/2`      | Steps: Repeats at **regular intervals**   | `*/2` – every 2 units      |

### Example

* **Cron Expression**: 0 */10 9-17 * * MON-FRI
* **Human-Readable form**: Runs every 10 minutes between 9:00 AM and 5:59 PM, Monday through Friday, at 0 seconds past the minute.

## Codeforces API

* You can get all the information about Codeforces data like data of user, contests or problems along with Methods and Return Objects from [Codeforces API](https://codeforces.com/apiHelp)

## 🧹 Usage

1. Navigate to **Students** to add or manage records.
2. Click on a student row to view their **Profile**.
3. Use the filter dropdowns in **Contest History** and **Problem Data** to adjust time ranges.
4. Toggle email reminders in the student profile to enable/disable automated emails.
5. Download the full student list as CSV using the **Export** button.
