import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SettingsPageClient } from "@/components/SettingsPageClient";

export const metadata: Metadata = {
	title: "Nastavenia",
	description:
		"Notifikácie a osobná čitateľská výzva v školskej knižnici SPŠT.",
};

export default async function SettingsPage() {
	const session = await auth();
	if (!session?.user) {
		redirect("/login");
	}

	return <SettingsPageClient />;
}
