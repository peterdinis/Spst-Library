export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-0 min-h-dvh flex-1 flex-col">{children}</div>
	);
}
