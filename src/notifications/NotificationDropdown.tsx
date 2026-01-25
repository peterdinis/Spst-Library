"use client";

import React, { useState, useEffect, useRef } from "react";
import {
	Bell,
	Clock,
	AlertCircle,
	BookOpen,
	CreditCard,
	Mail,
	MessageSquare,
	Settings,
	Trash2,
	ChevronRight,
	Eye,
	EyeOff,
	MoreVertical,
	Sparkles,
	CheckCircle,
	AlertTriangle,
	Info,
	Zap,
	Calendar,
	DollarSign,
	User,
	Shield,
	Download,
	Upload,
	Save,
	HelpCircle,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export type NotificationType =
	| "borrow_due"
	| "reservation_ready"
	| "fine_issued"
	| "membership_expiry"
	| "system"
	| "promotional";

export interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	data?: {
		bookTitle?: string;
		fineAmount?: number;
		daysRemaining?: number;
	};
	channel: "email" | "sms" | "push" | "in_app";
	status: "pending" | "sent" | "delivered" | "read" | "failed";
	sentAt?: number;
	readAt?: number;
	createdAt: number;
	priority?: "low" | "medium" | "high";
}

// Mock data - upravené podľa obrázka
const mockNotifications: Notification[] = [
	{
		id: "6",
		type: "promotional",
		title: "Vianočná akcia",
		message: "Počas vianočných sviatkov máme 20% zľavu na nové knihy!",
		channel: "in_app",
		status: "delivered",
		createdAt: Date.now() - 5 * 60 * 1000,
		sentAt: Date.now() - 5 * 60 * 1000,
		priority: "low",
	},
	{
		id: "7",
		type: "fine_issued",
		title: "Pokuta za poškodenie knihy",
		message: "Máte pokutu 5.00 € za poškodenie knihy 'Design Patterns'.",
		data: {
			bookTitle: "Design Patterns",
			fineAmount: 5.0,
		},
		channel: "in_app",
		status: "failed",
		createdAt: Date.now() - 10 * 60 * 1000,
		sentAt: Date.now() - 10 * 60 * 1000,
		priority: "high",
	},
	{
		id: "8",
		type: "borrow_due",
		title: "Dve knihy blížiace sa k splatnosti",
		message:
			"Knihy 'React Patterns' a 'TypeScript Handbook' majú splatnosť zajtra.",
		data: {
			bookTitle: "React Patterns & TypeScript Handbook",
			daysRemaining: 1,
		},
		channel: "push",
		status: "delivered",
		createdAt: Date.now() - 15 * 60 * 1000,
		sentAt: Date.now() - 15 * 60 * 1000,
		priority: "high",
	},
	{
		id: "1",
		type: "borrow_due",
		title: "Kniha sa blíži k dátumu splatnosti",
		message:
			"Kniha 'JavaScript: The Good Parts' má dátum splatnosti 15.12.2024. Zostáva 3 dni.",
		data: {
			bookTitle: "JavaScript: The Good Parts",
			daysRemaining: 3,
		},
		channel: "in_app",
		status: "delivered",
		createdAt: Date.now() - 2 * 60 * 60 * 1000,
		sentAt: Date.now() - 2 * 60 * 60 * 1000,
		priority: "high",
	},
	{
		id: "2",
		type: "fine_issued",
		title: "Nová pokuta",
		message: "Máte novú pokutu vo výške 2.50 € za knihu 'Clean Code'.",
		data: {
			bookTitle: "Clean Code",
			fineAmount: 2.5,
		},
		channel: "email",
		status: "read",
		createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
		sentAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
		readAt: Date.now() - 12 * 60 * 60 * 1000,
		priority: "medium",
	},
	{
		id: "3",
		type: "system",
		title: "Nové funkcie v knižnici",
		message:
			"Pridali sme nové funkcie: rezervácie online, elektronické knihy a viac.",
		channel: "in_app",
		status: "delivered",
		createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
		sentAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
		readAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
		priority: "low",
	},
	{
		id: "4",
		type: "membership_expiry",
		title: "Členstvo expiruje čoskoro",
		message: "Vaše členstvo v knižnici expiruje 31.12.2024. Zostáva 15 dní.",
		data: {
			daysRemaining: 15,
		},
		channel: "email",
		status: "sent",
		createdAt: Date.now() - 6 * 60 * 60 * 1000,
		sentAt: Date.now() - 6 * 60 * 60 * 1000,
		priority: "high",
	},
	{
		id: "5",
		type: "reservation_ready",
		title: "Rezervácia pripravená na vyzdvihnutie",
		message: "Kniha 'The Pragmatic Programmer' je pripravená na vyzdvihnutie.",
		data: {
			bookTitle: "The Pragmatic Programmer",
		},
		channel: "sms",
		status: "delivered",
		createdAt: Date.now() - 30 * 60 * 1000,
		sentAt: Date.now() - 30 * 60 * 1000,
		priority: "medium",
	},
];

