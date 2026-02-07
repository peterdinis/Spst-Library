"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import nodemailer from "nodemailer";
import { env } from "./env";

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
		const { SMTP_HOST: host, SMTP_PORT: port, SMTP_USER: user, SMTP_PASS: pass } = env;

		const transporter = nodemailer.createTransport({
			host,
			port: Number(port),
			auth: {
				user,
				pass,
			},
		});

		try {
			const info = await transporter.sendMail({
				from: `"SPŠT Knižnica"`,
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
		const { SMTP_HOST: host, SMTP_USER: user, SMTP_PASS: pass, SMTP_PORT: port, SMTP_FROM: from_env } = env;

		const transporter = nodemailer.createTransport({
			host,
			port: Number(port),
			secure: Number(port) === 465,
			auth: {
				user,
				pass,
			},
		});

		try {
			await transporter.verify();
			const info = await transporter.sendMail({
				from: `"SPŠT Knižnica Test" <${from_env || user}>`,
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
