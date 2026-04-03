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

			<div className="grid grid-cols-1 xl:grid-cols-[minmax(0,420px),1fr] gap-8 xl:gap-10 items-start">
				<div className="relative z-10 bg-slate-50 pb-1 dark:bg-background xl:sticky xl:top-24 xl:max-h-[calc(100dvh-6rem)] xl:shrink-0 xl:overflow-y-auto xl:self-start xl:overscroll-contain">
					<CategoryForm />
				</div>
				<CategoriesTable />
			</div>
		</div>
	);
}
