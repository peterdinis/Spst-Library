import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "localhost";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 1025;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || "kniznica@spst.sk";

const transporter = nodemailer.createTransport({
	host: SMTP_HOST,
	port: SMTP_PORT,
	secure: SMTP_PORT === 465, // true for port 465, false for other ports
	auth:
		SMTP_USER && SMTP_PASS
			? {
					user: SMTP_USER,
					pass: SMTP_PASS,
				}
			: undefined,
});

export async function sendTransactionalEmail(
	to: string,
	subject: string,
	html: string,
) {
	try {
		const info = await transporter.sendMail({
			from: `"SPŠT Knižnica" <${EMAIL_FROM}>`,
			to,
			subject,
			html,
		});
		console.log("Email sent: %s", info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error("Error sending email:", error);
		return { success: false, error };
	}
}
