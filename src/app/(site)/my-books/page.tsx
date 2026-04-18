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
				<h1 className="text-4xl font-extrabold tracking-tight">
					Moje požičané knihy
				</h1>
				<p className="text-lg text-slate-500">
					Prezerajte si a spravujte knihy, ktoré momentálne čítate, alebo si pozrite vašu históriu.
				</p>
			</div>
			<MyBooksList />
		</div>
	);
}
