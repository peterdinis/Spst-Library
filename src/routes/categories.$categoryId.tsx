import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import {
	ArrowLeft,
	Edit,
	Trash2,
	Loader2,
	AlertCircle,
	BookOpen,
	FolderTree,
	Tag,
	ToggleLeft,
	ToggleRight,
	Eye,
	EyeOff,
	TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";

export const Route = createFileRoute("/categories/$categoryId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { categoryId } = Route.useParams();
	const navigate = useNavigate();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [moveToCategory] = useState<string>("");

	const category = useQuery(api.categories.getCategoryById, {
		id: categoryId as Id<"categories">,
	});

	const deleteCategory = useMutation(api.categories.deleteCategory);
	const toggleActive = useMutation(api.categories.toggleCategoryActive);

	const handleDelete = async () => {
		try {
			await deleteCategory({
				id: categoryId as Id<"categories">,
				moveBooksTo: moveToCategory
					? (moveToCategory as Id<"categories">)
					: undefined,
			});
			toast.success("Kategória bola odstránená");
			navigate({ to: "/categories" });
		} catch (error: any) {
			toast.error("Nepodarilo sa odstrániť kategóriu", {
				description: error.message || "Skúste to znova",
			});
		}
	};

	const handleToggleActive = async () => {
		try {
			const result = await toggleActive({ id: categoryId as Id<"categories"> });
			toast.success(
				result.isActive
					? "Kategória bola aktivovaná"
					: "Kategória bola deaktivovaná",
			);
		} catch (error: any) {
			toast.error("Nepodarilo sa aktualizovať stav", {
				description: error.message,
			});
		}
	};

	if (category === undefined) {
		return (
			<div className="flex items-center justify-center min-h-[60vh] sm:min-h-screen">
				<div className="text-center space-y-4 animate-in fade-in duration-300">
					<Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin mx-auto text-primary" />
					<p className="text-sm sm:text-base text-muted-foreground">
						Načítavam detaily kategórie...
					</p>
				</div>
			</div>
		);
	}

	if (category === null) {
		return (
			<div className="flex items-center justify-center min-h-[60vh] sm:min-h-screen px-4">
				<Card className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
					<CardContent className="pt-6">
						<div className="text-center space-y-4">
							<AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-destructive" />
							<div>
								<h2 className="text-xl sm:text-2xl font-bold">
									Kategória nebola nájdená
								</h2>
								<p className="text-sm sm:text-base text-muted-foreground mt-2">
									Kategória, ktorú hľadáte, neexistuje.
								</p>
							</div>
							<Button
								onClick={() => navigate({ to: "/categories" })}
								className="w-full sm:w-auto"
							>
								<ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
								Späť na kategórie
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container max-w-6xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
			{/* Header Actions */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
				<Button
					variant="ghost"
					onClick={() => navigate({ to: "/categories" })}
					className="gap-2 self-start sm:self-center"
					size="sm"
				>
					<ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
					Späť na kategórie
				</Button>

				<div className="flex gap-2 flex-wrap">
					<Button
						variant="outline"
						onClick={handleToggleActive}
						className="gap-2 flex-1 sm:flex-initial text-xs sm:text-sm"
						size="sm"
					>
						{category.isActive ? (
							<>
								<EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
								Deaktivovať
							</>
						) : (
							<>
								<Eye className="h-3 w-3 sm:h-4 sm:w-4" />
								Aktivovať
							</>
						)}
					</Button>
					<Button
						variant="outline"
						onClick={() => navigate({ to: `/categories/${categoryId}/edit` })}
						className="gap-2 flex-1 sm:flex-initial text-xs sm:text-sm"
						size="sm"
					>
						<Edit className="h-3 w-3 sm:h-4 sm:w-4" />
						Upraviť
					</Button>
					<Button
						variant="destructive"
						onClick={() => setShowDeleteDialog(true)}
						className="gap-2 flex-1 sm:flex-initial text-xs sm:text-sm"
						size="sm"
					>
						<Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
						Odstrániť
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
				{/* Left Column - Category Info */}
				<div className="lg:col-span-1 animate-in fade-in slide-in-from-left-4 duration-500">
					<Card className="sticky top-4 sm:top-8">
						<CardContent className="p-4 sm:p-6">
							<div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
								{/* Category Icon/Color */}
								<div className="animate-in zoom-in-50 duration-700 delay-100">
									<div
										className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg"
										style={{
											backgroundColor: category.color || "#6366f1",
										}}
									>
										{category.icon ? (
											<span className="text-3xl sm:text-4xl md:text-6xl">
												{category.icon}
											</span>
										) : (
											<Tag className="h-8 w-8 sm:h-10 sm:w-10 md:h-16 md:w-16 text-white" />
										)}
									</div>
								</div>

								{/* Category Name */}
								<div className="space-y-1 sm:space-y-2 w-full">
									<h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight wrap-break-word px-2">
										{category.name}
									</h1>
									<div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
										<Badge
											variant={category.isActive ? "default" : "secondary"}
											className="gap-1 text-xs"
										>
											{category.isActive ? (
												<>
													<ToggleRight className="h-2 w-2 sm:h-3 sm:w-3" />
													Aktívna
												</>
											) : (
												<>
													<ToggleLeft className="h-2 w-2 sm:h-3 sm:w-3" />
													Neaktívna
												</>
											)}
										</Badge>
										<Badge variant="outline" className="font-mono text-xs">
											{category.slug}
										</Badge>
									</div>
								</div>

								{/* Stats Grid */}
								<div className="w-full grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
									<div className="text-center">
										<BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2 text-muted-foreground" />
										<div className="text-lg sm:text-xl md:text-2xl font-bold">
											{category.bookCount}
										</div>
										<div className="text-xs text-muted-foreground">Kníh</div>
									</div>
									<div className="text-center">
										<FolderTree className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2 text-muted-foreground" />
										<div className="text-lg sm:text-xl md:text-2xl font-bold">
											{category.subcategories?.length || 0}
										</div>
										<div className="text-xs text-muted-foreground">
											Podkategórií
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Details */}
				<div className="lg:col-span-2 space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
					{/* Description */}
					{category.description && (
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader className="p-4 sm:p-6">
								<CardTitle className="text-base sm:text-lg md:text-xl">
									Popis
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
								<p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
									{category.description}
								</p>
							</CardContent>
						</Card>
					)}

					{/* Subcategories */}
					{category.subcategories && category.subcategories.length > 0 && (
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader className="p-4 sm:p-6">
								<CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
									<FolderTree className="h-4 w-4 sm:h-5 sm:w-5" />
									Podkategórie ({category.subcategories.length})
								</CardTitle>
								<CardDescription className="text-xs sm:text-sm">
									Podradené kategórie pod {category.name}
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
									{category.subcategories.map((sub) => (
										<button
											key={sub._id}
											onClick={() => navigate({ to: `/categories/${sub._id}` })}
											className={cn(
												"flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border-2 transition-all hover:shadow-md hover:scale-105",
												"text-left hover:border-primary/50",
											)}
										>
											<div
												className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center shrink-0"
												style={{ backgroundColor: sub.color || "#6366f1" }}
											>
												{sub.icon ? (
													<span className="text-lg sm:text-xl md:text-2xl">
														{sub.icon}
													</span>
												) : (
													<Tag className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
												)}
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-medium truncate text-sm sm:text-base">
													{sub.name}
												</p>
												<p className="text-xs text-muted-foreground">
													{sub.bookCount} kníh
												</p>
											</div>
										</button>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Books Preview */}
					<Card className="hover:shadow-lg transition-shadow">
						<CardHeader className="p-4 sm:p-6">
							<CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
								<BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
								Knihy v tejto kategórii
							</CardTitle>
							<CardDescription className="text-xs sm:text-sm">
								Najnovšie knihy zaradené pod {category.name}
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
							{category.booksPreview && category.booksPreview.length > 0 ? (
								<div className="space-y-2 sm:space-y-3">
									{category.booksPreview.map((book) => (
										<div
											key={book._id}
											className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
											onClick={() => navigate({ to: `/books/${book._id}` })}
										>
											<div className="w-8 h-10 sm:w-10 sm:h-14 md:w-12 md:h-16 bg-muted rounded shrink-0" />
											<div className="flex-1 min-w-0">
												<h4 className="font-medium truncate text-sm sm:text-base">
													{book.title}
												</h4>
												<p className="text-xs text-muted-foreground">
													{book.isbn}
												</p>
												<Badge
													variant={
														book.status === "available"
															? "default"
															: "secondary"
													}
													className="mt-1 text-xs"
												>
													{book.status === "available"
														? "Dostupná"
														: "Vypožičaná"}
												</Badge>
											</div>
										</div>
									))}
									{category.bookCount > 10 && (
										<Button
											variant="outline"
											className="w-full text-xs sm:text-sm"
											onClick={() =>
												navigate({
													to: "/books",
													search: { categoryId: category._id },
												})
											}
										>
											<TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
											Zobraziť všetkých {category.bookCount} kníh
										</Button>
									)}
								</div>
							) : (
								<div className="text-center py-6 sm:py-12 text-muted-foreground">
									<BookOpen className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-3 sm:mb-4 opacity-20" />
									<p className="text-sm sm:text-base">
										V tejto kategórii zatiaľ nie sú žiadne knihy
									</p>
									<Button variant="link" className="mt-2 text-xs sm:text-sm">
										Pridať knihu
									</Button>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Details Card */}
					<Card className="hover:shadow-lg transition-shadow">
						<CardHeader className="p-4 sm:p-6">
							<CardTitle className="text-base sm:text-lg md:text-xl">
								Detaily kategórie
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
							<div className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded-md transition-colors">
								<span className="text-xs sm:text-sm font-medium">Slug</span>
								<code className="text-xs sm:text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
									{category.slug}
								</code>
							</div>

							{category.color && (
								<div className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded-md transition-colors">
									<span className="text-xs sm:text-sm font-medium">Farba</span>
									<div className="flex items-center gap-2">
										<div
											className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded border"
											style={{ backgroundColor: category.color }}
										/>
										<code className="text-xs sm:text-sm text-muted-foreground">
											{category.color}
										</code>
									</div>
								</div>
							)}

							{category.icon && (
								<div className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded-md transition-colors">
									<span className="text-xs sm:text-sm font-medium">Ikona</span>
									<span className="text-xl sm:text-2xl">{category.icon}</span>
								</div>
							)}

							<Separator />

							<div className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded-md transition-colors">
								<span className="text-xs sm:text-sm font-medium">
									Vytvorená
								</span>
								<span className="text-xs sm:text-sm text-muted-foreground">
									{new Date(category.createdAt).toLocaleDateString("sk-SK", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
							</div>

							<div className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded-md transition-colors">
								<span className="text-xs sm:text-sm font-medium">
									Posledná úprava
								</span>
								<span className="text-xs sm:text-sm text-muted-foreground">
									{new Date(category.updatedAt).toLocaleDateString("sk-SK", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
					<AlertDialogHeader>
						<AlertDialogTitle>Odstrániť kategóriu?</AlertDialogTitle>
						<AlertDialogDescription className="text-sm sm:text-base">
							Ste si istí, že chcete odstrániť <strong>{category.name}</strong>?
							Táto akcia je nevratná.
							{category.bookCount > 0 && (
								<span className="block mt-2 sm:mt-3 text-destructive font-medium text-sm">
									Upozornenie: Táto kategória má {category.bookCount}{" "}
									{category.bookCount === 1 ? "knihu" : "knihy"}. Musíte ich buď
									presunúť do inej kategórie, inak budú bez kategórie.
								</span>
							)}
							{category.subcategories && category.subcategories.length > 0 && (
								<span className="block mt-2 text-destructive font-medium text-sm">
									Táto kategória má {category.subcategories.length}{" "}
									podkategórií. Prosím, odstráňte ich najskôr.
								</span>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="text-xs sm:text-sm">
							Zrušiť
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs sm:text-sm"
							disabled={
								(category.subcategories && category.subcategories.length > 0) ||
								false
							}
						>
							Odstrániť
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
