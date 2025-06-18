import nodemailer from "nodemailer";
import axios from "axios";
import Student from "../models/Student.js";
import Contest from "../models/Contest.js";
import Problem from "../models/Problem.js";

//sync meachanism to fetch data from codeforces api and update database for each student
export async function syncStudent(studentId) {
  const student = await Student.findById(studentId);

  if (!student) {
    throw new Error("Student not found");
  }

  const cfHandle = student.handle;

  //extract data from codeforces api
  const { data } = await axios.get(
    `https://codeforces.com/api/user.info?handles=${cfHandle}`
  );
  const contestHistory = await axios.get(
    `https://codeforces.com/api/user.rating?handle=${cfHandle}`
  );
  const problemHistory = await axios.get(
    `https://codeforces.com/api/user.status?handle=${cfHandle}&from1&count=1`
  );

  //store the API datas
  const user = data?.result[0];
  const history = contestHistory?.data?.result;
  const problems = problemHistory?.data?.result;

  //Add new contests and update contest schema
  const upsertedContests = await Promise.all(
    history.map((c) =>
      Contest.findOneAndUpdate(
        //filter criteria
        { student: student._id, contestId: c.contestId },
        {
          student: student._id,
          contestId: c.contestId,
          contestName: c.contestName,
          oldRating: c.oldRating,
          newRating: c.newRating,
          rank: c.rank || 0,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  );

  //Add new problems and update problem schema
  const upsertedProblems = await Promise.all(
    problems.map((s) => {
      return Problem.findOneAndUpdate(
        { student: student._id },
        {
          student: student._id,
          name: s.problem.name,
          rating: s.problem.rating || 0,
          // date:      new Date(s.creationTimeSeconds * 1000), // Convert seconds to milliseconds
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    })
  );

  // Get the created contest and problem IDs
  const contestDataId = upsertedContests.map((c) => c._id);
  const problemsDataId = upsertedProblems.map((p) => p._id);

  console.log("Contest Data IDs:", contestDataId);
  console.log("Problems Data IDs:", problemsDataId);

  // Find student by ID and update everything
  const updatedStudent = await Student.findByIdAndUpdate(
    student._id,
    {
      $set: {
        firstName: user.firstName || student.firstName,
        lastName: user.lastName || student.lastName,
        rating: user.rating || student.rating,
        maxRating: user.maxRating || student.maxRating,
        lastSync: new Date(),
      },
      $push: {
        contests: {
          $each: contestDataId,
        },
        problems: {
          $each: problemsDataId,
        },
      },
    },
    { new: true }
  )
    .populate("contests")
    .populate("problems")
    .exec();

  console.log("Student added successfully:", updatedStudent);

  // 2) Inactivity detection
  if (!student.emailDisabled) {
    // Count submissions in the past 7 days
    // const timeGap = new Date(Date.now() - student.lastProblemSubmitted);
    const timeGap = 9 * 24 * 60 * 60 * 1000

    if (timeGap > 7 * 24 * 60 * 60 * 1000) {
      // Send reminder
      await sendReminderEmail(student);
      student.remindersSent += 1;
    }
  }

  // 3) Persist changes
  await student.save();
}

// Sync all students with Codeforces handles
// This function will be called by the cron job
export async function syncAllStudents() {
  //extract data of all students with cfHandle
  const students = await Student.find({ handle: { $exists: true, $ne: "" } });
  console.log("Students data -> ", students);

  if (students.length === 0) {
    console.log("No students to sync.");
    return;
  }

  //syncing each student
  for (const s of students) {
    try {
      await syncStudent(s._id);
      console.log(`Synced ${s.handle} successfully.`);
    } catch (err) {
      console.error(`Error syncing ${s.handle}:`, err);
    }
  }
}

// Reminder email to students who haven't submitted in the past week
export const sendReminderEmail = async (student) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: '"Codeforces Coach" <no-reply@yourapp.com>',
      to: student.email,
      subject: "Time to get back to problem solving!",
      text: `Hi ${student.firstName},\n\nWe noticed you haven’t submitted in the past week. Keep those CF streaks alive! 🚀\n\n—Your Friendly Reminder Bot`,
    });

    console.log(info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};