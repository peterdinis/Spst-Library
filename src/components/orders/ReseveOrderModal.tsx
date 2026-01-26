import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	User as UserIcon,
	Mail,
	Clock,
	CheckCircle,
	CalendarRange,
	AlertCircle,
} from "lucide-react";
import { z } from "zod";
import { Book, ReservationData, ReservationSchema } from "types/reservationTypes";

interface ReservationModalProps {
	isOpen: boolean;
	onClose: () => void;
	book: Book;
}

export function ReservationModal({
	isOpen,
	onClose,
	book,
}: ReservationModalProps) {
	const [customPeriodEnabled, setCustomPeriodEnabled] = useState(false);
	const [reservationData, setReservationData] = useState<ReservationData>({
		name: "",
		email: "",
		phone: "",
		note: "",
		period: "7",
		customPeriod: "14",
	});
	const [reservationStep, setReservationStep] = useState<"form" | "success">(
		"form",
	);
	const [isLoading, setIsLoading] = useState(false);
	const [validationErrors, setValidationErrors] = useState<
		z.ZodError | null
	>(null);

	const dialogVariants = {
		hidden: {
			opacity: 0,
			scale: 0.8,
			y: -20,
		},
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 25,
				duration: 0.3,
			},
		},
		exit: {
			opacity: 0,
			scale: 0.9,
			transition: {
				duration: 0.2,
			},
		},
	};

	const successVariants = {
		hidden: { scale: 0.8, opacity: 0 },
		visible: {
			scale: 1,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 20,
			},
		},
	};

	// Validácia dát pomocou Zod
	const validateData = () => {
		try {
			// Vytvoríme kópiu dát pre validáciu
			const dataToValidate = { ...reservationData };
			
			// Ak je povolená vlastná doba, použijeme customPeriod, inak period
			if (customPeriodEnabled) {
				dataToValidate.period = dataToValidate.customPeriod;
			}

			// Vytvoríme validačný schema s prispôsobenými správami
			const validationSchema = ReservationSchema.refine(
				(data) => {
					if (customPeriodEnabled) {
						const num = parseInt(data.period);
						return num >= 1 && num <= 365;
					}
					return true;
				},
				{
					message: "Doba musí byť medzi 1 a 365 dňami",
					path: ["period"],
				}
			);

			validationSchema.parse(dataToValidate);
			setValidationErrors(null);
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				setValidationErrors(error);
			}
			return false;
		}
	};

	// Funkcia na získanie chybového hlásenia pre konkrétne pole
	const getFieldError = (fieldName: keyof ReservationData): string | null => {
		if (!validationErrors) return null;
		
		const fieldError = validationErrors.errors.find(
			(error) => error.path[0] === fieldName
		);
		
		return fieldError ? fieldError.message : null;
	};

	// Funkcia na získanie chýb pre pole period (ktoré môže byť customPeriod)
	const getPeriodError = (): string | null => {
		if (!validationErrors) return null;
		
		const periodError = validationErrors.errors.find(
			(error) => error.path[0] === "period"
		);
		
		return periodError ? periodError.message : null;
	};

	const handleReservationSubmit = async () => {
		// Validácia dát
		if (!validateData()) {
			return;
		}

		setIsLoading(true);

		// Získanie finálnej doby výpožičky
		const finalPeriod = customPeriodEnabled
			? parseInt(reservationData.customPeriod)
			: parseInt(reservationData.period);

		// Simulácia API volania
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Tu by bola skutočná logika na odoslanie rezervácie
		console.log("Reservation data:", {
			...reservationData,
			period: finalPeriod,
			isCustomPeriod: customPeriodEnabled,
		});

		setIsLoading(false);
		setReservationStep("success");

		// Reset formulára po 3 sekundách
		setTimeout(() => {
			onClose();
			setReservationStep("form");
			setCustomPeriodEnabled(false);
			setValidationErrors(null);
			setReservationData({
				name: "",
				email: "",
				phone: "",
				note: "",
				period: "7",
				customPeriod: "14",
			});
		}, 3000);
	};

	const handleCustomPeriodChange = (value: string) => {
		const numValue = parseInt(value);
		if (isNaN(numValue)) {
			setReservationData({ ...reservationData, customPeriod: "" });
			return;
		}

		if (numValue < 1) {
			setReservationData({ ...reservationData, customPeriod: "1" });
		} else if (numValue > 365) {
			setReservationData({ ...reservationData, customPeriod: "365" });
		} else {
			setReservationData({ ...reservationData, customPeriod: value });
		}
	};

	const getReservationPeriod = () => {
		return customPeriodEnabled
			? reservationData.customPeriod
			: reservationData.period;
	};

	const getReservationPeriodLabel = () => {
		const period = parseInt(getReservationPeriod());
		if (period === 1) return "1 deň";
		if (period >= 2 && period <= 4) return `${period} dni`;
		return `${period} dní`;
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent">
				<motion.div
					variants={dialogVariants as unknown as Variants}
					initial="hidden"
					animate="visible"
					exit="exit"
					className="bg-background rounded-lg shadow-lg overflow-hidden"
				>
					{reservationStep === "form" ? (
						<>
							<DialogHeader className="p-6 pb-0">
								<DialogTitle className="text-2xl font-bold flex items-center gap-2">
									<Calendar className="h-6 w-6" />
									Rezervácia knihy
								</DialogTitle>
								<DialogDescription className="pt-2">
									Vyplňte formulár pre rezerváciu knihy "
									<span className="font-semibold">{book.title}</span>"
								</DialogDescription>
							</DialogHeader>

							<div className="p-6">
								<div className="space-y-4">
									{/* Osobný údaje */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="name">
												<UserIcon className="h-4 w-4 inline mr-2" />
												Meno a priezvisko *
											</Label>
											<Input
												id="name"
												placeholder="Zadajte vaše meno"
												value={reservationData.name}
												onChange={(e) => {
													setReservationData({
														...reservationData,
														name: e.target.value,
													});
													// Clear error keď používateľ začne písať
													if (validationErrors) {
														setValidationErrors(null);
													}
												}}
												className={getFieldError("name") ? "border-red-500" : ""}
											/>
											{getFieldError("name") && (
												<p className="text-sm text-red-500 flex items-center gap-1">
													<AlertCircle className="h-3 w-3" />
													{getFieldError("name")}
												</p>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor="email">
												<Mail className="h-4 w-4 inline mr-2" />
												Email *
											</Label>
											<Input
												id="email"
												type="email"
												placeholder="vas@email.com"
												value={reservationData.email}
												onChange={(e) => {
													setReservationData({
														...reservationData,
														email: e.target.value,
													});
													if (validationErrors) {
														setValidationErrors(null);
													}
												}}
												className={getFieldError("email") ? "border-red-500" : ""}
											/>
											{getFieldError("email") && (
												<p className="text-sm text-red-500 flex items-center gap-1">
													<AlertCircle className="h-3 w-3" />
													{getFieldError("email")}
												</p>
											)}
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="phone">Telefónne číslo</Label>
										<Input
											id="phone"
											placeholder="+421 123 456 789"
											value={reservationData.phone}
											onChange={(e) => {
												setReservationData({
													...reservationData,
													phone: e.target.value,
												});
												if (validationErrors) {
													setValidationErrors(null);
												}
											}}
											className={getFieldError("phone") ? "border-red-500" : ""}
										/>
										{getFieldError("phone") && (
											<p className="text-sm text-red-500 flex items-center gap-1">
												<AlertCircle className="h-3 w-3" />
												{getFieldError("phone")}
											</p>
										)}
									</div>

									{/* Doba výpožičky */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<Label className="flex items-center gap-2">
												<Clock className="h-4 w-4" />
												Doba výpožičky
											</Label>
											<div className="flex items-center gap-2">
												<CalendarRange className="h-4 w-4 text-muted-foreground" />
												<Switch
													checked={customPeriodEnabled}
													onCheckedChange={(checked) => {
														setCustomPeriodEnabled(checked);
														if (validationErrors) {
															setValidationErrors(null);
														}
													}}
												/>
												<span className="text-sm text-muted-foreground">
													Vlastná doba
												</span>
											</div>
										</div>

										{!customPeriodEnabled ? (
											<div className="space-y-2">
												<Select
													value={reservationData.period}
													onValueChange={(value) => {
														setReservationData({
															...reservationData,
															period: value,
														});
														if (validationErrors) {
															setValidationErrors(null);
														}
													}}
												>
													<SelectTrigger className={getPeriodError() ? "border-red-500" : ""}>
														<SelectValue placeholder="Vyberte dobu výpožičky" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="1">1 deň</SelectItem>
														<SelectItem value="3">3 dni</SelectItem>
														<SelectItem value="7">7 dní (štandard)</SelectItem>
														<SelectItem value="14">14 dní</SelectItem>
														<SelectItem value="21">21 dní</SelectItem>
														<SelectItem value="30">30 dní</SelectItem>
													</SelectContent>
												</Select>
												{getPeriodError() && (
													<p className="text-sm text-red-500 flex items-center gap-1">
														<AlertCircle className="h-3 w-3" />
														{getPeriodError()}
													</p>
												)}
											</div>
										) : (
											<div className="space-y-2">
												<div className="flex items-center gap-2">
													<Input
														type="number"
														min="1"
														max="365"
														value={reservationData.customPeriod}
														onChange={(e) => {
															handleCustomPeriodChange(e.target.value);
															if (validationErrors) {
																setValidationErrors(null);
															}
														}}
														className={`flex-1 ${getPeriodError() ? "border-red-500" : ""}`}
													/>
													<span className="text-sm whitespace-nowrap">dní</span>
												</div>
												{getPeriodError() ? (
													<p className="text-sm text-red-500 flex items-center gap-1">
														<AlertCircle className="h-3 w-3" />
														{getPeriodError()}
													</p>
												) : (
													<p className="text-xs text-muted-foreground">
														Zadajte počet dní od 1 do 365
													</p>
												)}
											</div>
										)}
									</div>

									{/* Poznámka */}
									<div className="space-y-2">
										<Label htmlFor="note">Poznámka</Label>
										<Textarea
											id="note"
											placeholder="Váš komentár k rezervácii..."
											rows={3}
											value={reservationData.note}
											onChange={(e) => {
												setReservationData({
													...reservationData,
													note: e.target.value,
												});
												if (validationErrors) {
													setValidationErrors(null);
												}
											}}
											className={getFieldError("note") ? "border-red-500" : ""}
										/>
										{getFieldError("note") && (
											<p className="text-sm text-red-500 flex items-center gap-1">
												<AlertCircle className="h-3 w-3" />
												{getFieldError("note")}
											</p>
										)}
									</div>

									{/* Informácie o rezervácii */}
									<div className="bg-muted/50 p-4 rounded-lg space-y-2">
										<div className="flex justify-between">
											<span className="text-sm text-muted-foreground">
												Dostupných výtlačkov:
											</span>
											<span className="font-semibold">
												{book.availableCopies}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-muted-foreground">
												Autor:
											</span>
											<span>{book.author.name}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-muted-foreground">
												Doba rezervácie:
											</span>
											<span className="font-semibold">
												{getReservationPeriodLabel()}
												{customPeriodEnabled && (
													<span className="ml-1 text-xs text-primary">
														(vlastná)
													</span>
												)}
											</span>
										</div>
									</div>

									{/* Tlačidlá */}
									<div className="flex gap-3 pt-4">
										<Button
											variant="outline"
											className="flex-1"
											onClick={onClose}
										>
											Zrušiť
										</Button>
										<Button
											className="flex-1"
											onClick={handleReservationSubmit}
											disabled={isLoading}
										>
											{isLoading ? (
												<>
													<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
													Spracúvam...
												</>
											) : (
												"Potvrdiť rezerváciu"
											)}
										</Button>
									</div>
								</div>
							</div>
						</>
					) : (
						// Úspešná rezervácia
						<motion.div
							variants={successVariants as unknown as Variants}
							initial="hidden"
							animate="visible"
							className="p-8 text-center"
						>
							<motion.div
								animate={{
									scale: [1, 1.2, 1],
									rotate: [0, 10, -10, 0],
								}}
								transition={{
									duration: 0.5,
									times: [0, 0.5, 0.8, 1],
								}}
								className="mb-4"
							>
								<CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
							</motion.div>

							<DialogTitle className="text-2xl font-bold mb-2">
								Rezervácia bola úspešná!
							</DialogTitle>

							<DialogDescription className="mb-6">
								Kniha "
								<span className="font-semibold">{book.title}</span>" bola
								rezervovaná na vaše meno.
							</DialogDescription>

							<div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
								<div className="text-left space-y-2">
									<p className="text-sm text-green-800">
										<strong>Doba výpožičky:</strong>{" "}
										{getReservationPeriodLabel()}
										{customPeriodEnabled && " (vlastná)"}
									</p>
									<p className="text-sm text-green-800">
										<strong>Email:</strong> {reservationData.email}
									</p>
									<p className="text-sm text-green-800">
										<strong>Meno:</strong> {reservationData.name}
									</p>
									{reservationData.phone && (
										<p className="text-sm text-green-800">
											<strong>Telefón:</strong> {reservationData.phone}
										</p>
									)}
								</div>
								<p className="text-xs text-green-600 mt-3">
									Potvrdenie o rezervácii bolo odoslané na email. Rezerváciu si
									môžete vyzdvihnúť v priebehu 24 hodín.
								</p>
							</div>

							<Button variant="outline" onClick={onClose} className="w-full">
								Pokračovať
							</Button>
						</motion.div>
					)}
				</motion.div>
			</DialogContent>
		</Dialog>
	);
}