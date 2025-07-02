import nodemailer from "nodemailer";
import axios from "axios";
import Student from "../models/Student.js";
import Contest from "../models/Contest.js";
import Problem from "../models/Problem.js";

//sync mechanism to fetch data from codeforces api and update database for each student
export async function syncStudent(studentId) {
  const student = await Student.findById(studentId);

  if (!student) {
    throw new Error("Student not found");
  }

  const cfHandle = student.handle;

  //extract data from codeforces api
  const { data } = await axios.get(`https://codeforces.com/api/user.info?handles=${cfHandle}`);
  const contestHistory = await axios.get(`https://codeforces.com/api/user.rating?handle=${cfHandle}`);
  const problemHistory = await axios.get(`https://codeforces.com/api/user.status?handle=${cfHandle}`);
  const problemData = await axios.get('https://codeforces.com/api/problemset.problems')

  //store the API datas
  const user = data?.result[0];
  const history = contestHistory?.data?.result;
  const problems = problemHistory?.data?.result;
  const allProblems = problemData?.data?.result?.problems

  //Store the already existing contestId and problemName for this particular student from database
  const existingContests = await Contest.find({student: student._id}).select('contestId').lean();
  const existingProblems = await Problem.find({student: student._id}).select('name').lean();

  console.log("Existing Contests:", existingContests);
  console.log("Existing Problems:", existingProblems);

  //Extract the new contest and problems data
  const newContests = history?.filter(c => c.contestId && !existingContests.some(ec => ec.contestId === c.contestId));
  const newProblems = problems?.filter(p => p.problem && p.verdict === "OK" && !existingProblems.some(ep => ep.name === p.problem.name));

  console.log("New Contests:", newContests);
  console.log("New Problems:", newProblems);

  const participatedContest = newContests?.map(c => c.contestId)
  // console.log("Participated Contests:", participatedContest);

  const solvedProblems = newProblems?.filter(sub => 
    participatedContest.includes(sub.contestId) &&
    sub.author.participantType === "CONTESTANT" &&
    sub.verdict === "OK"
  )
  // console.log("solved Problems:", solvedProblems);

  //Add new contests and update contest schema
  const upsertedContests = await Promise.all(
    newContests?.map(contest => {
      const eachContestSolvedProblem = solvedProblems.filter(c => c.contestId === contest.contestId);
      const eachContestGivenProblems = allProblems.filter(p => p.contestId === contest.contestId);

      Contest.findOneAndUpdate(
        //filter criteria
        { student: student._id, contestId: contest.contestId },
        {
          student: student._id,
          date: new Date(contest.ratingUpdateTimeSeconds * 1000).toISOString(),
          contestId: contest.contestId,
          contestName: contest.contestName,
          oldRating: contest.oldRating,
          newRating: contest.newRating,
          rank: contest.rank || 0,
          unsolvedProblems: eachContestGivenProblems.length - eachContestSolvedProblem.length 
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    })
  );

  //Add new problems and update problem schema
  const accepted = newProblems.filter(s => s.verdict === "OK")
  const upsertedProblems = await Promise.all(
    accepted.map((submission) => {
      return Problem.findOneAndUpdate(
        //Filter on both student and problem name
        { student: student._id, name: submission.problem.name },

        {
          student: student._id,
          name: submission.problem.name,
          rating: submission.problem.rating || 0,
          date: new Date(submission.creationTimeSeconds * 1000).toISOString(),
        },

        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    })
  );

  console.log("Upserted Contests length:", upsertedContests.length);
  console.log("Upserted Problems length:", upsertedProblems.length);

  // Get the created contest and problem IDs
  const contestDataId = upsertedContests?.map((c) => c._id);
  const problemsDataId = upsertedProblems?.map((p) => p._id);

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
        lastProblemSubmitted: problems[0].creationTimeSeconds * 1000 || student.lastProblemSubmitted,
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

  // console.log("Student synced successfully:", updatedStudent);

  //Inactivity detection
  if (!student.emailDisabled) {
    // Count submissions in the past 7 days
    const timeGap = Date.now() - new Date(updatedStudent?.lastProblemSubmitted).getTime();

    if (timeGap > 604800000) {
      // Send reminder
      await sendReminderEmail(student);
      student.remindersSent += 1;
    }
  }

  await student.save();
}

// Sync all students with Codeforces handles
// This function will be called by the cron job
export async function syncAllStudents() {
  //extract data of all students with cfHandle
  const students = await Student.find({ handle: { $exists: true, $ne: "" } });
  // console.log("Students data -> ", students);

  if (students.length === 0) {
    console.log("No students to sync.");
    return;
  }

  //syncing each student
  for (const s of students) {
    try {
      await syncStudent(s._id);
      console.log(`Synced ${s.handle} successfully.`);
    } 
    catch (err) {
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
  } 
  catch (error) {
    console.log(error.message);
  }
};