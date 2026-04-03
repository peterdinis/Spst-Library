import { AuthorForm } from "@/components/admin/AuthorForm";
import { AuthorsTable } from "@/components/admin/Catalogs";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminAuthorsPage() {
	return (
		<div className="space-y-10 pb-12">
			<AdminPageHeader
				title="Správa autorov"
				description="Pridajte autorov s fotkou (Azure Blob, priečinok authors). Fotka sa zobrazí v tabuľke aj vo formulári."
			/>

			<div className="grid grid-cols-1 xl:grid-cols-[minmax(0,420px),1fr] gap-8 xl:gap-10 items-start">
				<div className="relative z-10 bg-slate-50 pb-1 dark:bg-background xl:sticky xl:top-24 xl:max-h-[calc(100dvh-6rem)] xl:shrink-0 xl:overflow-y-auto xl:self-start xl:overscroll-contain">
					<AuthorForm />
				</div>
				<AuthorsTable />
			</div>
		</div>
	);
}
