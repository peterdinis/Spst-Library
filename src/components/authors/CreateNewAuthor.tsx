import { useState, useCallback, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authorSchema } from "types/authorTypes";
import z from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Loader2, X, UserPlus, Crop } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { api } from "convex/_generated/api";

interface CropArea {
	x: number;
	y: number;
	width: number;
	height: number;
}

// Helper function to create cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.src = url;
	});

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

export default function NewAuthorPage() {
	const navigate = useNavigate();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

	// Form schema for the UI (handling string inputs for years)
	const authorFormSchema = authorSchema
		.extend({
			birthYear: z.coerce
				.number()
				.int()
				.min(1000)
				.max(new Date().getFullYear())
				.optional()
				.or(z.literal(0).transform(() => undefined)),
			deathYear: z.coerce
				.number()
				.int()
				.min(1000)
				.max(new Date().getFullYear() + 10)
				.optional()
				.or(z.literal(0).transform(() => undefined)),
		})
		.refine(
			(data) => {
				if (data.birthYear && data.deathYear) {
					return data.deathYear >= data.birthYear;
				}
				return true;
			},
			{
				message: "Rok úmrtia musí byť po roku narodenia",
				path: ["deathYear"],
			},
		);

	type AuthorFormData = z.infer<typeof authorFormSchema>;

	const {
		register,
		handleSubmit,
		formState: { errors: formErrors },
		watch,
	} = useForm<AuthorFormData>({
		resolver: zodResolver(authorFormSchema) as any,
		defaultValues: {
			name: "",
			biography: "",
			nationality: "",
			website: "",
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

	// Convex mutations
	const createAuthor = useMutation(api.authors.create);
	const createFileRecord = useMutation(api.files.createFileRecord);

	// UploadThing hook
	const { startUpload, isUploading } = useUploadThing("authorImage", {
		onUploadError: () => {
			toast.error("Upload failed", {
				description: "Failed to upload image. Please try again.",
			});
		},
	});

	// Handle image selection
	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast.error("Neplatný formát súboru", {
				description: "Prosím vyberte obrázok (JPEG, PNG, atď.)",
			});
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Súbor je príliš veľký", {
				description: "Maximálna veľkosť je 5MB",
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
			const croppedFile = new File([croppedBlob], "author-photo.jpg", {
				type: "image/jpeg",
			});

			setImageFile(croppedFile);

			// Create preview URL
			const previewUrl = URL.createObjectURL(croppedBlob);
			setImagePreview(previewUrl);

			setShowCropper(false);
			setTempImageSrc(null);
		} catch (error) {
			toast.error("Failed to crop image", {
				description: "Please try again" + error,
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
	const onSubmit = async (data: AuthorFormData) => {
		setIsSubmitting(true);
		setUploadProgress(0);
		let toastId: string | number | undefined;

		try {
			toastId = toast.loading("Vytváram autora...");

			let photoFileId: string | undefined;

			if (imageFile) {
				setUploadProgress(30);
				toast.loading("Nahrávam obrázok...", { id: toastId });

				try {
					const uploadResult = await startUpload([imageFile]);
					setUploadProgress(50);

					if (uploadResult && uploadResult[0]) {
						const uploadedFile = uploadResult[0];
						const serverData = uploadedFile.serverData;

						// Create file record in Convex
						if (serverData) {
							toast.loading("Ukladám metadáta súboru...", { id: toastId });
							photoFileId = await createFileRecord({
								storageId: serverData.fileKey,
								url: serverData.fileUrl,
								name: serverData.fileName,
								type: serverData.fileType,
								size: serverData.fileSize,
								uploadedBy: serverData.uploadedBy,
								entityType: "author_photo",
							});
							setUploadProgress(70);
						}
					}
				} catch (uploadError) {
					toast.warning("Nahrávanie obrázka zlyhalo", {
						id: toastId,
						description:
							"Autor bude vytvorený bez fotky. Fotku môžete pridať neskôr.",
					});
				}
			}

			setUploadProgress(90);
			toast.loading("Ukladám informácie o autorovi...", { id: toastId });

			const website = data.website?.trim() === "" ? undefined : data.website;

			const authorId = await createAuthor({
				name: data.name,
				biography: data.biography || undefined,
				birthYear: data.birthYear,
				deathYear: data.deathYear,
				nationality: data.nationality || undefined,
				photoFileId: photoFileId as any,
				website,
			});

			setUploadProgress(100);

			toast.success("Autor úspešne vytvorený", {
				id: toastId,
				description: `${data.name} bol pridaný do knižnice.`,
				action: {
					label: "Zobraziť",
					onClick: () => navigate({ to: `/authors/${authorId}` }),
				},
			});

			setTimeout(() => {
				navigate({ to: "/authors" });
			}, 2000);
		} catch (error: any) {
			toast.error("Chyba pri vytváraní autora", {
				id: toastId,
				description: error.message || "Skúste to prosím znova",
			});
		} finally {
			setIsSubmitting(false);
			setUploadProgress(0);
		}
	};

	return (
		<div className="container max-w-4xl mx-auto py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">
					Pridať nového autora
				</h1>
				<p className="text-muted-foreground mt-2">
					Pridajte nového autora do databázy knižnice
				</p>
			</div>

			{/* Cropper Dialog */}
			<Dialog open={showCropper} onOpenChange={setShowCropper}>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<DialogTitle>Orezanie fotky autora</DialogTitle>
						<DialogDescription>
							Upravte výrez fotky podľa potreby
						</DialogDescription>
					</DialogHeader>

					<div className="relative h-96 bg-muted rounded-lg">
						{tempImageSrc && (
							<Cropper
								image={tempImageSrc}
								crop={crop}
								zoom={zoom}
								aspect={1}
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
							Použiť výrez
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<UserPlus className="h-5 w-5" />
						Informácie o autorovi
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Author Photo Upload */}
						<div className="space-y-4">
							<Label htmlFor="photo">Fotka autora (voliteľné)</Label>
							<div className="flex items-start gap-6">
								{imagePreview ? (
									<div className="relative">
										<div className="w-32 h-32 rounded-lg overflow-hidden border">
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
									<div className="w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center">
										<UserPlus className="h-8 w-8 text-muted-foreground" />
									</div>
								)}

								<div className="flex-1 space-y-2">
									<Input
										id="photo"
										type="file"
										accept="image/*"
										onChange={handleImageSelect}
										className="cursor-pointer"
										disabled={isSubmitting || isUploading}
									/>
									<p className="text-sm text-muted-foreground">
										Odporúčané: Štvorcový obrázok, max 5MB. JPEG, PNG alebo
										WebP.
									</p>
									{isUploading && (
										<p className="text-sm text-blue-600">Nahrávam obrázok...</p>
									)}
								</div>
							</div>
						</div>

						{/* Name Field */}
						<div className="space-y-2">
							<Label htmlFor="name">
								Celé meno <span className="text-destructive">*</span>
							</Label>
							<Input
								id="name"
								{...register("name")}
								placeholder="napr., J.K. Rowling"
								disabled={isSubmitting || isUploading}
							/>
							{formErrors.name && (
								<p className="text-sm text-destructive">
									{formErrors.name.message}
								</p>
							)}
						</div>

						{/* Biography Field */}
						<div className="space-y-2">
							<Label htmlFor="biography">Životopis</Label>
							<Textarea
								id="biography"
								{...register("biography")}
								placeholder="Napíšte stručný životopis autora..."
								rows={4}
								disabled={isSubmitting || isUploading}
							/>
							<div className="flex justify-between items-center">
								<p className="text-sm text-muted-foreground">
									{formValues.biography?.length || 0}/5000 znakov
								</p>
								{formErrors.biography && (
									<p className="text-sm text-destructive">
										{formErrors.biography.message}
									</p>
								)}
							</div>
						</div>

						{/* Birth and Death Year Fields */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="birthYear">Rok narodenia</Label>
								<Input
									id="birthYear"
									type="number"
									{...register("birthYear", { valueAsNumber: true })}
									placeholder="napr., 1965"
									disabled={isSubmitting || isUploading}
								/>
								{formErrors.birthYear && (
									<p className="text-sm text-destructive">
										{formErrors.birthYear.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="deathYear">Rok úmrtia</Label>
								<Input
									id="deathYear"
									type="number"
									{...register("deathYear", { valueAsNumber: true })}
									placeholder="napr., 2023"
									disabled={isSubmitting || isUploading}
								/>
								{formErrors.deathYear && (
									<p className="text-sm text-destructive">
										{formErrors.deathYear.message}
									</p>
								)}
							</div>
						</div>

						{/* Nationality and Website Fields */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="nationality">Národnosť</Label>
								<Input
									id="nationality"
									{...register("nationality")}
									placeholder="napr., Slovenská"
									disabled={isSubmitting || isUploading}
								/>
								{formErrors.nationality && (
									<p className="text-sm text-destructive">
										{formErrors.nationality.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="website">Webstránka</Label>
								<Input
									id="website"
									type="url"
									{...register("website")}
									placeholder="https://example.com"
									disabled={isSubmitting || isUploading}
								/>
								{formErrors.website && (
									<p className="text-sm text-destructive">
										{formErrors.website.message}
									</p>
								)}
							</div>
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
										? "Vytváram autora..."
										: "Autor bol úspešne vytvorený!"}
								</p>
							</div>
						)}

						{/* Form Actions */}
						<div className="flex justify-end gap-4 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate({ to: "/authors" })}
								disabled={isSubmitting || isUploading}
							>
								Zrušiť
							</Button>
							<Button type="submit" disabled={isSubmitting || isUploading}>
								{isSubmitting || isUploading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										{isUploading ? "Nahrávanie..." : "Vytváram..."}
									</>
								) : (
									<>
										<UserPlus className="mr-2 h-4 w-4" />
										Vytvoriť autora
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
