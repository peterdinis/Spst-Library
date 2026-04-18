import { CategoryForm } from "@/components/admin/CategoryForm";
import { CategoriesTable } from "@/components/admin/Catalogs";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminCategoriesPage() {
	return (
		<div className="space-y-10 pb-12">
			<AdminPageHeader
				title="Správa kategórií"
				description="Žánre a tematické okruhy pre knihy v katalógu."
			/>

			<div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,420px),1fr] xl:gap-10">
				<div className="relative z-10 rounded-2xl bg-slate-50 p-1 dark:bg-background">
					<CategoryForm />
				</div>
				<div className="min-w-0">
					<CategoriesTable />
				</div>
			</div>
		</div>
	);
}
