// convex/email.ts
"use node";

import { v } from "convex/values";
import { internalAction, action } from "./_generated/server";
import { internal } from "./_generated/api";
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
		const port = process.env.SMTP_PORT
		const user = process.env.SMTP_USER || "";
		const pass = process.env.SMTP_PASS || "";
		const fromEmail = process.env.SMTP_FROM || user;

		// Debug logging
		console.log("📧 Email sending attempt:", {
			host,
			port,
			user: user ? `${user.substring(0, 4)}...` : "NOT_SET",
			pass: pass ? "***" : "NOT_SET",
			to: args.to,
		});

		// Skontrolujte, či sú nastavené povinné údaje
		if (!user || !pass) {
			const errorMsg = "SMTP credentials not configured in environment variables. Please set SMTP_USER and SMTP_PASS in Convex dashboard (Settings → Environment Variables).";
			console.error("❌", errorMsg);
			return { 
				success: false, 
				error: "SMTP credentials not configured",
				message: errorMsg
			};
		}

		// Pre Mailtrap port 587 potrebujeme secure: false, ale pre port 465 secure: true
		const portNum = Number(port);
		const isSecure = portNum === 465;
		
		const transporter = nodemailer.createTransport({
			host,
			port: portNum,
			secure: isSecure,
			auth: {
				user,
				pass,
			},
			tls: {
				rejectUnauthorized: false, // Pre testovacie účely (Mailtrap)
			},
		});

		try {
			// Overenie pripojenia pred odoslaním
			console.log("🔍 Verifying SMTP connection...");
			await transporter.verify();
			console.log("✅ SMTP connection verified");

			const mailOptions = {
				from: fromEmail ? `"SPŠT Knižnica" <${fromEmail}>` : `"SPŠT Knižnica" <${user}>`,
				to: args.to,
				subject: args.subject,
				text: args.text,
				html: args.html || args.text,
			};

			console.log("📤 Sending email to:", args.to);
			const info = await transporter.sendMail(mailOptions);

			console.log("✅ Message sent successfully:", info.messageId);
			return { success: true, messageId: info.messageId };
		} catch (error: any) {
			console.error("❌ Error sending email:", error);
			const errorDetails = {
				message: error.message || String(error),
				code: error.code,
				command: error.command,
				response: error.response,
			};
			console.error("Error details:", errorDetails);
			return { 
				success: false, 
				error: error.message || String(error),
				details: errorDetails
			};
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
		const port = process.env.SMTP_PORT || "587"; // Mailtrap default port
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

		// Pre Mailtrap port 587 potrebujeme secure: false, ale pre port 465 secure: true
		const portNum = Number(port);
		const isSecure = portNum === 465;

		const transporter = nodemailer.createTransport({
			host,
			port: portNum,
			secure: isSecure,
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

/**
 * Public action to test email sending (for debugging)
 * Call this from Convex dashboard or frontend to test email functionality
 */
export const testSendEmail = action({
	args: {
		to: v.string(),
	},
	handler: async (ctx, args): Promise<{ success: boolean; error?: string; messageId?: string }> => {
		console.log("🧪 Test email action called for:", args.to);
		
		try {
			const result = await ctx.runAction(internal.emails.sendEmail, {
				to: args.to,
				subject: "Test email - SPŠT Knižnica",
				text: "Toto je testovací email z SPŠT Knižnice.",
				html: "<p>Toto je <strong>testovací email</strong> z SPŠT Knižnice.</p>",
			}) as { success: boolean; error?: string; messageId?: string };
			
			console.log("✅ Test email result:", result);
			return result;
		} catch (error: any) {
			console.error("❌ Test email failed:", error);
			return {
				success: false,
				error: error.message || String(error),
			};
		}
	},
});