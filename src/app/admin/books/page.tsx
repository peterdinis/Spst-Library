import { BookForm } from "@/components/admin/BookForm";
import { BooksTable } from "@/components/admin/Catalogs";

export default async function AdminBooksPage() {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Správa Kníh</h1>
        <p className="text-lg text-slate-500">Pridávajte nové knihy do knižnice alebo upravujte existujúce.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 sticky top-8">
          <BookForm />
        </div>
        <div className="lg:col-span-2">
            <BooksTable />
        </div>
      </div>
    </div>
  );
}
