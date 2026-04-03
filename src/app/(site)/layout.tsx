export default function SiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="container mx-auto min-h-0 flex-1 px-4 py-8">
			{children}
		</main>
	);
}
