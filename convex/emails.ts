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
		const host = process.env.SMTP_HOST;
		const port = process.env.SMTP_PORT;
		const user = process.env.SMTP_USER;
		const pass = process.env.SMTP_PASS;
		const from = process.env.SMTP_FROM || user;

		if (!host || !port || !user || !pass) {
			console.error("Missing SMTP configuration environment variables");
			return { success: false, error: "Missing SMTP configuration" };
		}

		const transporter = nodemailer.createTransport({
			host,
			port: Number(port),
			secure: Number(port) === 465, // true for port 465, false for other ports
			auth: {
				user,
				pass,
			},
		});

		try {
			const info = await transporter.sendMail({
				from: `"SPŠT Knižnica" <${from}>`,
				to: args.to,
				subject: args.subject,
				text: args.text,
				html: args.html || args.text,
			});

			console.log("Message sent: %s", info.messageId);
			return { success: true, messageId: info.messageId };
		} catch (error) {
			console.error("Error sending email:", error);
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
		const host = process.env.SMTP_HOST;
		const user = process.env.SMTP_USER;

		if (!host || !user) {
			return { success: false, error: "SMTP configuration missing" };
		}

		const transporter = nodemailer.createTransport({
			host,
			port: Number(process.env.SMTP_PORT),
			secure: Number(process.env.SMTP_PORT) === 465,
			auth: {
				user,
				pass: process.env.SMTP_PASS,
			},
		});

		try {
			await transporter.verify();
			const info = await transporter.sendMail({
				from: `"SPŠT Knižnica Test" <${process.env.SMTP_FROM || user}>`,
				to: args.to,
				subject: "Test pripojenia SMTP",
				text: "Toto je testovací email z SPŠT Knižnice. Vaše nastavenia SMTP sú správne.",
				html: "<h1>Test pripojenia SMTP</h1><p>Toto je testovací email z <strong>SPŠT Knižnice</strong>. Vaše nastavenia SMTP sú správne.</p>",
			});

			return { success: true, messageId: info.messageId };
		} catch (error) {
			return { success: false, error: String(error) };
		}
	},
});
