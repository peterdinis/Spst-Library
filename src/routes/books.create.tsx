import {
	useState,
	useCallback,
	SetStateAction,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateBookSchema, CreateBookInput } from "types/bookTypes";
import z from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Loader2, X, BookOpen, Crop } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";
import { authGuard } from "@/lib/auth-guard";

interface CropArea {
	x: number;
	y: number;
	width: number;
	height: number;
}

// Helper function to create cropped image
const createImage = (url: string): Promise<HTMLImageElement> => {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.src = url;
	});
};

async function getCroppedImg(
	imageSrc: string,
	pixelCrop: CropArea,
): Promise<Blob> {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("No 2d context");
	}

	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	ctx.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height,
	);

	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				reject(new Error("Canvas is empty"));
				return;
			}
			resolve(blob);
		}, "image/jpeg");
	});
}

function CreateBookPage() {
	const navigate = useNavigate();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

	const {
		register,
		handleSubmit,
		formState: { errors: formErrors },
		setValue,
		control,
		watch,
	} = useForm<CreateBookInput>({
		resolver: zodResolver(CreateBookSchema) as any,
		defaultValues: {
			title: "",
			isbn: "",
			description: "",
			publisher: "",
			language: "",
			totalCopies: 1,
			location: "",
			tags: [],
			status: "available",
		},
	});

	const formValues = watch();

	// Image upload state
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	// Cropper state
	const [showCropper, setShowCropper] = useState(false);
	const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
		null,
	);

	// Convex queries
	const authorsResult = useQuery(api.authors.list, {
		paginationOpts: { numItems: 1000 },
	});
	const categoriesResult = useQuery(api.categories.getCategories, {
		paginationOpts: { numItems: 1000, cursor: null },
		isActive: true,
	});

	// Convex mutations
	const createBook = useMutation(api.books.create);
	const createFileRecord = useMutation(api.files.createFileRecord);

	// UploadThing hook
	const { startUpload, isUploading } = useUploadThing("bookCover", {
		onClientUploadComplete: () => {
			toast.success("Upload sa podaril", {});
		},
		onUploadError: () => {
			toast.error("Upload zlyhal", {
				description: "Nepodarilo sa nahrať obrázok. Skúste to znova.",
			});
		},
	});

	// Get authors and categories from paginated results
	const authors = authorsResult?.page || [];
	const categories = categoriesResult?.page || [];

	// Handle image selection
	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast.error("Neplatný typ súboru", {
				description: "Vyberte obrázok (JPEG, PNG, atď.)",
			});
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Súbor je príliš veľký", {
				description: "Vyberte obrázok menší ako 5MB",
			});
			return;
		}

		// Create preview and open cropper
		const reader = new FileReader();
		reader.onloadend = () => {
			setTempImageSrc(reader.result as string);
			setShowCropper(true);
			setCrop({ x: 0, y: 0 });
			setZoom(1);
		};
		reader.readAsDataURL(file);
	};

	// On crop complete callback
	const onCropComplete = useCallback((_: any, croppedAreaPixels: CropArea) => {
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);

	// Handle crop confirm
	const handleCropConfirm = async () => {
		if (!tempImageSrc || !croppedAreaPixels) return;

		try {
			const croppedBlob = await getCroppedImg(tempImageSrc, croppedAreaPixels);

			// Convert blob to file
			const croppedFile = new File([croppedBlob], "book-cover.jpg", {
				type: "image/jpeg",
			});

			setImageFile(croppedFile);

			// Create preview URL
			const previewUrl = URL.createObjectURL(croppedBlob);
			setImagePreview(previewUrl);

			setShowCropper(false);
			setTempImageSrc(null);
		} catch (error) {
			toast.error("Nepodarilo sa orezáť obrázok", {
				description: "Skúste to znova",
			});
		}
	};

	// Handle crop cancel
	const handleCropCancel = () => {
		setShowCropper(false);
		setTempImageSrc(null);
		setCrop({ x: 0, y: 0 });
		setZoom(1);
	};

	// Remove selected image
	const handleRemoveImage = () => {
		setImageFile(null);
		if (imagePreview) {
			URL.revokeObjectURL(imagePreview);
		}
		setImagePreview(null);
	};

	// Handle form submission
	const onSubmit = async (data: CreateBookInput) => {
		setIsSubmitting(true);
		setUploadProgress(0);
		let toastId: string | number | undefined;

		try {
			toastId = toast.loading("Vytváranie knihy...");

			let coverFileId: Id<"files"> | undefined;

			if (imageFile) {
				setUploadProgress(30);
				toast.loading("Nahrávanie obrázka...", { id: toastId });

				try {
					const uploadResult = await startUpload([imageFile]);
					setUploadProgress(50);

					if (uploadResult && uploadResult[0]) {
						const uploadedFile = uploadResult[0];
						const serverData = uploadedFile.serverData;

						// Create file record in Convex
						if (serverData) {
							toast.loading("Ukladanie metadát súboru...", { id: toastId });

							const fileRecordId = await createFileRecord({
								storageId: serverData.fileKey,
								url: serverData.fileUrl,
								name: serverData.fileName,
								type: serverData.fileType,
								size: serverData.fileSize,
								uploadedBy: serverData.uploadedBy,
								entityType: "book_cover",
							});

							setUploadProgress(70);

							// Store the file ID
							coverFileId = fileRecordId;
						}
					}
				} catch (uploadError) {
					toast.warning("Nahrávanie obrázka zlyhalo", {
						id: toastId,
						description:
							"Kniha bude vytvorená bez obrázka. Môžete ho pridať neskôr.",
					});
				}
			}

			setUploadProgress(90);
			toast.loading("Ukladanie informácií o knihe...", { id: toastId });

			const bookId = await createBook({
				...data,
				coverFileId,
			});

			setUploadProgress(100);

			toast.success("Kniha bola úspešne vytvorená", {
				id: toastId,
				description: `${data.title} bola pridaná do knižnice.`,
				action: {
					label: "Zobraziť",
					onClick: () => navigate({ to: `/books/${bookId}` }),
				},
			});

			setTimeout(() => {
				navigate({ to: "/books" });
			}, 2000);
		} catch (error: any) {
			toast.error("Chyba pri vytváraní knihy", {
				id: toastId,
				description: error.message || "Skúste to znova",
			});
		} finally {
			setIsSubmitting(false);
			setUploadProgress(0);
		}
	};

	return (
		<div className="container max-w-4xl mx-auto py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Pridať novú knihu</h1>
				<p className="text-muted-foreground mt-2">
					Pridajte novú knihu do vašej knižnice
				</p>
			</div>

			{/* Cropper Dialog */}
			<Dialog open={showCropper} onOpenChange={setShowCropper}>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<DialogTitle>Orezať obálku knihy</DialogTitle>
						<DialogDescription>
							Upravte obrázok podľa vašich preferencií
						</DialogDescription>
					</DialogHeader>

					<div className="relative h-96 bg-muted rounded-lg">
						{tempImageSrc && (
							<Cropper
								image={tempImageSrc}
								crop={crop}
								zoom={zoom}
								aspect={2 / 3}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={onCropComplete}
							/>
						)}
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label>Zoom</Label>
							<Slider
								value={[zoom]}
								onValueChange={(value: SetStateAction<number>[]) =>
									setZoom(value[0])
								}
								min={1}
								max={3}
								step={0.1}
								className="w-full"
							/>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={handleCropCancel}>
							Zrušiť
						</Button>
						<Button onClick={handleCropConfirm}>
							<Crop className="mr-2 h-4 w-4" />
							Použiť orezanie
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BookOpen className="h-5 w-5" />
						Informácie o knihe
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Book Cover Upload */}
						<div className="space-y-4">
							<Label htmlFor="cover">Obálka knihy (voliteľné)</Label>
							<div className="flex items-start gap-6">
								{imagePreview ? (
									<div className="relative">
										<div className="w-32 h-48 rounded-lg overflow-hidden border">
											<img
												src={imagePreview}
												alt="Preview"
												className="w-full h-full object-cover"
											/>
										</div>
										<Button
											type="button"
											variant="destructive"
											size="icon"
											className="absolute -top-2 -right-2 h-6 w-6"
											onClick={handleRemoveImage}
											disabled={isSubmitting || isUploading}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								) : (
									<div className="w-32 h-48 rounded-lg border-2 border-dashed flex items-center justify-center">
										<BookOpen className="h-8 w-8 text-muted-foreground" />
									</div>
								)}

								<div className="flex-1 space-y-2">
									<Input
										id="cover"
										type="file"
										accept="image/*"
										onChange={handleImageSelect}
										className="cursor-pointer"
										disabled={isSubmitting || isUploading}
									/>
									<p className="text-sm text-muted-foreground">
										Odporúčané: Pomer strán 2:3, max 5MB. JPEG, PNG alebo WebP.
									</p>
									{isUploading && (
										<p className="text-sm text-blue-600">
											Nahrávanie obrázka...
										</p>
									)}
								</div>
							</div>
						</div>

						{/* Title Field */}
						<div className="space-y-2">
							<Label htmlFor="title">
								Názov <span className="text-destructive">*</span>
							</Label>
							<Input
								id="title"
								{...register("title")}
								placeholder="e.g., Harry Potter a Kameň mudrcov"
								disabled={isSubmitting || isUploading}
							/>
							{formErrors.title && (
								<p className="text-sm text-destructive">{formErrors.title.message}</p>
							)}
						</div>

						{/* Author and Category Fields */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="authorId">
									Autor <span className="text-destructive">*</span>
								</Label>
								<Select
									value={formValues.authorId}
									onValueChange={(value) => {
										setValue("authorId", value as Id<"authors">, { shouldValidate: true });
									}}
									disabled={isSubmitting || isUploading}
								>
									<SelectTrigger id="authorId">
										<SelectValue placeholder="Vyberte autora" />
									</SelectTrigger>
									<SelectContent>
										{authors.map((author) => (
											<SelectItem key={author._id} value={author._id}>
												{author.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{formErrors.authorId && (
									<p className="text-sm text-destructive">{formErrors.authorId.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="categoryId">
									Kategória <span className="text-destructive">*</span>
								</Label>
								<Select
									value={formValues.categoryId}
									onValueChange={(value) => {
										setValue("categoryId", value as Id<"categories">, { shouldValidate: true });
									}}
									disabled={isSubmitting || isUploading}
								>
									<SelectTrigger id="categoryId">
										<SelectValue placeholder="Vyberte kategóriu" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem key={category._id} value={category._id}>
												{category.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{formErrors.categoryId && (
									<p className="text-sm text-destructive">
										{formErrors.categoryId.message}
									</p>
								)}
							</div>
						</div>

						{/* ISBN and Published Year */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="isbn">ISBN</Label>
								<Input
									id="isbn"
									{...register("isbn")}
									placeholder="e.g., 978-80-123-4567-8"
									disabled={isSubmitting || isUploading}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="publishedYear">Rok vydania</Label>
								<Input
									id="publishedYear"
									type="number"
									{...register("publishedYear", { valueAsNumber: true })}
									placeholder="e.g., 1997"
									disabled={isSubmitting || isUploading}
								/>
								{formErrors.publishedYear && (
									<p className="text-sm text-destructive">
										{formErrors.publishedYear.message}
									</p>
								)}
							</div>
						</div>

						{/* Publisher and Language */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="publisher">Vydavateľ</Label>
								<Input
									id="publisher"
									{...register("publisher")}
									placeholder="e.g., Albatros"
									disabled={isSubmitting || isUploading}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="language">Jazyk</Label>
								<Input
									id="language"
									{...register("language")}
									placeholder="e.g., Slovenčina"
									disabled={isSubmitting || isUploading}
								/>
							</div>
						</div>

						{/* Pages and Total Copies */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="pages">Počet strán</Label>
								<Input
									id="pages"
									type="number"
									{...register("pages", { valueAsNumber: true })}
									placeholder="e.g., 320"
									disabled={isSubmitting || isUploading}
								/>
								{formErrors.pages && (
									<p className="text-sm text-destructive">{formErrors.pages.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="totalCopies">
									Počet kópií <span className="text-destructive">*</span>
								</Label>
								<Input
									id="totalCopies"
									type="number"
									{...register("totalCopies", { valueAsNumber: true })}
									placeholder="e.g., 5"
									disabled={isSubmitting || isUploading}
								/>
								{formErrors.totalCopies && (
									<p className="text-sm text-destructive">
										{formErrors.totalCopies.message}
									</p>
								)}
							</div>
						</div>

						{/* Location and Status */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="location">Lokácia</Label>
								<Input
									id="location"
									{...register("location")}
									placeholder="e.g., Regál A, Polička 3"
									disabled={isSubmitting || isUploading}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="status">Stav</Label>
								<Select
									value={formValues.status}
									onValueChange={(value) => setValue("status", value as any, { shouldValidate: true })}
									disabled={isSubmitting || isUploading}
								>
									<SelectTrigger id="status">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="available">Dostupné</SelectItem>
										<SelectItem value="reserved">Rezervované</SelectItem>
										<SelectItem value="maintenance">V údržbe</SelectItem>
										<SelectItem value="lost">Stratené</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Description Field */}
						<div className="space-y-2">
							<Label htmlFor="description">Popis</Label>
							<Textarea
								id="description"
								{...register("description")}
								placeholder="Napíšte krátky popis knihy..."
								rows={4}
								disabled={isSubmitting || isUploading}
							/>
							<div className="flex justify-between items-center">
								<p className="text-sm text-muted-foreground">
									{(formValues.description?.length || 0)}/5000 znakov
								</p>
							</div>
						</div>

						{/* Tags Field */}
						<div className="space-y-2">
							<Label htmlFor="tags">Tagy</Label>
							<Input
								id="tags"
								placeholder="e.g., fantasy, dobrodružstvo, mládež (oddelené čiarkou)"
								disabled={isSubmitting || isUploading}
								onChange={(e) => {
									const tags = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
									setValue("tags", tags);
								}}
							/>
							<p className="text-sm text-muted-foreground">
								Oddelite tagy čiarkami
							</p>
						</div>

						{/* Progress Bar */}
						{(isSubmitting || isUploading || uploadProgress > 0) && (
							<div className="space-y-2">
								<div className="h-2 w-full bg-muted rounded-full overflow-hidden">
									<div
										className="h-full bg-primary transition-all duration-300"
										style={{ width: `${uploadProgress}%` }}
									/>
								</div>
								<p className="text-sm text-muted-foreground text-center">
									{uploadProgress < 100
										? "Vytváranie knihy..."
										: "Kniha bola úspešne vytvorená!"}
								</p>
							</div>
						)}

						{/* Form Actions */}
						<div className="flex justify-end gap-4 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate({ to: "/books" })}
								disabled={isSubmitting || isUploading}
							>
								Zrušiť
							</Button>
							<Button type="submit" disabled={isSubmitting || isUploading}>
								{isSubmitting || isUploading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										{isUploading ? "Nahrávanie..." : "Vytváranie..."}
									</>
								) : (
									<>
										<BookOpen className="mr-2 h-4 w-4" />
										Vytvoriť knihu
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

export const Route = createFileRoute("/books/create")({
	beforeLoad: authGuard,
	component: RouteComponent,
});

function RouteComponent() {
	return <CreateBookPage />;
}