// Utility functions
const getNotificationIcon = (type: NotificationType) => {
	const baseClasses = "h-4 w-4";
	switch (type) {
		case "borrow_due":
			return <Clock className={`${baseClasses} text-amber-500`} />;
		case "fine_issued":
			return <AlertCircle className={`${baseClasses} text-red-500`} />;
		case "membership_expiry":
			return <CreditCard className={`${baseClasses} text-purple-500`} />;
		case "reservation_ready":
			return <BookOpen className={`${baseClasses} text-green-500`} />;
		case "system":
			return <Settings className={`${baseClasses} text-blue-500`} />;
		case "promotional":
			return <Sparkles className={`${baseClasses} text-pink-500`} />;
		default:
			return <Bell className={`${baseClasses} text-gray-500`} />;
	}
};

const getPriorityIcon = (priority: "low" | "medium" | "high") => {
	switch (priority) {
		case "high":
			return <AlertTriangle className="h-3 w-3 text-red-500" />;
		case "medium":
			return <AlertCircle className="h-3 w-3 text-amber-500" />;
		case "low":
			return <Info className="h-3 w-3 text-blue-500" />;
	}
};

const getChannelIcon = (channel: string) => {
	switch (channel) {
		case "email":
			return <Mail className="h-3 w-3" />;
		case "sms":
			return <MessageSquare className="h-3 w-3" />;
		case "push":
			return <Bell className="h-3 w-3" />;
		case "in_app":
			return <Zap className="h-3 w-3" />;
		default:
			return <Zap className="h-3 w-3" />;
	}
};

const formatTimeAgo = (timestamp: number) => {
	const now = Date.now();
	const diff = now - timestamp;

	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) return `Pred ${days} dň${days === 1 ? "om" : "ami"}`;
	if (hours > 0) return `Pred ${hours} hod${hours === 1 ? "inou" : "inami"}`;
	if (minutes > 0)
		return `Pred ${minutes} min${minutes === 1 ? "útou" : "útami"}`;
	return "Teraz";
};

// Notification Item Component
interface NotificationItemProps {
	notification: Notification;
	onMarkAsRead: (id: string) => void;
	onDelete: (id: string) => void;
}

