import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { CategoriesTable } from "@/components/admin/Catalogs";
import { Tags } from "lucide-react";

export default async function AdminCategoriesPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                <Tags className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Správa Kategórií</h1>
        </div>
        <p className="text-lg text-slate-500 ml-1">Spravujte kategórie kníh vo vašej knižnici.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 sticky top-8">
          <CategoryForm />
        </div>
        <div className="lg:col-span-2">
            <CategoriesTable />
        </div>
      </div>
    </div>
  );
}
