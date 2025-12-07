"use client";

import { FC, useState } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import { useBorrows } from "@/lib/hooks/useBorrows";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Calendar,
	Edit2,
	Save,
	X,
} from "lucide-react";
import BorrowHistory from "./BorrowHistory";
import UserStats from "./UserStats";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { sk } from "date-fns/locale";

const UserProfile: FC = () => {
	const { user, updateProfile } = useAuth();
	const { borrows, returnBook, isLoading } = useBorrows();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		fullName: user?.fullName || "",
		phone: user?.phone || "",
		address: user?.address || "",
		avatar: user?.avatar || "",
	});

	if (!user) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card>
					<CardContent className="p-12 text-center">
						<p className="text-muted-foreground">Musíte byť prihlásený</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const handleSave = async () => {
		try {
			await updateProfile(formData);
			setIsEditing(false);
		} catch (error) {
			console.error("Error updating profile:", error);
		}
	};

	const handleCancel = () => {
		setFormData({
			fullName: user.fullName,
			phone: user.phone || "",
			address: user.address || "",
			avatar: user.avatar || "",
		});
		setIsEditing(false);
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-6"
			>
				{/* Profile Header */}
				<Card>
					<CardContent className="p-6">
						<div className="flex flex-col md:flex-row items-start md:items-center gap-6">
							<Avatar className="h-24 w-24">
								<AvatarImage src={user.avatar} alt={user.fullName} />
								<AvatarFallback className="text-2xl">
									{getInitials(user.fullName)}
								</AvatarFallback>
							</Avatar>

							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									<h1 className="text-3xl font-bold">{user.fullName}</h1>
									{user.role === "admin" && (
										<Badge variant="default">Admin</Badge>
									)}
								</div>
								<p className="text-muted-foreground mb-4">{user.email}</p>
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Calendar className="h-4 w-4" />
									<span>
										Člen od{" "}
										{formatDistanceToNow(new Date(user.memberSince), {
											addSuffix: true,
											locale: sk,
										})}
									</span>
								</div>
							</div>

							{!isEditing && (
								<Button onClick={() => setIsEditing(true)} variant="outline">
									<Edit2 className="h-4 w-4 mr-2" />
									Upraviť profil
								</Button>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Statistics */}
				<UserStats borrows={borrows} />

				{/* Tabs */}
				<Tabs defaultValue="info" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="info">Informácie</TabsTrigger>
						<TabsTrigger value="history">História výpožičiek</TabsTrigger>
					</TabsList>

					<TabsContent value="info" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Osobné informácie</CardTitle>
								<CardDescription>
									Vaše kontaktné údaje a nastavenia účtu
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<label className="text-sm font-medium flex items-center gap-2">
										<User className="h-4 w-4" />
										Celé meno
									</label>
									{isEditing ? (
										<Input
											value={formData.fullName}
											onChange={(e) =>
												setFormData({ ...formData, fullName: e.target.value })
											}
										/>
									) : (
										<p className="text-muted-foreground">{user.fullName}</p>
									)}
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium flex items-center gap-2">
										<Mail className="h-4 w-4" />
										Email
									</label>
									<p className="text-muted-foreground">{user.email}</p>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium flex items-center gap-2">
										<Phone className="h-4 w-4" />
										Telefón
									</label>
									{isEditing ? (
										<Input
											value={formData.phone}
											onChange={(e) =>
												setFormData({ ...formData, phone: e.target.value })
											}
											placeholder="+421 900 123 456"
										/>
									) : (
										<p className="text-muted-foreground">
											{user.phone || "Neuvedené"}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium flex items-center gap-2">
										<User className="h-4 w-4" />
										Avatar URL
									</label>
									{isEditing ? (
										<Input
											value={formData.avatar}
											onChange={(e) =>
												setFormData({ ...formData, avatar: e.target.value })
											}
											placeholder="https://example.com/avatar.jpg"
										/>
									) : (
										<p className="text-muted-foreground">
											{user.avatar || "Neuvedené"}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium flex items-center gap-2">
										<MapPin className="h-4 w-4" />
										Adresa
									</label>
									{isEditing ? (
										<Input
											value={formData.address}
											onChange={(e) =>
												setFormData({ ...formData, address: e.target.value })
											}
											placeholder="Mesto, Slovensko"
										/>
									) : (
										<p className="text-muted-foreground">
											{user.address || "Neuvedené"}
										</p>
									)}
								</div>

								{isEditing && (
									<div className="flex gap-2 pt-4">
										<Button onClick={handleSave}>
											<Save className="h-4 w-4 mr-2" />
											Uložiť
										</Button>
										<Button onClick={handleCancel} variant="outline">
											<X className="h-4 w-4 mr-2" />
											Zrušiť
										</Button>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="history" className="mt-6">
						<BorrowHistory borrows={borrows} onReturn={returnBook} />
					</TabsContent>
				</Tabs>
			</motion.div>
		</div>
	);
};

export default UserProfile;
