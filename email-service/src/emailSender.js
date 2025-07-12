import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

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
    console.log("'Error while sending mail -> ", error.message);
  }
};