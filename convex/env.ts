import { z } from "zod";

const envSchema = z.object({
	SMTP_HOST: z.string().min(1).optional(),
	SMTP_PORT: z.string().min(1).optional(),
	SMTP_USER: z.string().min(1).optional(),
	SMTP_PASS: z.string().min(1).optional(),
	SMTP_FROM: z.string().min(1).optional(),
});

export const env = envSchema.parse(process.env);
