import { FC, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryCreateSchema } from "types/categoryTypes";
import z from "zod";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
	CheckCircle2,
	Loader2,
	Tag,
	Hash,
	Palette,
	Sparkles,
	X,
	FileText,
	AlertCircle,
	Search,
	Book,
	BookOpen,
	BookMarked,
	BookText,
	BookCopy,
	BookCheck,
	Library,
	Bookmark,
	Trophy,
	Award,
	Star,
	Heart,
	Flame,
	Zap,
	Globe,
	Music,
	Film,
	Gamepad2,
	Code,
	Palette as PaletteIcon,
	Music2,
	Camera,
	Utensils,
	Car,
	Plane,
	TreePine,
	Moon,
	Sun,
	Cloud,
	Droplets,
	Mountain,
	Leaf,
	Flower2,
	Cat,
	Dog,
	Bird,
	Fish,
	Bug,
	Apple,
	Pizza,
	Coffee,
	Wine,
	Gem,
	Diamond,
	Crown,
	Castle,
	Sword,
	Shield,
	Rocket,
	Atom,
	Microscope,
	Stethoscope,
	Briefcase,
	GraduationCap,
	Phone,
	Mail,
	MessageCircle,
	Users,
	User,
	UserPlus,
	Settings,
	Bell,
	Lock,
	Key,
	Home,
	Building,
	Banknote,
	CreditCard,
	ShoppingCart,
	Truck,
	Package,
	Gift,
	PartyPopper,
	Cake,
	Music3,
	Tv,
	Headphones,
	Monitor,
	Smartphone,
	Tablet,
	Laptop,
	Printer,
	Watch,
	Clock,
	Calendar,
	MapPin,
	Navigation,
	Compass,
	Flag,
	Trophy as TrophyIcon,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

type IconType = {
	name: string;
	component: React.ComponentType<any>;
	category: string;
};

const ICON_CATEGORIES = [
	{ id: "books", label: "Knihy", icon: Book },
	{ id: "education", label: "Vzdelanie", icon: GraduationCap },
	{ id: "entertainment", label: "Zábava", icon: Film },
	{ id: "nature", label: "Príroda", icon: TreePine },
	{ id: "animals", label: "Zvieratá", icon: Cat },
	{ id: "food", label: "Jedlo", icon: Pizza },
	{ id: "technology", label: "Technológie", icon: Code },
	{ id: "business", label: "Biznis", icon: Briefcase },
	{ id: "sports", label: "Šport", icon: Trophy },
	{ id: "fantasy", label: "Fantasy", icon: Castle },
	{ id: "science", label: "Veda", icon: Atom },
	{ id: "health", label: "Zdravie", icon: Stethoscope },
	{ id: "communication", label: "Komunikácia", icon: MessageCircle },
	{ id: "people", label: "Ľudia", icon: Users },
	{ id: "travel", label: "Cestovanie", icon: Plane },
	{ id: "shopping", label: "Nakupovanie", icon: ShoppingCart },
	{ id: "devices", label: "Zariadenia", icon: Laptop },
	{ id: "time", label: "Čas", icon: Clock },
	{ id: "location", label: "Lokácie", icon: MapPin },
	{ id: "other", label: "Ostatné", icon: Sparkles },
];

