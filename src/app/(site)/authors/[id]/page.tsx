import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { User, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAuthorById } from "@/lib/data";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const author = await getAuthorById(id);
	if (!author) return { title: "Autor" };
	return {
		title: `${author.name} | Autori`,
		description:
			author.bio?.slice(0, 160) ||
			`Profil autora ${author.name} a knihy v katalógu.`,
	};
}

export default async function AuthorDetailsPage({ params }: Props) {
	const { id } = await params;

	const author = await getAuthorById(id);
	if (!author) notFound();

	const authorBooks = author.books ?? [];

	return (
		<div className="mx-auto max-w-4xl space-y-12 pb-16">
			<Link href="/authors">
				<Button variant="ghost" className="mb-4 rounded-full pl-2">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Späť na autorov
				</Button>
			</Link>

			<Card className="relative overflow-hidden rounded-[2.5rem] border-slate-200/50 bg-card/40 shadow-2xl backdrop-blur-xl dark:border-slate-800/50">
				<div className="absolute top-0 z-0 h-40 w-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
				<CardContent className="relative z-10 flex flex-col items-center gap-8 px-8 pb-12 pt-20 text-center md:flex-row md:items-start md:text-left sm:px-12">
					<div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-[2rem] border-4 border-background bg-muted shadow-xl dark:border-slate-900">
						{author.imageUrl ? (
							<Image
								src={author.imageUrl}
								alt={`Fotografia autora ${author.name}`}
								width={160}
								height={160}
								className="h-full w-full object-cover"
							/>
						) : (
							<User className="h-20 w-20 text-primary/60" />
						)}
					</div>
					<div className="flex-1 space-y-4">
						<h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
							{author.name}
						</h1>
						<div className="mx-auto h-1 w-20 rounded-full bg-primary/40 md:mx-0" />
						<p className="text-lg font-medium leading-relaxed text-slate-600 dark:text-slate-300">
							{author.bio ||
								"Životopis pre tohto autora momentálne nie je k dispozícii."}
						</p>
					</div>
				</CardContent>
			</Card>

			<div className="space-y-6">
				<div className="mb-8 flex items-center gap-3">
					<BookOpen className="h-6 w-6 text-primary" />
					<h2 className="text-3xl font-bold tracking-tight">Knihy od autora</h2>
					<span className="rounded-full bg-muted px-3 py-0.5 text-sm font-semibold text-muted-foreground">
						{authorBooks.length}
					</span>
				</div>

				{authorBooks.length > 0 ? (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{authorBooks.map((book) => (
							<Link href={`/books/${book.id}`} key={book.id}>
								<Card className="group flex h-full flex-row overflow-hidden rounded-2xl bg-card/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl dark:bg-slate-900/40">
									{book.coverUrl ? (
										<div className="relative aspect-[3/4] w-1/3 shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-900">
											<Image
												src={book.coverUrl}
												alt={book.title}
												fill
												className="object-cover transition-transform duration-500 group-hover:scale-105"
												sizes="(max-width: 768px) 33vw, 120px"
											/>
										</div>
									) : (
										<div className="flex aspect-[3/4] w-1/3 shrink-0 items-center justify-center bg-muted">
											<BookOpen className="h-8 w-8 text-muted-foreground/50" />
										</div>
									)}
									<div className="flex flex-1 flex-col justify-center p-4">
										<CardTitle className="line-clamp-2 text-xl transition-colors group-hover:text-primary">
											{book.title}
										</CardTitle>
										{book.category?.name ? (
											<p className="mt-2 text-sm font-semibold uppercase tracking-wider text-primary/80">
												{book.category.name}
											</p>
										) : null}
									</div>
								</Card>
							</Link>
						))}
					</div>
				) : (
					<div className="rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
						<BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300" />
						<h3 className="text-xl font-bold">Zatiaľ žiadne knihy</h3>
						<p className="mt-2 text-slate-500">
							V katalógu zatiaľ nie sú priradené žiadne tituly tomuto autorovi.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
