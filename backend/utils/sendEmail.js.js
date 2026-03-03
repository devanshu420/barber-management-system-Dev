const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",      
  port: 587,                   
  secure: false,               
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, 
  },
});


exports.sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Barber App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset OTP",
    html: `
      <h2>Password Reset</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });
};

exports.sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Barber App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};