const ALL_ICONS: IconType[] = [
	// Knihy
	{ name: "Book", component: Book, category: "books" },
	{ name: "BookOpen", component: BookOpen, category: "books" },
	{ name: "BookMarked", component: BookMarked, category: "books" },
	{ name: "BookText", component: BookText, category: "books" },
	{ name: "BookCopy", component: BookCopy, category: "books" },
	{ name: "BookCheck", component: BookCheck, category: "books" },
	{ name: "Library", component: Library, category: "books" },
	{ name: "Bookmark", component: Bookmark, category: "books" },

	// Vzdelanie
	{ name: "GraduationCap", component: GraduationCap, category: "education" },

	// Zábava
	{ name: "Film", component: Film, category: "entertainment" },
	{ name: "Music", component: Music, category: "entertainment" },
	{ name: "Music2", component: Music2, category: "entertainment" },
	{ name: "Music3", component: Music3, category: "entertainment" },
	{ name: "Tv", component: Tv, category: "entertainment" },
	{ name: "Gamepad2", component: Gamepad2, category: "entertainment" },
	{ name: "Headphones", component: Headphones, category: "entertainment" },

	// Príroda
	{ name: "TreePine", component: TreePine, category: "nature" },
	{ name: "Leaf", component: Leaf, category: "nature" },
	{ name: "Flower2", component: Flower2, category: "nature" },
	{ name: "Mountain", component: Mountain, category: "nature" },
	{ name: "Cloud", component: Cloud, category: "nature" },
	{ name: "Sun", component: Sun, category: "nature" },
	{ name: "Moon", component: Moon, category: "nature" },
	{ name: "Droplets", component: Droplets, category: "nature" },

	// Zvieratá
	{ name: "Cat", component: Cat, category: "animals" },
	{ name: "Dog", component: Dog, category: "animals" },
	{ name: "Bird", component: Bird, category: "animals" },
	{ name: "Fish", component: Fish, category: "animals" },
	{ name: "Bug", component: Bug, category: "animals" },

	// Jedlo
	{ name: "Apple", component: Apple, category: "food" },
	{ name: "Pizza", component: Pizza, category: "food" },
	{ name: "Coffee", component: Coffee, category: "food" },
	{ name: "Wine", component: Wine, category: "food" },
	{ name: "Cake", component: Cake, category: "food" },
	{ name: "Utensils", component: Utensils, category: "food" },

	// Technológie
	{ name: "Code", component: Code, category: "technology" },
	{ name: "Laptop", component: Laptop, category: "technology" },
	{ name: "Smartphone", component: Smartphone, category: "technology" },
	{ name: "Tablet", component: Tablet, category: "technology" },
	{ name: "Monitor", component: Monitor, category: "technology" },
	{ name: "Printer", component: Printer, category: "technology" },
	{ name: "Rocket", component: Rocket, category: "technology" },
	{ name: "Atom", component: Atom, category: "technology" },

	// Biznis
	{ name: "Briefcase", component: Briefcase, category: "business" },
	{ name: "Banknote", component: Banknote, category: "business" },
	{ name: "CreditCard", component: CreditCard, category: "business" },

	// Šport
	{ name: "Trophy", component: Trophy, category: "sports" },
	{ name: "TrophyIcon", component: TrophyIcon, category: "sports" },
	{ name: "Award", component: Award, category: "sports" },

	// Fantasy
	{ name: "Castle", component: Castle, category: "fantasy" },
	{ name: "Crown", component: Crown, category: "fantasy" },
	{ name: "Sword", component: Sword, category: "fantasy" },
	{ name: "Shield", component: Shield, category: "fantasy" },
	{ name: "Gem", component: Gem, category: "fantasy" },
	{ name: "Diamond", component: Diamond, category: "fantasy" },

	// Veda
	{ name: "Microscope", component: Microscope, category: "science" },
	{ name: "Atom", component: Atom, category: "science" },

	// Zdravie
	{ name: "Stethoscope", component: Stethoscope, category: "health" },
	{ name: "Heart", component: Heart, category: "health" },

	// Komunikácia
	{
		name: "MessageCircle",
		component: MessageCircle,
		category: "communication",
	},
	{ name: "Phone", component: Phone, category: "communication" },
	{ name: "Mail", component: Mail, category: "communication" },

	// Ľudia
	{ name: "Users", component: Users, category: "people" },
	{ name: "User", component: User, category: "people" },
	{ name: "UserPlus", component: UserPlus, category: "people" },

	// Cestovanie
	{ name: "Plane", component: Plane, category: "travel" },
	{ name: "Car", component: Car, category: "travel" },
	{ name: "Compass", component: Compass, category: "travel" },
	{ name: "Navigation", component: Navigation, category: "travel" },

	// Nakupovanie
	{ name: "ShoppingCart", component: ShoppingCart, category: "shopping" },
	{ name: "Package", component: Package, category: "shopping" },
	{ name: "Gift", component: Gift, category: "shopping" },
	{ name: "Truck", component: Truck, category: "shopping" },

	// Čas
	{ name: "Clock", component: Clock, category: "time" },
	{ name: "Calendar", component: Calendar, category: "time" },
	{ name: "Watch", component: Watch, category: "time" },

	// Lokácie
	{ name: "MapPin", component: MapPin, category: "location" },
	{ name: "Home", component: Home, category: "location" },
	{ name: "Building", component: Building, category: "location" },
	{ name: "Flag", component: Flag, category: "location" },
	{ name: "Globe", component: Globe, category: "location" },

	// Ostatné
	{ name: "Star", component: Star, category: "other" },
	{ name: "Heart", component: Heart, category: "other" },
	{ name: "Flame", component: Flame, category: "other" },
	{ name: "Zap", component: Zap, category: "other" },
	{ name: "Palette", component: PaletteIcon, category: "other" },
	{ name: "Camera", component: Camera, category: "other" },
	{ name: "Settings", component: Settings, category: "other" },
	{ name: "Bell", component: Bell, category: "other" },
	{ name: "Lock", component: Lock, category: "other" },
	{ name: "Key", component: Key, category: "other" },
	{ name: "PartyPopper", component: PartyPopper, category: "other" },
	{ name: "Sparkles", component: Sparkles, category: "other" },
	{ name: "CheckCircle2", component: CheckCircle2, category: "other" },
];

