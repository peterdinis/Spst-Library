import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<AdminShell>{children}</AdminShell>
		</div>
	);
}
