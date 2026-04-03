import { cn } from "@/lib/utils";

export function AdminPageHeader({
	title,
	description,
	className,
}: {
	title: string;
	description?: string;
	className?: string;
}) {
	return (
		<div className={cn("mb-8 space-y-2", className)}>
			<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
				{title}
			</h1>
			{description ? (
				<p className="text-slate-600 dark:text-slate-400 max-w-2xl text-base leading-relaxed">
					{description}
				</p>
			) : null}
		</div>
	);
}
