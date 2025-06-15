const { default: axios } = require("axios");
const nodemailer = require("nodemailer")
const Student = require("../models/Student");


async function syncStudent(student) {
  const handle = student.cfHandle;

  // 1. Fetch rating history
  const { data: { result: contests } } =
    await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);

  // 1) Update lastSync
  student.lastSync = new Date();
  
  // 2) Inactivity detection
  if (!student.emailDisabled) {
    // Count submissions in the past 7 days
    const weekAgo = new Date(Date.now() - 7 * 24*60*60*1000);
    const recentCount = await ProblemSubmission.countDocuments({
      student: student._id,
      when: { $gte: weekAgo }
    });

    if (recentCount === 0) {
      // Send reminder
      await sendReminderEmail(student);
      student.remindersSent += 1;
    }
  }

  // 3) Persist changes
  await student.save();
}

async function syncAllStudents() {
  const students = await Student.find({ cfHandle: { $exists: true, $ne: '' } });
  for (const s of students) {
    try { await syncStudent(s); }
    catch (err) { console.error(`Error syncing ${s.cfHandle}:`, err); }
  }
}

// Your email routine (configure transport as needed)
const sendReminderEmail = async(student) => {
    try{
      const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
      });
      
      const mailOpts = {
        to: student.email,
        from: '"Codeforces Coach" <no-reply@yourapp.com>',
        subject: 'Time to get back to problem solving!',
        text: `Hi ${student.name},\n\nWe noticed you haven’t submitted in the past week. Keep those CF streaks alive! 🚀\n\n—Your Friendly Reminder Bot`
      };
      await transporter.sendMail(mailOpts);
    }
    catch(error){
        console.log(error.message)
    }
}

module.exports = { syncAllStudents, syncStudent, sendReminderEmail};
