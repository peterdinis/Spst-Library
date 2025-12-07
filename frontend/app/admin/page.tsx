"use client";

import { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, BookOpen, Users, Grid } from "lucide-react";
import { Book, Author, Category } from "@/lib/types";
import {
	mockBooksCrudApi,
	mockAuthorsCrudApi,
	mockCategoriesCrudApi,
} from "@/lib/crudApi";
import BookForm from "@/components/admin/BookForm";
import AuthorForm from "@/components/admin/AuthorForm";
import CategoryForm from "@/components/admin/CategoryForm";
import {
	BookFormData,
	AuthorFormData,
	CategoryFormData,
} from "@/lib/validations";
import { motion } from "framer-motion";

const AdminPage: FC = () => {
	const router = useRouter();
	const { user, isAdmin } = useAuth();
	const [books, setBooks] = useState<Book[]>([]);
	const [authors, setAuthors] = useState<Author[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);

	// Form states
	const [showBookForm, setShowBookForm] = useState(false);
	const [showAuthorForm, setShowAuthorForm] = useState(false);
	const [showCategoryForm, setShowCategoryForm] = useState(false);
	const [editingBook, setEditingBook] = useState<Book | null>(null);
	const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);

	useEffect(() => {
		if (!isAdmin) {
			router.push("/");
			return;
		}
		loadData();
	}, [isAdmin]);

	const loadData = async () => {
		setLoading(true);
		try {
			const [booksData, authorsData, categoriesData] = await Promise.all([
				mockBooksCrudApi.getAll(),
				mockAuthorsCrudApi.getAll(),
				mockCategoriesCrudApi.getAll(),
			]);
			setBooks(booksData);
			setAuthors(authorsData);
			setCategories(categoriesData);
		} catch (error) {
			console.error("Error loading data:", error);
		} finally {
			setLoading(false);
		}
	};

	// Book handlers
	const handleCreateBook = async (data: BookFormData) => {
		try {
			await mockBooksCrudApi.create(data);
			await loadData();
			setShowBookForm(false);
		} catch (error: any) {
			alert(error.message);
		}
	};

	const handleUpdateBook = async (data: BookFormData) => {
		if (!editingBook) return;
		try {
			await mockBooksCrudApi.update({ ...data, id: editingBook.id });
			await loadData();
			setEditingBook(null);
		} catch (error: any) {
			alert(error.message);
		}
	};

	const handleDeleteBook = async (id: string) => {
		if (!confirm("Naozaj chcete vymazať túto knihu?")) return;
		try {
			await mockBooksCrudApi.delete(id);
			await loadData();
		} catch (error: any) {
			alert(error.message);
		}
	};

	// Author handlers
	const handleCreateAuthor = async (data: AuthorFormData) => {
		try {
			await mockAuthorsCrudApi.create(data);
			await loadData();
			setShowAuthorForm(false);
		} catch (error: any) {
			alert(error.message);
		}
	};

	const handleUpdateAuthor = async (data: AuthorFormData) => {
		if (!editingAuthor) return;
		try {
			await mockAuthorsCrudApi.update({ ...data, id: editingAuthor.id });
			await loadData();
			setEditingAuthor(null);
		} catch (error: any) {
			alert(error.message);
		}
	};

	const handleDeleteAuthor = async (id: string) => {
		if (!confirm("Naozaj chcete vymazať tohto autora?")) return;
		try {
			await mockAuthorsCrudApi.delete(id);
			await loadData();
		} catch (error: any) {
			alert(error.message);
		}
	};

	// Category handlers
	const handleCreateCategory = async (data: CategoryFormData) => {
		try {
			await mockCategoriesCrudApi.create(data);
			await loadData();
			setShowCategoryForm(false);
		} catch (error: any) {
			alert(error.message);
		}
	};

	const handleUpdateCategory = async (data: CategoryFormData) => {
		if (!editingCategory) return;
		try {
			await mockCategoriesCrudApi.update({ ...data, id: editingCategory.id });
			await loadData();
			setEditingCategory(null);
		} catch (error: any) {
			alert(error.message);
		}
	};

	const handleDeleteCategory = async (id: string) => {
		if (!confirm("Naozaj chcete vymazať túto kategóriu?")) return;
		try {
			await mockCategoriesCrudApi.delete(id);
			await loadData();
		} catch (error: any) {
			alert(error.message);
		}
	};

	if (!isAdmin) {
		return null;
	}

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-96">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-8"
			>
				<h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
				<p className="text-muted-foreground">
					Spravujte knihy, autorov a kategórie
				</p>
			</motion.div>

			<Tabs defaultValue="books" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="books">
						<BookOpen className="h-4 w-4 mr-2" />
						Knihy ({books.length})
					</TabsTrigger>
					<TabsTrigger value="authors">
						<Users className="h-4 w-4 mr-2" />
						Autori ({authors.length})
					</TabsTrigger>
					<TabsTrigger value="categories">
						<Grid className="h-4 w-4 mr-2" />
						Kategórie ({categories.length})
					</TabsTrigger>
				</TabsList>

				{/* Books Tab */}
				<TabsContent value="books" className="space-y-4">
					{!showBookForm && !editingBook && (
						<Button onClick={() => setShowBookForm(true)}>
							<Plus className="h-4 w-4 mr-2" />
							Pridať knihu
						</Button>
					)}

					{(showBookForm || editingBook) && (
						<BookForm
							initialData={editingBook || undefined}
							onSubmit={editingBook ? handleUpdateBook : handleCreateBook}
							onCancel={() => {
								setShowBookForm(false);
								setEditingBook(null);
							}}
						/>
					)}

					{!showBookForm && !editingBook && (
						<div className="grid gap-4">
							{books.map((book) => (
								<Card key={book.id}>
									<CardContent className="p-4">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<h3 className="font-semibold text-lg">{book.title}</h3>
												<p className="text-sm text-muted-foreground">
													{book.authorName} • {book.categoryName}
												</p>
												<p className="text-sm text-muted-foreground mt-1">
													ISBN: {book.isbn} • Rok: {book.publishedYear}
												</p>
												<p className="text-sm mt-2">
													Dostupné: {book.availableCopies}/{book.totalCopies}
												</p>
											</div>
											<div className="flex gap-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() => setEditingBook(book)}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													size="sm"
													variant="destructive"
													onClick={() => handleDeleteBook(book.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>

				{/* Authors Tab */}
				<TabsContent value="authors" className="space-y-4">
					{!showAuthorForm && !editingAuthor && (
						<Button onClick={() => setShowAuthorForm(true)}>
							<Plus className="h-4 w-4 mr-2" />
							Pridať autora
						</Button>
					)}

					{(showAuthorForm || editingAuthor) && (
						<AuthorForm
							initialData={editingAuthor || undefined}
							onSubmit={editingAuthor ? handleUpdateAuthor : handleCreateAuthor}
							onCancel={() => {
								setShowAuthorForm(false);
								setEditingAuthor(null);
							}}
						/>
					)}

					{!showAuthorForm && !editingAuthor && (
						<div className="grid gap-4">
							{authors.map((author) => (
								<Card key={author.id}>
									<CardContent className="p-4">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<h3 className="font-semibold text-lg">{author.name}</h3>
												{author.nationality && (
													<p className="text-sm text-muted-foreground">
														{author.nationality}
													</p>
												)}
												<p className="text-sm mt-2 line-clamp-2">
													{author.biography}
												</p>
											</div>
											<div className="flex gap-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() => setEditingAuthor(author)}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													size="sm"
													variant="destructive"
													onClick={() => handleDeleteAuthor(author.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>

				{/* Categories Tab */}
				<TabsContent value="categories" className="space-y-4">
					{!showCategoryForm && !editingCategory && (
						<Button onClick={() => setShowCategoryForm(true)}>
							<Plus className="h-4 w-4 mr-2" />
							Pridať kategóriu
						</Button>
					)}

					{(showCategoryForm || editingCategory) && (
						<CategoryForm
							initialData={editingCategory || undefined}
							onSubmit={
								editingCategory ? handleUpdateCategory : handleCreateCategory
							}
							onCancel={() => {
								setShowCategoryForm(false);
								setEditingCategory(null);
							}}
						/>
					)}

					{!showCategoryForm && !editingCategory && (
						<div className="grid gap-4">
							{categories.map((category) => (
								<Card key={category.id}>
									<CardContent className="p-4">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<h3 className="font-semibold text-lg">
													{category.name}
												</h3>
												<p className="text-sm mt-2">{category.description}</p>
											</div>
											<div className="flex gap-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() => setEditingCategory(category)}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													size="sm"
													variant="destructive"
													onClick={() => handleDeleteCategory(category.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default AdminPage;