type CategoryFormDataInput = z.infer<typeof categoryCreateSchema>;

const CreateCategoryForm: FC = () => {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [formError, setFormError] = useState<string>("");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

	const createCategory = useMutation(api.categories.createCategory);

	const {
		register,
		handleSubmit,
		formState: { errors: formErrors, isSubmitting: isLoading },
		setValue,
		control,
	} = useForm<CategoryFormDataInput>({
		resolver: zodResolver(categoryCreateSchema) as any,
		defaultValues: {
			name: "",
			slug: "",
			description: "",
			color: "#8b5cf6",
			icon: "",
			isActive: true,
		},
	});

	const formData = useWatch({ control });

	useEffect(() => {
		if (formError) {
			const timer = setTimeout(() => setFormError(""), 5000);
			return () => clearTimeout(timer);
		}
	}, [formError]);

	const onSubmit = async (data: CategoryFormDataInput) => {
		if (isLoading) return; // Client-side rate limiting / double submission lock
		setFormError("");

		try {
			const result = await createCategory(data);

			if (result) {
				setIsSubmitted(true);
			}
		} catch (error: any) {
			if (
				error.message?.includes("already exists") ||
				error.message?.includes("už existuje")
			) {
				setFormError(`Kategória so slugom "${data.slug}" už existuje.`);
			} else {
				setFormError(
					error.message ||
					"Nastala chyba pri vytváraní kategórie. Skúste to znova.",
				);
			}
		}
	};

	const generateSlug = () => {
		if (!formData.name?.trim()) return;

		const slug = formData.name
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");

		setValue("slug", slug, { shouldValidate: true });
	};

	const resetForm = () => {
		setValue("name", "");
		setValue("slug", "");
		setValue("description", "");
		setValue("color", "#8b5cf6");
		setValue("icon", "");
		setFormError("");
		setIsSubmitted(false);
		setSearchQuery("");
		setSelectedCategory("all");
	};

	const selectIcon = (iconName: string) => {
		setValue("icon", iconName, { shouldValidate: true });
	};

	const filteredIcons = ALL_ICONS.filter((icon) => {
		const matchesSearch = icon.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesCategory =
			selectedCategory === "all" || icon.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.4,
				when: "beforeChildren",
				staggerChildren: 0.08,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, x: -20 },
		visible: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.3 },
		},
	};

	const getSelectedIconComponent = () => {
		const icon = ALL_ICONS.find((i) => i.name === formData.icon);
		return icon ? icon.component : null;
	};

	const SelectedIcon = getSelectedIconComponent();

	if (isSubmitted) {
		const SuccessIcon = getSelectedIconComponent();

		return (
			<div className="min-h-screen flex items-center justify-center p-4">
				<motion.div
					initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
					animate={{ opacity: 1, scale: 1, rotateY: 0 }}
					transition={{ duration: 0.6, type: "spring" }}
					className="text-center max-w-md"
				>
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
						className="mb-6 flex justify-center"
					>
						<div className="relative">
							<div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
							<div className="relative bg-white rounded-full p-6">
								{SuccessIcon ? (
									<SuccessIcon
										className="h-24 w-24 text-green-500"
										strokeWidth={1.5}
										style={{ color: formData.color }}
									/>
								) : (
									<CheckCircle2
										className="h-24 w-24 text-green-500"
										strokeWidth={1.5}
									/>
								)}
							</div>
						</div>
					</motion.div>

					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="text-3xl font-bold mb-3 bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"
					>
						Kategória vytvorená!
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className="text-muted-foreground mb-2"
					>
						Kategória <strong>{formData.name}</strong> bola úspešne vytvorená.
					</motion.p>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6 }}
						className="mt-6 p-4 bg-violet-50 rounded-lg border border-violet-200 text-left"
					>
						<div className="space-y-2 text-sm">
							<div className="flex items-center gap-2">
								<div
									className="w-4 h-4 rounded"
									style={{ backgroundColor: formData.color }}
								/>
								<span className="text-muted-foreground">Farba:</span>
								<span className="font-mono">{formData.color}</span>
							</div>
							<div>
								<span className="text-muted-foreground">Slug:</span>
								<span className="ml-2 font-mono text-violet-700">
									{formData.slug}
								</span>
							</div>
							{formData.icon && (
								<div className="flex items-center gap-2">
									<span className="text-muted-foreground">Ikona:</span>
									{SelectedIcon && (
										<SelectedIcon
											className="h-4 w-4"
											style={{ color: formData.color }}
										/>
									)}
									<span className="font-mono">{formData.icon}</span>
								</div>
							)}
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7 }}
						className="mt-8"
					>
						<Button
							onClick={resetForm}
							className="bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
						>
							Vytvoriť ďalšiu kategóriu
						</Button>
					</motion.div>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<motion.div
				initial="hidden"
				animate="visible"
				variants={containerVariants}
				className="w-full max-w-2xl"
			>
				<Card className="border-0 shadow-2xl shadow-violet-500/10 backdrop-blur overflow-hidden">
					{/* Decorative header gradient */}
					<div className="h-2 bg-linear-to-r from-violet-500 via-purple-500 to-pink-500" />

					<CardHeader className="space-y-4 pb-6">
						<motion.div
							variants={itemVariants}
							className="flex items-center gap-3"
						>
							<div className="p-2.5 bg-linear-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
								<Sparkles className="h-6 w-6 text-white" />
							</div>
							<div>
								<CardTitle className="text-3xl font-bold bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
									Nová kategória
								</CardTitle>
								<CardDescription className="text-base mt-1">
									Vytvorte novú kategóriu pre knihy
								</CardDescription>
							</div>
						</motion.div>
					</CardHeader>

					<CardContent>
						{formError && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="mb-6"
							>
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{formError}</AlertDescription>
								</Alert>
							</motion.div>
						)}

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							{/* Názov kategórie */}
							<motion.div variants={itemVariants} className="space-y-2">
								<Label
									htmlFor="name"
									className="flex items-center gap-2 text-base"
								>
									<Tag className="h-4 w-4 text-violet-600" />
									Názov kategórie *
								</Label>
								<Input
									id="name"
									{...register("name")}
									onBlur={generateSlug}
									placeholder="napr. Science Fiction"
									className={`transition-all h-11 ${formErrors.name ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}`}
									disabled={isLoading}
								/>
								<div className="flex justify-between items-center">
									{formErrors.name && (
										<motion.p
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="text-sm text-red-500"
										>
											{formErrors.name.message}
										</motion.p>
									)}
									<span className="text-xs text-muted-foreground ml-auto">
										{formData.name?.length || 0}/100
									</span>
								</div>
							</motion.div>

							{/* Slug */}
							<motion.div variants={itemVariants} className="space-y-2">
								<Label
									htmlFor="slug"
									className="flex items-center gap-2 text-base"
								>
									<Hash className="h-4 w-4 text-violet-600" />
									Slug (URL) *
								</Label>
								<div className="flex gap-2">
									<Input
										id="slug"
										{...register("slug")}
										placeholder="science-fiction"
										className={`transition-all h-11 font-mono ${formErrors.slug ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}`}
										disabled={isLoading}
									/>
									<Button
										type="button"
										variant="outline"
										onClick={generateSlug}
										className="shrink-0"
										disabled={!formData.name || isLoading}
									>
										Generovať
									</Button>
								</div>
								<div className="flex justify-between items-center">
									{formErrors.slug && (
										<motion.p
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="text-sm text-red-500"
										>
											{formErrors.slug.message}
										</motion.p>
									)}
									<span className="text-xs text-muted-foreground ml-auto">
										{formData.slug?.length || 0}/100
									</span>
								</div>
							</motion.div>

							{/* Popis */}
							<motion.div variants={itemVariants} className="space-y-2">
								<Label
									htmlFor="description"
									className="flex items-center gap-2 text-base"
								>
									<FileText className="h-4 w-4 text-violet-600" />
									Popis (nepovinné)
								</Label>
								<Textarea
									id="description"
									{...register("description")}
									placeholder="Krátky popis kategórie..."
									rows={4}
									className="focus-visible:ring-violet-500 resize-none"
									disabled={isLoading}
								/>
								<div className="flex justify-between items-center">
									{formErrors.description && (
										<motion.p
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="text-sm text-red-500"
										>
											{formErrors.description.message}
										</motion.p>
									)}
									<span className="text-xs text-muted-foreground ml-auto">
										{formData.description?.length || 0}/500
									</span>
								</div>
							</motion.div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Farba */}
								<motion.div variants={itemVariants} className="space-y-2">
									<Label
										htmlFor="color"
										className="flex items-center gap-2 text-base"
									>
										<Palette className="h-4 w-4 text-violet-600" />
										Farba
									</Label>
									<div className="flex gap-2">
										<div className="relative flex-1">
											<Input
												id="color"
												type="text"
												{...register("color")}
												placeholder="#8b5cf6"
												className={`transition-all h-11 font-mono pr-12 ${formErrors.color ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}`}
												disabled={isLoading}
											/>
											<div
												className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded border-2 border-white shadow-sm ring-1 ring-black/10"
												style={{ backgroundColor: formData.color }}
											/>
										</div>
										<input
											type="color"
											value={formData.color}
											onChange={(e) =>
												setValue("color", e.target.value, {
													shouldValidate: true,
												})
											}
											className="w-12 h-11 rounded border cursor-pointer"
											disabled={isLoading}
										/>
									</div>
									{formErrors.color && (
										<motion.p
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="text-sm text-red-500"
										>
											{formErrors.color.message}
										</motion.p>
									)}
								</motion.div>

								{/* Ikona */}
								<motion.div variants={itemVariants} className="space-y-2">
									<Label
										htmlFor="icon"
										className="flex items-center gap-2 text-base"
									>
										<Sparkles className="h-4 w-4 text-violet-600" />
										Ikona (nepovinné)
									</Label>

									<Popover>
										<PopoverTrigger asChild>
											<Button
												type="button"
												variant="outline"
												className="w-full justify-start h-11"
												disabled={isLoading}
											>
												<div className="flex items-center gap-3 w-full">
													{SelectedIcon ? (
														<>
															<SelectedIcon className="h-4 w-4" />
															<span className="flex-1 text-left">
																{formData.icon}
															</span>
														</>
													) : (
														<>
															<div className="h-4 w-4 flex items-center justify-center">
																<Sparkles className="h-3 w-3 text-muted-foreground" />
															</div>
															<span className="flex-1 text-left text-muted-foreground">
																Vyberte ikonu...
															</span>
														</>
													)}
												</div>
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-100 p-0" align="start">
											<div className="p-4 border-b">
												<div className="flex items-center gap-2 mb-3">
													<Search className="h-4 w-4 text-muted-foreground" />
													<Input
														placeholder="Hľadať ikony..."
														value={searchQuery}
														onChange={(e) => setSearchQuery(e.target.value)}
														className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
													/>
												</div>

												<div className="flex flex-wrap gap-1 mb-2">
													<Button
														type="button"
														variant={
															selectedCategory === "all" ? "default" : "ghost"
														}
														size="sm"
														onClick={() => setSelectedCategory("all")}
														className="text-xs h-7"
													>
														Všetky
													</Button>
													{ICON_CATEGORIES.map((category) => (
														<Button
															key={category.id}
															type="button"
															variant={
																selectedCategory === category.id
																	? "default"
																	: "ghost"
															}
															size="sm"
															onClick={() => setSelectedCategory(category.id)}
															className="text-xs h-7"
														>
															<category.icon className="mr-1 h-3 w-3" />
															{category.label}
														</Button>
													))}
												</div>
											</div>

											<div className="h-64 overflow-y-auto p-4">
												<div className="grid grid-cols-6 gap-2">
													{filteredIcons.length > 0 ? (
														filteredIcons.map((icon) => {
															const IconComponent = icon.component;
															const isSelected = formData.icon === icon.name;
															return (
																<Button
																	key={icon.name}
																	type="button"
																	variant="ghost"
																	size="sm"
																	onClick={() => selectIcon(icon.name)}
																	className={`h-12 flex-col ${isSelected ? "bg-violet-50 border border-violet-200" : ""}`}
																>
																	<IconComponent
																		className={`h-4 w-4 ${isSelected ? "text-violet-600" : "text-muted-foreground"}`}
																	/>
																	<span className="text-[10px] mt-1 truncate w-full">
																		{icon.name}
																	</span>
																</Button>
															);
														})
													) : (
														<div className="col-span-6 text-center py-8 text-muted-foreground">
															Nenašli sa žiadne ikony pre "{searchQuery}"
														</div>
													)}
												</div>
											</div>
										</PopoverContent>
									</Popover>

									{formData.icon && (
										<div className="flex items-center justify-between mt-2">
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() =>
													setValue("icon", "", { shouldValidate: true })
												}
												disabled={isLoading}
												className="h-7 text-xs"
											>
												<X className="mr-1 h-3 w-3" />
												Odstrániť ikonu
											</Button>
											<span className="text-xs text-muted-foreground">
												{formData.icon.length}/50
											</span>
										</div>
									)}

									{formErrors.icon && (
										<motion.p
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="text-sm text-red-500 mt-1"
										>
											{formErrors.icon.message}
										</motion.p>
									)}
								</motion.div>
							</div>

							{/* Náhľad */}
							<motion.div
								variants={itemVariants}
								className="p-4 rounded-xl border border-violet-200"
							>
								<h4 className="font-semibold text-sm mb-3 text-violet-900 flex items-center gap-2">
									<Sparkles className="h-4 w-4" />
									Náhľad kategórie
								</h4>
								<div className="flex items-center gap-3 p-3 rounded-lg border shadow-sm">
									<div className="flex-1 min-w-0">
										<div className="font-semibold text-foreground">
											{formData.name || "Názov kategórie"}
										</div>
										{formData.slug && (
											<div className="text-xs text-muted-foreground font-mono">
												/{formData.slug}
											</div>
										)}
									</div>
									<Badge
										variant="secondary"
										style={{
											backgroundColor: `${formData.color}20`,
											color: formData.color,
											borderColor: `${formData.color}40`,
										}}
									>
										{SelectedIcon && <SelectedIcon className="mr-1 h-3 w-3" />}
										Kategória
									</Badge>
								</div>
							</motion.div>

							{/* Tlačidlá */}
							<motion.div variants={itemVariants} className="flex gap-3 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={resetForm}
									className="flex-1"
									disabled={isLoading}
								>
									<X className="mr-2 h-4 w-4" />
									Zrušiť
								</Button>

								<Button
									type="submit"
									disabled={isLoading}
									className="flex-1 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/30"
								>
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Vytváranie...
										</>
									) : (
										<>
											<CheckCircle2 className="mr-2 h-4 w-4" />
											Vytvoriť kategóriu
										</>
									)}
								</Button>
							</motion.div>
						</form>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
};

export default CreateCategoryForm;
