import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import {
	ArrowLeft,
	Calendar,
	Globe,
	MapPin,
	BookOpen,
	Edit,
	Trash2,
	ExternalLink,
	User,
	Loader2,
	AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";

export const Route = createFileRoute("/authors/$authorId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { authorId } = Route.useParams();
	const navigate = useNavigate();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const author = useQuery(api.authors.getById, {
		id: authorId as Id<"authors">,
	});

	const deleteAuthor = useMutation(api.authors.remove);

	const handleDelete = async () => {
		try {
			await deleteAuthor({ id: authorId as Id<"authors"> });
			toast.success("Author deleted successfully");
			navigate({ to: "/authors" });
		} catch (error: any) {
			toast.error("Failed to delete author", {
				description: error.message || "Please try again",
			});
		}
	};

	if (author === undefined) {
		return (
			<div className="flex items-center justify-center min-h-screen p-4">
				<div className="text-center space-y-4 animate-in fade-in duration-300">
					<Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
					<p className="text-muted-foreground">Loading author details...</p>
				</div>
			</div>
		);
	}

	if (author === null) {
		return (
			<div className="flex items-center justify-center min-h-screen p-4">
				<Card className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
					<CardContent className="pt-6">
						<div className="text-center space-y-4">
							<AlertCircle className="h-12 w-12 mx-auto text-destructive" />
							<div>
								<h2 className="text-xl sm:text-2xl font-bold">Author Not Found</h2>
								<p className="text-sm sm:text-base text-muted-foreground mt-2">
									The author you're looking for doesn't exist.
								</p>
							</div>
							<Button 
								onClick={() => navigate({ to: "/authors" })}
								className="w-full sm:w-auto"
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Authors
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const getYearsLabel = () => {
		if (author.birthYear && author.deathYear) {
			return `${author.birthYear} - ${author.deathYear}`;
		}
		if (author.birthYear) {
			return `Born ${author.birthYear}`;
		}
		if (author.deathYear) {
			return `Died ${author.deathYear}`;
		}
		return null;
	};

	return (
		<div className="container max-w-6xl mx-auto py-4 sm:py-8 px-4">
			{/* Header Actions */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
				<Button
					variant="ghost"
					onClick={() => navigate({ to: "/authors" })}
					className="gap-2 w-full sm:w-auto"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Authors
				</Button>

				<div className="flex gap-2 w-full sm:w-auto">
					<Button
						variant="outline"
						onClick={() => navigate({ to: `/authors/${authorId}/edit` })}
						className="gap-2 flex-1 sm:flex-initial"
					>
						<Edit className="h-4 w-4" />
						<span className="hidden xs:inline">Edit</span>
					</Button>
					<Button
						variant="destructive"
						onClick={() => setShowDeleteDialog(true)}
						className="gap-2 flex-1 sm:flex-initial"
					>
						<Trash2 className="h-4 w-4" />
						<span className="hidden xs:inline">Delete</span>
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
				{/* Left Column - Profile */}
				<div className="lg:col-span-1 animate-in fade-in slide-in-from-left-4 duration-500">
					<Card className="lg:sticky lg:top-8">
						<CardContent className="pt-6">
							<div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
								{/* Avatar */}
								<div className="animate-in zoom-in-50 duration-700 delay-100">
									<Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-background shadow-xl ring-2 ring-muted">
										<AvatarImage
											src={author.photoFile?.url}
											alt={author.name}
										/>
										<AvatarFallback className="text-3xl sm:text-4xl bg-linear-to-br from-primary/20 to-primary/10">
											{getInitials(author.name)}
										</AvatarFallback>
									</Avatar>
								</div>

								{/* Name */}
								<div className="space-y-2 w-full">
									<h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">
										{author.name}
									</h1>
									{author.nationality && (
										<Badge variant="secondary" className="gap-1">
											<MapPin className="h-3 w-3" />
											{author.nationality}
										</Badge>
									)}
								</div>

								{/* Stats */}
								<div className="w-full pt-4 border-t">
									<div className="flex items-center justify-center gap-2 text-muted-foreground">
										<BookOpen className="h-5 w-5" />
										<span className="text-2xl font-bold text-foreground">
											{author.bookCount}
										</span>
										<span className="text-sm">
											{author.bookCount === 1 ? "Book" : "Books"}
										</span>
									</div>
								</div>

								{/* Years */}
								{getYearsLabel() && (
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Calendar className="h-4 w-4" />
										{getYearsLabel()}
									</div>
								)}

								{/* Website */}
								{author.website && (
									<Button
										variant="outline"
										className="w-full gap-2 hover:scale-105 transition-transform"
										onClick={() => window.open(author.website, "_blank")}
									>
										<Globe className="h-4 w-4" />
										<span className="truncate">Visit Website</span>
										<ExternalLink className="h-3 w-3 ml-auto flex-shrink-0" />
									</Button>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Details */}
				<div className="lg:col-span-2 space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
					{/* Biography */}
					{author.biography && (
						<Card className="hover:shadow-lg transition-shadow overflow-hidden">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
									<User className="h-4 w-4 sm:h-5 sm:w-5" />
									Biography
								</CardTitle>
							</CardHeader>
							<CardContent className="overflow-hidden">
								<p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere] [word-break:break-word]">
									{author.biography}
								</p>
							</CardContent>
						</Card>
					)}

					{/* Details Card */}
					<Card className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle className="text-lg sm:text-xl">Details</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{author.birthYear && (
								<div className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded-md transition-colors">
									<span className="text-sm font-medium">Birth Year</span>
									<span className="text-sm text-muted-foreground">
										{author.birthYear}
									</span>
								</div>
							)}

							{author.deathYear && (
								<div className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded-md transition-colors">
									<span className="text-sm font-medium">Death Year</span>
									<span className="text-sm text-muted-foreground">
										{author.deathYear}
									</span>
								</div>
							)}

							{author.nationality && (
								<>
									<Separator />
									<div className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded-md transition-colors">
										<span className="text-sm font-medium">Nationality</span>
										<span className="text-sm text-muted-foreground">
											{author.nationality}
										</span>
									</div>
								</>
							)}

							<Separator />

							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 py-2 hover:bg-muted/50 px-2 rounded-md transition-colors">
								<span className="text-sm font-medium">Added</span>
								<span className="text-xs sm:text-sm text-muted-foreground">
									{new Date(author.createdAt).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
							</div>

							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 py-2 hover:bg-muted/50 px-2 rounded-md transition-colors">
								<span className="text-sm font-medium">Last Updated</span>
								<span className="text-xs sm:text-sm text-muted-foreground">
									{new Date(author.updatedAt).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
							</div>
						</CardContent>
					</Card>

					{/* Books Section - Placeholder */}
					<Card className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
								<BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
								<span className="truncate">Books by {author.name}</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{author.bookCount === 0 ? (
								<div className="text-center py-8 sm:py-12 text-muted-foreground">
									<BookOpen className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-20" />
									<p className="text-sm sm:text-base">No books found for this author</p>
									<Button variant="link" className="mt-2">
										Add a book
									</Button>
								</div>
							) : (
								<div className="text-center py-6 sm:py-8 text-muted-foreground">
									<p className="text-sm sm:text-base">Book list will be displayed here</p>
									<p className="text-xs sm:text-sm mt-2">
										({author.bookCount}{" "}
										{author.bookCount === 1 ? "book" : "books"})
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-lg sm:text-xl">Delete Author?</AlertDialogTitle>
						<AlertDialogDescription className="text-sm sm:text-base">
							Are you sure you want to delete <strong>{author.name}</strong>?
							This action cannot be undone.
							{author.bookCount > 0 && (
								<span className="block mt-2 text-destructive font-medium text-sm">
									Warning: This author has {author.bookCount}{" "}
									{author.bookCount === 1 ? "book" : "books"}. You must delete
									or reassign them first.
								</span>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="flex-col sm:flex-row gap-2">
						<AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
							disabled={author.bookCount > 0}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}