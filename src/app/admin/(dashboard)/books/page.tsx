import { BookForm } from "@/components/admin/BookForm";
import { BooksTable } from "@/components/admin/Catalogs";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminBooksPage() {
	return (
		<div className="space-y-10 pb-12">
			<AdminPageHeader
				title="Správa kníh"
				description="Vytvárajte a upravujte tituly. Obálku zadávate ako URL adresu obrázka."
			/>

			<div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,420px),1fr] xl:gap-10">
				<div className="relative z-10 space-y-4 rounded-2xl bg-slate-50 p-1 dark:bg-background">
					<BookForm />
				</div>
				<div className="min-w-0">
					<BooksTable />
				</div>
			</div>
		</div>
	);
}
