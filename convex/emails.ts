// convex/email.ts
"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import nodemailer from "nodemailer";

/**
 * Send an email using Nodemailer
 */
export const sendEmail = internalAction({
	args: {
		to: v.string(),
		subject: v.string(),
		text: v.string(),
		html: v.optional(v.string()),
	},
	handler: async (_ctx, args) => {
		// Čítajte priamo z process.env
		const host = process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io";
		const port = process.env.SMTP_PORT || "2525";
		const user = process.env.SMTP_USER || "";
		const pass = process.env.SMTP_PASS || "";
		const fromEmail = process.env.SMTP_FROM || user;

		// Skontrolujte, či sú nastavené povinné údaje
		if (!user || !pass) {
			console.error("SMTP credentials not configured in environment variables");
			return { 
				success: false, 
				error: "SMTP credentials not configured",
				message: "Please set SMTP_USER and SMTP_PASS environment variables in Convex dashboard."
			};
		}

		const transporter = nodemailer.createTransport({
			host,
			port: Number(port),
			secure: false, // Mailtrap nevyžaduje SSL pre porty 25, 587, 2525
			auth: {
				user,
				pass,
			},
			tls: {
				rejectUnauthorized: false, // Pre testovacie účely
			},
		});

		try {
			const info = await transporter.sendMail({
				from: fromEmail ? `"SPŠT Knižnica" <${fromEmail}>` : `"SPŠT Knižnica" <${user}>`,
				to: args.to,
				subject: args.subject,
				text: args.text,
				html: args.html || args.text,
			});

			console.log("✅ Message sent successfully:", info.messageId);
			return { success: true, messageId: info.messageId };
		} catch (error) {
			console.error("❌ Error sending email:", error);
			return { success: false, error: String(error) };
		}
	},
});

/**
 * Test SMTP connection by sending a test email
 */
export const testConnection = internalAction({
	args: {
		to: v.string(),
	},
	handler: async (_ctx, args) => {
		const host = process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io";
		const port = process.env.SMTP_PORT || "2525";
		const user = process.env.SMTP_USER || "";
		const pass = process.env.SMTP_PASS || "";
		const fromEmail = process.env.SMTP_FROM || user;

		if (!user || !pass) {
			return { 
				success: false, 
				error: "SMTP credentials not configured",
				details: {
					host,
					port,
					user: "NOT_SET",
					timestamp: new Date().toISOString(),
				}
			};
		}

		const transporter = nodemailer.createTransport({
			host,
			port: Number(port),
			secure: false,
			auth: {
				user,
				pass,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		try {
			await transporter.verify();
			console.log("✅ SMTP connection verified");
			
			const info = await transporter.sendMail({
				from: fromEmail ? `"SPŠT Knižnica Test" <${fromEmail}>` : `"SPŠT Knižnica Test" <${user}>`,
				to: args.to,
				subject: "Test pripojenia SMTP - SPŠT Knižnica",
				text: `Testovací email z SPŠT Knižnice\n\nDetaily:\nHost: ${host}\nPort: ${port}\nPoužívateľ: ${user}`,
				html: `
					<h1>Test pripojenia SMTP</h1>
					<p>Toto je testovací email z <strong>SPŠT Knižnice</strong>.</p>
					<p>✅ Vaše nastavenia SMTP sú správne!</p>
					<hr>
					<p><strong>Detaily pripojenia:</strong></p>
					<ul>
						<li><strong>Host:</strong> ${host}</li>
						<li><strong>Port:</strong> ${port}</li>
						<li><strong>Používateľ:</strong> ${user}</li>
						<li><strong>Čas:</strong> ${new Date().toLocaleString()}</li>
					</ul>
				`,
			});

			console.log("✅ Test email sent:", info.messageId);
			return { 
				success: true, 
				messageId: info.messageId,
				details: {
					host,
					port,
					user,
					timestamp: new Date().toISOString(),
				}
			};
		} catch (error) {
			console.error("❌ SMTP connection test failed:", error);
			return { 
				success: false, 
				error: String(error),
				details: {
					host,
					port,
					user,
					timestamp: new Date().toISOString(),
				}
			};
		}
	},
});