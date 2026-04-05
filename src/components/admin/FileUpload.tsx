"use client";

import React, { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImg } from "@/lib/image-utils";
import { trpc } from "@/trpc/client";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Crop, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type UploadFolder = "books" | "authors";

interface FileUploadProps {
	onUploadComplete: (url: string) => void;
	defaultValue?: string;
	uploadFolder?: UploadFolder;
	/** Pomer strán (napr. 3/4 = 0.75 pre knihy, 1 pre autorov) */
	aspectRatio?: number;
	label?: string;
}

export function FileUpload({
	onUploadComplete,
	defaultValue,
	uploadFolder = "books",
	aspectRatio = 3 / 4,
	label,
}: FileUploadProps) {
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [isCropping, setIsCropping] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(defaultValue || null);

	const getSasUrl = trpc.upload.getPresignedUrl.useMutation();

	const onCropComplete = useCallback((_area: Area, pixels: Area) => {
		setCroppedAreaPixels(pixels);
	}, []);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			const file = acceptedFiles[0];
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				setImageSrc(reader.result as string);
				setIsCropping(true);
			});
			reader.readAsDataURL(file);
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { "image/*": [] },
		multiple: false,
	});

	const handleUpload = async () => {
		if (!imageSrc || !croppedAreaPixels) return;

		try {
			setIsUploading(true);
			const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
			if (!croppedBlob) throw new Error("Chyba pri generovaní orezu.");

			// 1. Získať SAS URL z tRPC
			const { url, blobName } = await getSasUrl.mutateAsync({
				fileName: "upload.jpg",
				folder: uploadFolder,
			});

			// 2. Priamy upload na Azure (PUT)
			const uploadRes = await fetch(url, {
				method: "PUT",
				body: croppedBlob,
				headers: {
					"x-ms-blob-type": "BlockBlob",
					"Content-Type": "image/jpeg",
				},
			});

			if (!uploadRes.ok) throw new Error("Upload na Azure zlyhal.");

			// 3. Odvodená finálna URL (bez SAS tokenu) - tRPC server vracia path
			// V našom prípade vieme získať base URL z tRPC mutácie alebo ju odvodiť
			const finalUrl = url.split("?")[0];
			setPreviewUrl(finalUrl);
			onUploadComplete(finalUrl);
			setIsCropping(false);
			setImageSrc(null);
			toast.success("Obrázok bol úspešne spracovaný a nahraný.");
		} catch (error: any) {
			console.error(error);
			toast.error(error.message || "Chyba pri nahrávaní.");
		} finally {
			setIsUploading(false);
		}
	};

	const removeImage = () => {
		setPreviewUrl(null);
		onUploadComplete("");
	};

	return (
		<div className="space-y-4">
			{!previewUrl ? (
				<div
					{...getRootProps()}
					className={cn(
						"relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all duration-200 text-center",
						isDragActive
							? "border-primary bg-primary/5 scale-[1.01]"
							: "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
					)}
				>
					<input {...getInputProps()} />
					<div className="flex flex-col items-center gap-3">
						<div className="p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform">
							<Upload className="size-6 text-slate-500" />
						</div>
						<div className="space-y-1">
							<p className="text-sm font-semibold">
								{label || (uploadFolder === "books" ? "Pridať obálku knihy" : "Pridať fotku autora")}
							</p>
							<p className="text-xs text-muted-foreground italic">
								PNG, JPG alebo WebP (max 5MB)
							</p>
						</div>
					</div>
				</div>
			) : (
				<div className="relative w-full aspect-[3/4] max-w-[240px] mx-auto rounded-2xl overflow-hidden shadow-xl border border-border group">
					<Image
						src={previewUrl}
						alt="Náhľad"
						fill
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
						<Button
							variant="secondary"
							size="icon-sm"
							className="rounded-full h-10 w-10"
							onClick={() => setIsCropping(true)}
							title="Zmeniť orez"
						>
							<Crop className="size-4" />
						</Button>
						<Button
							variant="destructive"
							size="icon-sm"
							className="rounded-full h-10 w-10"
							onClick={removeImage}
							title="Odstrániť"
						>
							<Trash2 className="size-4" />
						</Button>
					</div>
				</div>
			)}

			<Dialog open={isCropping} onOpenChange={(open) => !isUploading && setIsCropping(open)}>
				<DialogContent className="max-w-2xl overflow-hidden rounded-2xl p-0 gap-0">
					<DialogHeader className="p-6 border-b border-border bg-slate-50/50 dark:bg-slate-900/50">
						<DialogTitle className="flex items-center gap-2">
							<Crop className="size-5 text-primary" />
							Upraviť výrez {uploadFolder === "books" ? "obálky" : "fotky"}
						</DialogTitle>
					</DialogHeader>

					<div className="relative h-[400px] w-full bg-slate-950">
						{imageSrc && (
							<Cropper
								image={imageSrc}
								crop={crop}
								zoom={zoom}
								aspect={aspectRatio}
								onCropChange={setCrop}
								onCropComplete={onCropComplete}
								onZoomChange={setZoom}
								classes={{
									containerClassName: "rounded-none",
								}}
							/>
						)}
					</div>

					<div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-border space-y-4">
						<div className="flex items-center gap-4">
							<span className="text-xs font-medium text-muted-foreground w-12">Priblíženie</span>
							<input
								type="range"
								min={1}
								max={3}
								step={0.1}
								value={zoom}
								onChange={(e) => setZoom(Number(e.target.value))}
								className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
							/>
						</div>

						<DialogFooter className="flex-row justify-end gap-2 sm:gap-0 mt-2">
							<Button
								variant="ghost"
								onClick={() => setIsCropping(false)}
								disabled={isUploading}
								className="rounded-xl px-6"
							>
								<X className="size-4 mr-2" />
								Zrušiť
							</Button>
							<Button
								onClick={handleUpload}
								disabled={isUploading}
								className="rounded-xl px-8"
							>
								{isUploading ? (
									<>
										<Loader2 className="size-4 mr-2 animate-spin" />
										Nahrávam...
									</>
								) : (
									<>
										<Check className="size-4 mr-2" />
										Uložiť a nahrať
									</>
								)}
							</Button>
						</DialogFooter>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
