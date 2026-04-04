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

			<div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,420px),1fr] xl:gap-10">
				<div className="relative z-10 rounded-2xl bg-slate-50 p-1 dark:bg-background xl:sticky xl:top-24 xl:self-start">
					<AuthorForm />
				</div>
				<div className="min-w-0">
					<AuthorsTable />
				</div>
			</div>
		</div>
	);
}
