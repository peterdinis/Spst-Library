"use client";

export default function SiteLoading() {
	return (
		<div className="space-y-8 pb-16">
			<div className="h-48 rounded-3xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
			<div className="h-14 max-w-2xl mx-auto rounded-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{Array.from({ length: 8 }).map((_, index) => (
					<div
						key={index}
						className="h-72 rounded-3xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse"
					/>
				))}
			</div>
		</div>
	);
}
