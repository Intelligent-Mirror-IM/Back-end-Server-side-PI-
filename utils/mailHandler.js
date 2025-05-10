import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const mailConfig = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      text,
    };
    await mailConfig.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { sendMail };
