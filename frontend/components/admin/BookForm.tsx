"use client";

import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookFormData, bookSchema } from "@/lib/validations";
import { mockAuthorsCrudApi, mockCategoriesCrudApi } from "@/lib/crudApi";
import { Author, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface BookFormProps {
	initialData?: Partial<BookFormData> & { id?: string };
	onSubmit: (data: BookFormData) => Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
}

const BookForm: FC<BookFormProps> = ({
	initialData,
	onSubmit,
	onCancel,
	isLoading = false,
}) => {
	const [authors, setAuthors] = useState<Author[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loadingData, setLoadingData] = useState(true);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<BookFormData>({
		resolver: zodResolver(bookSchema),
		defaultValues: initialData || {
			title: "",
			authorId: "",
			categoryId: "",
			isbn: "",
			description: "",
			publishedYear: new Date().getFullYear(),
			totalCopies: 1,
			availableCopies: 1,
			coverUrl: "",
		},
	});

	useEffect(() => {
		loadFormData();
	}, []);

	const loadFormData = async () => {
		try {
			const [authorsData, categoriesData] = await Promise.all([
				mockAuthorsCrudApi.getAll(),
				mockCategoriesCrudApi.getAll(),
			]);
			setAuthors(authorsData);
			setCategories(categoriesData);
		} catch (error) {
			console.error("Error loading form data:", error);
		} finally {
			setLoadingData(false);
		}
	};

	const handleFormSubmit = async (data: BookFormData) => {
		await onSubmit(data);
	};

	if (loadingData) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center p-12">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{initialData?.id ? "Upraviť knihu" : "Pridať novú knihu"}
				</CardTitle>
				<CardDescription>
					{initialData?.id
						? "Upravte informácie o knihe"
						: "Vyplňte informácie o novej knihe"}
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<CardContent className="space-y-4">
					{/* Title */}
					<div className="space-y-2">
						<Label htmlFor="title">Názov knihy *</Label>
						<Input
							id="title"
							{...register("title")}
							placeholder="Napríklad: Majster a Margaréta"
						/>
						{errors.title && (
							<p className="text-sm text-red-600">{errors.title.message}</p>
						)}
					</div>

					{/* Author */}
					<div className="space-y-2">
						<Label htmlFor="authorId">Autor *</Label>
						<select
							id="authorId"
							{...register("authorId")}
							className="w-full p-2 border rounded-md bg-background"
						>
							<option value="">Vyberte autora</option>
							{authors.map((author) => (
								<option key={author.id} value={author.id}>
									{author.name}
								</option>
							))}
						</select>
						{errors.authorId && (
							<p className="text-sm text-red-600">{errors.authorId.message}</p>
						)}
					</div>

					{/* Category */}
					<div className="space-y-2">
						<Label htmlFor="categoryId">Kategória *</Label>
						<select
							id="categoryId"
							{...register("categoryId")}
							className="w-full p-2 border rounded-md bg-background"
						>
							<option value="">Vyberte kategóriu</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
						{errors.categoryId && (
							<p className="text-sm text-red-600">
								{errors.categoryId.message}
							</p>
						)}
					</div>

					{/* ISBN */}
					<div className="space-y-2">
						<Label htmlFor="isbn">ISBN *</Label>
						<Input
							id="isbn"
							{...register("isbn")}
							placeholder="978-80-556-2345-6"
						/>
						{errors.isbn && (
							<p className="text-sm text-red-600">{errors.isbn.message}</p>
						)}
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label htmlFor="description">Popis *</Label>
						<textarea
							id="description"
							{...register("description")}
							placeholder="Stručný popis knihy..."
							className="w-full p-2 border rounded-md bg-background min-h-[100px]"
						/>
						{errors.description && (
							<p className="text-sm text-red-600">
								{errors.description.message}
							</p>
						)}
					</div>

					{/* Published Year */}
					<div className="space-y-2">
						<Label htmlFor="publishedYear">Rok vydania *</Label>
						<Input
							id="publishedYear"
							type="number"
							{...register("publishedYear", { valueAsNumber: true })}
							placeholder="2024"
						/>
						{errors.publishedYear && (
							<p className="text-sm text-red-600">
								{errors.publishedYear.message}
							</p>
						)}
					</div>

					{/* Total Copies */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="totalCopies">Celkový počet kópií *</Label>
							<Input
								id="totalCopies"
								type="number"
								{...register("totalCopies", { valueAsNumber: true })}
								placeholder="1"
							/>
							{errors.totalCopies && (
								<p className="text-sm text-red-600">
									{errors.totalCopies.message}
								</p>
							)}
						</div>

						{/* Available Copies */}
						<div className="space-y-2">
							<Label htmlFor="availableCopies">Dostupné kópie *</Label>
							<Input
								id="availableCopies"
								type="number"
								{...register("availableCopies", { valueAsNumber: true })}
								placeholder="1"
							/>
							{errors.availableCopies && (
								<p className="text-sm text-red-600">
									{errors.availableCopies.message}
								</p>
							)}
						</div>
					</div>

					{/* Cover URL */}
					<div className="space-y-2">
						<Label htmlFor="coverUrl">URL obrázka obálky (voliteľné)</Label>
						<Input
							id="coverUrl"
							{...register("coverUrl")}
							placeholder="https://example.com/cover.jpg"
						/>
						{errors.coverUrl && (
							<p className="text-sm text-red-600">{errors.coverUrl.message}</p>
						)}
					</div>
				</CardContent>

				<CardFooter className="flex gap-2">
					<Button
						type="submit"
						disabled={isSubmitting || isLoading}
						className="flex-1"
					>
						{(isSubmitting || isLoading) && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						{initialData?.id ? "Uložiť zmeny" : "Pridať knihu"}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						disabled={isSubmitting || isLoading}
					>
						Zrušiť
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
};

export default BookForm;
