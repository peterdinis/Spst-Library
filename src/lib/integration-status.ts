/**
 * Agregovaný stav externých platforiem (bez citlivých hodnôt).
 */

import {
	type GraphConfigResult,
	getMicrosoftGraphConfigStatus,
} from "@/lib/azure-validation";

export type IntegrationEnvField = string;

export type IntegrationCheck = {
	ready: boolean;
	missing: IntegrationEnvField[];
	message: string;
};

export type PlatformIntegrationsStatus = {
	microsoftGraph: GraphConfigResult;
	nextAuth: IntegrationCheck;
	uploadthing: IntegrationCheck;
	email: IntegrationCheck;
	/** Aspoň jedna „kritická“ služba je pripravená (Graph, UploadThing alebo produkčný SMTP). */
	anyReady: boolean;
};

function checkNextAuth(): IntegrationCheck {
	const secret = process.env.AUTH_SECRET?.trim();
	const missing: IntegrationEnvField[] = [];
	if (!secret) missing.push("AUTH_SECRET");

	const ready = missing.length === 0;
	return {
		ready,
		missing,
		message: ready
			? "NextAuth: AUTH_SECRET je nastavený."
			: "NextAuth: v produkcii je potrebný AUTH_SECRET (napr. openssl rand -base64 32).",
	};
}

function checkUploadthing(): IntegrationCheck {
	const secret = process.env.UPLOADTHING_SECRET?.trim();
	const appId = process.env.UPLOADTHING_APP_ID?.trim();
	const missing: IntegrationEnvField[] = [];
	if (!secret) missing.push("UPLOADTHING_SECRET");
	if (!appId) missing.push("UPLOADTHING_APP_ID");

	const ready = missing.length === 0;
	return {
		ready,
		missing,
		message: ready
			? "UploadThing: kľúče sú nastavené (obálky a fotky v admine)."
			: "UploadThing: vytvorte aplikáciu na uploadthing.com a nastavte UPLOADTHING_SECRET a UPLOADTHING_APP_ID.",
	};
}

function checkEmail(): IntegrationCheck {
	const host = (process.env.SMTP_HOST ?? "localhost").trim();
	const isLocal =
		host === "localhost" ||
		host === "127.0.0.1" ||
		host === "::1" ||
		host.length === 0;

	if (isLocal) {
		return {
			ready: false,
			missing: [] as IntegrationEnvField[],
			message:
				"E-mail: používa sa lokálny SMTP (vhodné pre vývoj, napr. Mailpit). Pre produkciu nastavte SMTP_HOST, SMTP_PORT a podľa potreby SMTP_USER / SMTP_PASS, EMAIL_FROM.",
		};
	}

	const missing: IntegrationEnvField[] = [];
	if (!process.env.EMAIL_FROM?.trim()) missing.push("EMAIL_FROM");

	const ready = missing.length === 0;
	return {
		ready,
		missing,
		message: ready
			? `E-mail: odosielanie cez ${host} (odosielateľ ${process.env.EMAIL_FROM}).`
			: `E-mail: server ${host} je nastavený; doplňte EMAIL_FROM.`,
	};
}

export function getPlatformIntegrationsStatus(): PlatformIntegrationsStatus {
	const microsoftGraph = getMicrosoftGraphConfigStatus();
	const nextAuth = checkNextAuth();
	const uploadthing = checkUploadthing();
	const email = checkEmail();

	const anyReady =
		microsoftGraph.ready || nextAuth.ready || uploadthing.ready || email.ready;

	return {
		microsoftGraph,
		nextAuth,
		uploadthing,
		email,
		anyReady,
	};
}
