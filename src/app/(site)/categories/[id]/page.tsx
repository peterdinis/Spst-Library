import Image from "next/image";
import { mockCategories, mockBooks } from "@/lib/mockData";
import { notFound } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Library, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CategoryDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const category = mockCategories.find((c) => c.id === id);
	if (!category) notFound();

	// Find all books under this category
	const categoryBooks = mockBooks.filter((b) => b.category === category.name);

	return (
		<div className="max-w-5xl mx-auto space-y-12 pb-16">
			<Link href="/categories">
				<Button variant="ghost" className="mb-4 rounded-full pl-2">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Späť na Kategórie
				</Button>
			</Link>

			<div className="text-center bg-gradient-to-b from-primary/10 to-transparent py-20 px-4 rounded-[3rem] shadow-sm border border-primary/5 relative overflow-hidden">
				<div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
					<Library className="h-[30rem] w-[30rem] rotate-12" />
				</div>
				<div className="relative z-10 space-y-4">
					<div className="inline-flex p-4 bg-primary/20 text-primary rounded-[2rem] mb-4">
						<Library className="h-10 w-10" />
					</div>
					<h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
						{category.name}
					</h1>
					<p className="text-xl font-medium text-slate-500 max-w-xl mx-auto">
						Prehľadávajte {categoryBooks.length} úžasných titulov v tejto
						tematickej kategórii.
					</p>
				</div>
			</div>

			<div className="space-y-6">
				<h2 className="text-3xl font-bold tracking-tight px-2">
					Tituly v kategórii {category.name}
				</h2>

				{categoryBooks.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{categoryBooks.map((book) => (
							<Link href={`/books/${book.id}`} key={book.id}>
								<Card className="flex flex-col h-full bg-card/80 backdrop-blur-xl border-slate-200/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 rounded-3xl overflow-hidden group">
									{book.coverUrl ? (
										<div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50">
											<Image
												src={book.coverUrl}
												alt={book.title}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-500"
											/>
										</div>
									) : (
										<div className="relative w-full aspect-[3/4] bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-b border-slate-200/50 dark:border-slate-800/50">
											<BookOpen className="h-12 w-12 text-slate-300" />
										</div>
									)}
									<div className="p-5 flex-1 flex flex-col justify-center bg-card z-10">
										<CardTitle className="text-xl leading-tight font-bold group-hover:text-primary transition-colors line-clamp-2">
											{book.title}
										</CardTitle>
										<p className="text-sm font-medium text-slate-500 mt-2 line-clamp-1">
											{book.author}
										</p>
									</div>
								</Card>
							</Link>
						))}
					</div>
				) : (
					<div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
						<BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
						<h3 className="text-2xl font-bold">Kategória je prázdna</h3>
						<p className="text-slate-500 mt-2">
							Zatiaľ sme nepridali žiadne knihy tohto žánru.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
