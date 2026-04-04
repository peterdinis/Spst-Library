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
			<h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
				{title}
			</h1>
			{description ? (
				<p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
					{description}
				</p>
			) : null}
		</div>
	);
}
