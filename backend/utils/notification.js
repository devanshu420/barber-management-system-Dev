const nodemailer = require("nodemailer")
require("dotenv").config()

async function getTransporter() {
	// Use real SMTP when configured
	if (process.env.SMTP_HOST && process.env.SMTP_USER) {
		return nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT) || 587,
			secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		})
	}

	// Fallback to Ethereal for local/dev if no SMTP configured
	const testAccount = await nodemailer.createTestAccount()
	return nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass,
		},
	})
}

exports.sendEmail = async ({ to, subject, text, html, from }) => {
	const transporter = await getTransporter()
	const mailOptions = {
		from: from || process.env.EMAIL_FROM || "no-reply@example.com",
		to,
		subject,
		text,
		html,
	}
	const info = await transporter.sendMail(mailOptions)

	// In non-production, print preview URL for Ethereal
	if (process.env.NODE_ENV !== "production") {
		const preview = nodemailer.getTestMessageUrl(info)
		if (preview) console.log("Email preview URL:", preview)
	}

	return info
}
