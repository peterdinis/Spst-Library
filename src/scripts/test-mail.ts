import { sendTransactionalEmail } from "@/lib/mail";

async function testMail() {
	console.log("Sending test email to MailCrab...");
	const result = await sendTransactionalEmail(
		"test@example.com",
		"Testovací e-mail z SPŠT Knižnice",
		`
		<h1>Knižnica SPŠT - Test</h1>
		<p>Toto je testovací e-mail pre overenie funkčnosti MailCrab servera.</p>
		<p>Ak vidíte tento e-mail, spojenie so SMTP serverom funguje správne.</p>
		`,
	);

	if (result.success) {
		console.log("Test email sent successfully! MessageID:", result.messageId);
	} else {
		console.error("Failed to send test email:", result.error);
		process.exit(1);
	}
}

testMail().catch((err) => {
	console.error("Unhandled error in test script:", err);
	process.exit(1);
});
