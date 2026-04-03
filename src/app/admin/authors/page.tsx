import { AuthorForm } from "@/components/admin/AuthorForm";
import { AuthorsTable } from "@/components/admin/Catalogs";
import { Users } from "lucide-react";

export default async function AdminAuthorsPage() {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                <Users className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Správa Autorov</h1>
        </div>
        <p className="text-lg text-slate-500 ml-1">Spravujte autorov vo vašom knižnom katalógu.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 sticky top-8">
          <AuthorForm />
        </div>
        <div className="lg:col-span-2">
            <AuthorsTable />
        </div>
      </div>
    </div>
  );
}
