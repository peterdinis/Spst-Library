"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthorFormData, authorSchema } from "@/lib/validations";
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

interface AuthorFormProps {
	initialData?: Partial<AuthorFormData> & { id?: string };
	onSubmit: (data: AuthorFormData) => Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
}

const AuthorForm: FC<AuthorFormProps> = ({
	initialData,
	onSubmit,
	onCancel,
	isLoading = false,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<AuthorFormData>({
		resolver: zodResolver(authorSchema),
		defaultValues: initialData || {
			name: "",
			biography: "",
			birthDate: "",
			nationality: "",
			photoUrl: "",
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{initialData?.id ? "Upraviť autora" : "Pridať nového autora"}
				</CardTitle>
				<CardDescription>
					{initialData?.id
						? "Upravte informácie o autorovi"
						: "Vyplňte informácie o novom autorovi"}
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit(onSubmit)}>
				<CardContent className="space-y-4">
					{/* Name */}
					<div className="space-y-2">
						<Label htmlFor="name">Meno autora *</Label>
						<Input
							id="name"
							{...register("name")}
							placeholder="Napríklad: Michail Bulgakov"
						/>
						{errors.name && (
							<p className="text-sm text-red-600">{errors.name.message}</p>
						)}
					</div>

					{/* Biography */}
					<div className="space-y-2">
						<Label htmlFor="biography">Biografia *</Label>
						<textarea
							id="biography"
							{...register("biography")}
							placeholder="Stručná biografia autora..."
							className="w-full p-2 border rounded-md bg-background min-h-[120px]"
						/>
						{errors.biography && (
							<p className="text-sm text-red-600">{errors.biography.message}</p>
						)}
					</div>

					{/* Birth Date */}
					<div className="space-y-2">
						<Label htmlFor="birthDate">Dátum narodenia (voliteľné)</Label>
						<Input id="birthDate" type="date" {...register("birthDate")} />
						{errors.birthDate && (
							<p className="text-sm text-red-600">{errors.birthDate.message}</p>
						)}
					</div>

					{/* Nationality */}
					<div className="space-y-2">
						<Label htmlFor="nationality">Národnosť (voliteľné)</Label>
						<Input
							id="nationality"
							{...register("nationality")}
							placeholder="Napríklad: Rusko"
						/>
						{errors.nationality && (
							<p className="text-sm text-red-600">
								{errors.nationality.message}
							</p>
						)}
					</div>

					{/* Photo URL */}
					<div className="space-y-2">
						<Label htmlFor="photoUrl">URL fotografie (voliteľné)</Label>
						<Input
							id="photoUrl"
							{...register("photoUrl")}
							placeholder="https://example.com/photo.jpg"
						/>
						{errors.photoUrl && (
							<p className="text-sm text-red-600">{errors.photoUrl.message}</p>
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
						{initialData?.id ? "Uložiť zmeny" : "Pridať autora"}
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

export default AuthorForm;
