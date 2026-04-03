import { auth } from "@/auth";
import { MyBooksList } from "@/components/MyBooksList";
import { redirect } from "next/navigation";

export default async function MyBooksPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">My Borrowed Books</h1>
        <p className="text-lg text-slate-500">View and return the books you are currently reading.</p>
      </div>
      <MyBooksList />
    </div>
  );
}