const NotificationItem = ({
	notification,
	onMarkAsRead,
	onDelete,
}: NotificationItemProps) => {
	const [isRead, setIsRead] = useState(!!notification.readAt);

	const handleMarkAsRead = () => {
		if (!isRead) {
			setIsRead(true);
			onMarkAsRead(notification.id);
		}
	};

	return (
		<div
			className={cn(
				"p-4 rounded-xl border transition-all duration-200 hover:bg-accent/5",
				!isRead
					? "bg-white dark:bg-gray-900"
					: "bg-gray-50/50 dark:bg-gray-900/50",
				notification.priority === "high" &&
					"border-red-200 dark:border-red-900/30",
				notification.priority === "medium" &&
					"border-amber-200 dark:border-amber-900/30",
				notification.status === "failed" && "border-destructive/20",
			)}
		>
			<div className="flex items-start gap-3">
				<div className={cn("relative mt-0.5", !isRead && "animate-pulse-slow")}>
					{getNotificationIcon(notification.type)}
				</div>

				<div className="flex-1 min-w-0 space-y-2">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-2">
							<h4
								className={cn(
									"font-semibold text-sm truncate",
									isRead ? "text-muted-foreground" : "text-foreground",
								)}
							>
								{notification.title}
							</h4>
							{notification.priority && notification.priority === "high" && (
								<Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
									<AlertTriangle className="h-2.5 w-2.5 mr-1" />
									Vysoká
								</Badge>
							)}
						</div>
						<span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
							{formatTimeAgo(notification.createdAt)}
						</span>
					</div>

					<p
						className={cn(
							"text-sm leading-relaxed",
							isRead ? "text-muted-foreground/80" : "text-muted-foreground",
						)}
					>
						{notification.message}
					</p>

					{/* Metadata chips */}
					<div className="flex flex-wrap gap-1.5">
						{notification.data?.bookTitle && (
							<Badge
								variant="outline"
								className="text-xs px-2 py-0.5 bg-background/50"
							>
								<BookOpen className="h-2.5 w-2.5 mr-1" />
								{notification.data.bookTitle}
							</Badge>
						)}
						{notification.data?.fineAmount && (
							<Badge variant="destructive" className="text-xs px-2 py-0.5">
								<DollarSign className="h-2.5 w-2.5 mr-1" />
								{notification.data.fineAmount} €
							</Badge>
						)}
						{notification.data?.daysRemaining !== undefined && (
							<Badge variant="secondary" className="text-xs px-2 py-0.5">
								<Clock className="h-2.5 w-2.5 mr-1" />
								{notification.data.daysRemaining} dní
							</Badge>
						)}
					</div>

					{/* Footer */}
					<div className="flex items-center justify-between pt-1">
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-1 text-xs text-muted-foreground/70">
								{getChannelIcon(notification.channel)}
								<span className="capitalize">
									{notification.channel.replace("_", " ")}
								</span>
							</div>

							{notification.status === "failed" && (
								<Badge variant="destructive" className="text-xs px-2 py-0">
									<AlertCircle className="h-2.5 w-2.5 mr-1" />
									Chyba
								</Badge>
							)}
						</div>

						<div className="flex items-center gap-1">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
											onClick={() => onDelete(notification.id)}
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="top">
										<p className="text-xs">Vymazať</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary"
											onClick={handleMarkAsRead}
										>
											{isRead ? (
												<EyeOff className="h-3.5 w-3.5" />
											) : (
												<Eye className="h-3.5 w-3.5" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent side="top">
										<p className="text-xs">
											{isRead
												? "Označiť ako neprečítané"
												: "Označiť ako prečítané"}
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// Main Component
interface NotificationDropdownProps {
	className?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
	className,
}) => {
	const [notifications, setNotifications] =
		useState<Notification[]>(mockNotifications);
	const [isOpen, setIsOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("all");
	const [showSettings, setShowSettings] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);

	const unreadCount = notifications.filter((n) => !n.readAt).length;
	const highPriorityCount = notifications.filter(
		(n) => n.priority === "high",
	).length;

	// Filter notifications based on active tab
	const filteredNotifications = notifications.filter((notification) => {
		if (activeTab === "unread") return !notification.readAt;
		if (activeTab === "high") return notification.priority === "high";
		return true;
	});

	// Sort - newest first
	const sortedNotifications = [...filteredNotifications].sort(
		(a, b) => b.createdAt - a.createdAt,
	);

	// Mark all as read
	const markAllAsRead = () => {
		setNotifications((prev) =>
			prev.map((notification) => ({
				...notification,
				readAt: notification.readAt || Date.now(),
			})),
		);
	};

	// Mark single as read
	const markAsRead = (id: string) => {
		setNotifications((prev) =>
			prev.map((notification) =>
				notification.id === id
					? { ...notification, readAt: Date.now() }
					: notification,
			),
		);
	};

	// Delete notification
	const deleteNotification = (id: string) => {
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id),
		);
	};

	// Delete all notifications
	const deleteAllNotifications = () => {
		setNotifications([]);
	};

	return (
		<div className={cn("relative", className)}>
			<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"relative h-10 w-10 rounded-lg",
							"hover:bg-accent hover:text-accent-foreground",
							unreadCount > 0 && "animate-pulse-slow",
						)}
					>
						<Bell className="h-5 w-5" />
						{unreadCount > 0 && (
							<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
								{unreadCount > 9 ? "9+" : unreadCount}
							</span>
						)}
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					align="end"
					className={cn(
						"p-0 w-[440px] border-border/50 bg-background/95 backdrop-blur-md",
						"max-h-[85vh] overflow-hidden flex flex-col",
						isExpanded && "w-[600px]",
					)}
					sideOffset={8}
					collisionPadding={16}
				>
					{/* Header */}
					<div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b p-4">
						<div className="flex items-center justify-between mb-4">
							<div>
								<h3 className="font-bold text-lg">Notifikácie</h3>
								<div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
									<span>{unreadCount} neprečítaných</span>
									{highPriorityCount > 0 && (
										<>
											<span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
											<span>{highPriorityCount} vysoká priorita</span>
										</>
									)}
								</div>
							</div>

							<div className="flex items-center gap-2">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" size="icon" className="h-8 w-8">
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											onClick={markAllAsRead}
											disabled={unreadCount === 0}
										>
											<CheckCircle className="h-4 w-4 mr-2" />
											Označiť všetky ako prečítané
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => setShowSettings(!showSettings)}
										>
											<Settings className="h-4 w-4 mr-2" />
											Nastavenia
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-destructive"
											onClick={deleteAllNotifications}
											disabled={notifications.length === 0}
										>
											<Trash2 className="h-4 w-4 mr-2" />
											Vymazať všetky
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>

						{/* Tabs */}
						<Tabs
							value={showSettings ? "settings" : activeTab}
							onValueChange={(value) => {
								if (value === "settings") {
									setShowSettings(true);
								} else {
									setShowSettings(false);
									setActiveTab(value);
								}
							}}
							className="w-full"
						>
							<TabsList className="grid grid-cols-4 w-full h-9">
								<TabsTrigger value="all" className="text-xs">
									Všetky
									<Badge
										variant="secondary"
										className="ml-1.5 h-5 w-5 p-0 text-[10px]"
									>
										{notifications.length}
									</Badge>
								</TabsTrigger>
								<TabsTrigger value="unread" className="text-xs">
									Neprečítané
									{unreadCount > 0 && (
										<Badge
											variant="default"
											className="ml-1.5 h-5 w-5 p-0 text-[10px] bg-blue-500"
										>
											{unreadCount}
										</Badge>
									)}
								</TabsTrigger>
								<TabsTrigger value="high" className="text-xs">
									Vysoká
									{highPriorityCount > 0 && (
										<Badge
											variant="destructive"
											className="ml-1.5 h-5 w-5 p-0 text-[10px]"
										>
											{highPriorityCount}
										</Badge>
									)}
								</TabsTrigger>
								<TabsTrigger value="settings" className="text-xs">
									<Settings className="h-4 w-4" />
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					{/* Content - ZABEZPEČENÉ aby nevyšlo von */}
					<div className="flex-1 overflow-hidden min-h-0">
						{showSettings ? (
							<ScrollArea className="h-[400px]">
								<div className="p-4 space-y-6">
									<div className="space-y-4">
										<h4 className="font-semibold">Nastavenia notifikácií</h4>
										<div className="space-y-3">
											{["email", "sms", "push", "in_app"].map((channel) => (
												<div
													key={channel}
													className="flex items-center justify-between"
												>
													<Label className="capitalize">{channel}</Label>
													<Switch />
												</div>
											))}
										</div>
									</div>
									<Separator />
									<div className="space-y-3">
										{[
											"borrow_due",
											"fine_issued",
											"membership_expiry",
											"reservation_ready",
											"promotional",
										].map((type) => (
											<div
												key={type}
												className="flex items-center justify-between"
											>
												<Label className="capitalize">
													{type.replace("_", " ")}
												</Label>
												<Switch defaultChecked />
											</div>
										))}
									</div>
								</div>
							</ScrollArea>
						) : sortedNotifications.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
								<h4 className="font-semibold text-lg mb-2">
									Žiadne notifikácie
								</h4>
								<p className="text-sm text-muted-foreground max-w-xs">
									Nemáte žiadne notifikácie v tejto kategórii
								</p>
							</div>
						) : (
							<ScrollArea className="h-[400px]">
								<div className="p-4 space-y-3">
									{sortedNotifications.map((notification) => (
										<NotificationItem
											key={notification.id}
											notification={notification}
											onMarkAsRead={markAsRead}
											onDelete={deleteNotification}
										/>
									))}
								</div>
							</ScrollArea>
						)}
					</div>

					{/* Footer */}
					{!showSettings && sortedNotifications.length > 0 && (
						<div className="sticky bottom-0 border-t bg-background/95 backdrop-blur-sm p-3">
							<div className="flex items-center justify-between">
								<Button
									variant="ghost"
									className="text-sm"
									onClick={() => console.log("View all")}
									size="sm"
								>
									Zobraziť všetky
									<ChevronRight className="h-4 w-4 ml-2" />
								</Button>

								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsExpanded(!isExpanded)}
								>
									{isExpanded ? (
										<>
											<ChevronUp className="h-4 w-4 mr-2" />
											Zbaliť
										</>
									) : (
										<>
											<ChevronDown className="h-4 w-4 mr-2" />
											Rozbaliť
										</>
									)}
								</Button>
							</div>
						</div>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
