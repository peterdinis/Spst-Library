import { FC, useState } from "react";
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
	EyeOff,
	MoreVertical,
	Sparkles,
	CheckCircle,
	AlertTriangle,
	Zap,
	DollarSign,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/lib/auth-context";

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
	const isRead = !!notification.readAt;

	const handleMarkAsRead = () => {
		if (!isRead) {
			onMarkAsRead(notification.id);
		}
	};

	return (
		<div
			className={cn(
				"group relative p-4 rounded-2xl border transition-all duration-300",
				"hover:shadow-lg hover:scale-[1.01] hover:border-primary/20",
				!isRead
					? "bg-linear-to-br from-blue-50/50 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/10 border-blue-200/50 dark:border-blue-800/30"
					: "bg-linear-to-br from-gray-50/80 to-slate-50/50 dark:from-gray-900/50 dark:to-slate-900/30 border-gray-200/50 dark:border-gray-800/30",
				notification.priority === "high" &&
					"ring-2 ring-red-400/20 dark:ring-red-500/20 border-red-300 dark:border-red-900/50",
				notification.status === "failed" && "border-destructive/40",
			)}
		>
			{notification.priority === "high" && (
				<div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-red-500 to-orange-500 rounded-l-2xl" />
			)}

			<div className="flex items-start gap-4">
				<div
					className={cn(
						"relative flex items-center justify-center h-11 w-11 rounded-xl",
						"bg-linear-to-br shadow-sm transition-transform duration-300",
						"group-hover:scale-110",
						!isRead && "animate-pulse-slow",
						notification.type === "borrow_due" &&
							"from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/20",
						notification.type === "fine_issued" &&
							"from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/20",
						notification.type === "membership_expiry" &&
							"from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/20",
						notification.type === "reservation_ready" &&
							"from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20",
						notification.type === "system" &&
							"from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/20",
						notification.type === "promotional" &&
							"from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/20",
					)}
				>
					{getNotificationIcon(notification.type)}
				</div>

				<div className="flex-1 min-w-0 space-y-3">
					<div className="flex items-start justify-between gap-3">
						<div className="flex flex-col gap-1.5">
							<div className="flex items-center gap-2 flex-wrap">
								<h4
									className={cn(
										"font-bold text-base",
										isRead ? "text-muted-foreground" : "text-foreground",
									)}
								>
									{notification.title}
								</h4>
								{notification.priority === "high" && (
									<Badge
										variant="destructive"
										className="h-6 px-2 text-[10px] font-semibold shadow-sm"
									>
										<AlertTriangle className="h-3 w-3 mr-1" />
										Urgentné
									</Badge>
								)}
							</div>
							<span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
								<Clock className="h-3 w-3" />
								{formatTimeAgo(notification.createdAt)}
							</span>
						</div>
					</div>

					<p
						className={cn(
							"text-sm leading-relaxed",
							isRead ? "text-muted-foreground/70" : "text-muted-foreground",
						)}
					>
						{notification.message}
					</p>

					<div className="flex flex-wrap gap-2">
						{notification.data?.bookTitle && (
							<Badge
								variant="outline"
								className="text-xs px-2.5 py-1 bg-blue-50/50 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-800/30 font-medium"
							>
								<BookOpen className="h-3 w-3 mr-1.5" />
								{notification.data.bookTitle}
							</Badge>
						)}
						{notification.data?.fineAmount && (
							<Badge
								variant="destructive"
								className="text-xs px-2.5 py-1 shadow-sm font-semibold"
							>
								<DollarSign className="h-3 w-3 mr-1" />
								{notification.data.fineAmount} €
							</Badge>
						)}
						{notification.data?.daysRemaining !== undefined && (
							<Badge
								variant="secondary"
								className="text-xs px-2.5 py-1 bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100 border-amber-200/50 dark:border-amber-800/30 font-medium"
							>
								<Clock className="h-3 w-3 mr-1.5" />
								{notification.data.daysRemaining} dní zostáva
							</Badge>
						)}
					</div>

					<div className="flex items-center justify-between pt-2 border-t border-border/40">
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 font-medium px-2 py-1 rounded-md bg-muted/30">
								{getChannelIcon(notification.channel)}
								<span className="capitalize">
									{notification.channel.replace("_", " ")}
								</span>
							</div>

							{notification.status === "failed" && (
								<Badge
									variant="destructive"
									className="text-xs px-2 py-0.5 shadow-sm"
								>
									<AlertCircle className="h-3 w-3 mr-1" />
									Zlyhalo odoslanie
								</Badge>
							)}
						</div>

						<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 rounded-lg hover:bg-destructive/15 hover:text-destructive transition-all duration-200"
											onClick={() => onDelete(notification.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="top" className="text-xs">
										Vymazať notifikáciu
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 rounded-lg hover:bg-primary/15 hover:text-primary transition-all duration-200"
											onClick={handleMarkAsRead}
										>
											{isRead ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<CheckCircle className="h-4 w-4" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent side="top" className="text-xs">
										{isRead ? "Prečítané" : "Označiť ako prečítané"}
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

interface NotificationDropdownProps {
	className?: string;
}

export const NotificationDropdown: FC<NotificationDropdownProps> = ({
	className,
}) => {
	const { user } = useAuth();
	const convexNotifications = useQuery(
		api.notifications.getUserNotifications,
		user?._id ? { userId: user._id } : "skip",
	);

	const markAsReadMutation = useMutation(api.notifications.markAsRead);
	const markAllAsReadMutation = useMutation(api.notifications.markAllAsRead);
	const deleteMutation = useMutation(api.notifications.remove);

	const [isOpen, setIsOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("all");
	const [isExpanded, setIsExpanded] = useState(false);

	if (!convexNotifications) return null;

	const notifications: Notification[] = convexNotifications.map((n) => ({
		id: n._id,
		type: n.type as NotificationType,
		title: n.title,
		message: n.message,
		data: n.data,
		channel: n.channel as any,
		status: n.status as any,
		sentAt: n.sentAt,
		readAt: n.readAt,
		createdAt: n.createdAt,
		priority: n.priority as any,
	}));

	const unreadCount = notifications.filter((n) => !n.readAt).length;
	const highPriorityCount = notifications.filter(
		(n) => n.priority === "high",
	).length;

	const filteredNotifications = notifications.filter((notification) => {
		if (activeTab === "unread") return !notification.readAt;
		if (activeTab === "high") return notification.priority === "high";
		return true;
	});

	const sortedNotifications = [...filteredNotifications].sort(
		(a, b) => b.createdAt - a.createdAt,
	);

	const markAllAsRead = async () => {
		if (user?._id) {
			await markAllAsReadMutation({ userId: user._id });
		}
	};

	const markAsRead = async (id: string) => {
		await markAsReadMutation({ notificationId: id as any });
	};

	const deleteNotification = async (id: string) => {
		await deleteMutation({ notificationId: id as any });
	};

	const deleteAllNotifications = () => {
		// No direct bulk delete in API, could iterate or add to API
		// For now just console log or skip if not in API
		console.log("Delete all not implemented in API yet");
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
						"p-0 w-120 border-border/40 bg-linear-to-b from-background via-background to-muted/20 backdrop-blur-xl shadow-2xl",
						"max-h-[85vh] overflow-hidden flex flex-col rounded-2xl",
						isExpanded && "w-160",
					)}
					sideOffset={12}
					collisionPadding={16}
				>
					<div className="sticky top-0 z-50 bg-linear-to-b from-background to-background/95 backdrop-blur-xl border-b border-border/50 p-5">
						<div className="flex items-center justify-between mb-5">
							<div>
								<div className="flex items-center gap-2.5">
									<div className="p-2 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl">
										<Bell className="h-5 w-5 text-white" />
									</div>
									<h3 className="font-bold text-xl bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
										Notifikácie
									</h3>
								</div>
								<div className="flex items-center gap-3 mt-2.5 text-sm">
									<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-medium">
										<div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
										{unreadCount} neprečítaných
									</div>
									{highPriorityCount > 0 && (
										<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 font-medium">
											<AlertTriangle className="h-3 w-3" />
											{highPriorityCount} urgentných
										</div>
									)}
								</div>
							</div>

							<div className="flex items-center gap-2">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											size="icon"
											className="h-9 w-9 rounded-xl border-border/50 hover:bg-accent/50 hover:border-primary/30 transition-all duration-200"
										>
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-56 rounded-xl">
										<DropdownMenuItem
											onClick={markAllAsRead}
											disabled={unreadCount === 0}
											className="rounded-lg"
										>
											<CheckCircle className="h-4 w-4 mr-2" />
											Označiť všetky ako prečítané
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-destructive rounded-lg"
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

						<Tabs
							value={activeTab}
							onValueChange={(value) => {
								setActiveTab(value);
							}}
							className="w-full"
						>
							<TabsList className="grid grid-cols-3 w-full h-10 bg-muted/40 p-1 rounded-xl">
								<TabsTrigger
									value="all"
									className="text-xs font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
								>
									<span className="mr-1.5">Všetky</span>
									<Badge
										variant="secondary"
										className="h-5 px-1.5 text-[10px] font-semibold bg-muted"
									>
										{notifications.length}
									</Badge>
								</TabsTrigger>
								<TabsTrigger
									value="unread"
									className="text-xs font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
								>
									<span className="mr-1.5">Nové</span>
									{unreadCount > 0 && (
										<Badge
											variant="default"
											className="h-5 px-1.5 text-[10px] font-semibold bg-blue-500 animate-pulse"
										>
											{unreadCount}
										</Badge>
									)}
								</TabsTrigger>
								<TabsTrigger
									value="high"
									className="text-xs font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
								>
									<span className="mr-1.5">Urgentné</span>
									{highPriorityCount > 0 && (
										<Badge
											variant="destructive"
											className="h-5 px-1.5 text-[10px] font-semibold shadow-sm"
										>
											{highPriorityCount}
										</Badge>
									)}
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					<div className="flex-1 overflow-hidden min-h-0">
						{sortedNotifications.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-16 text-center">
								<div className="p-4 bg-linear-to-br from-muted/50 to-muted/30 rounded-2xl mb-6">
									<Bell className="h-16 w-16 text-muted-foreground/50" />
								</div>
								<h4 className="font-bold text-xl mb-2">Žiadne notifikácie</h4>
								<p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
									Nemáte žiadne notifikácie v tejto kategórii. Keď príde niečo
									nové, uvidíte to tu.
								</p>
							</div>
						) : (
							<ScrollArea className="h-112.5">
								<div className="p-5 space-y-3">
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

					{sortedNotifications.length > 0 && (
						<div className="sticky bottom-0 border-t border-border/50 bg-linear-to-t from-background to-background/95 backdrop-blur-xl p-4">
							<div className="flex items-center justify-between">
								<Button
									variant="ghost"
									className="text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200"
									onClick={() => console.log("View all")}
									size="sm"
								>
									Zobraziť všetky notifikácie
									<ChevronRight className="h-4 w-4 ml-2" />
								</Button>

								<Button
									variant="outline"
									size="sm"
									className="rounded-xl border-border/50 hover:bg-accent/50 hover:border-primary/30 transition-all duration-200"
									onClick={() => setIsExpanded(!isExpanded)}
								>
									{isExpanded ? (
										<>
											<ChevronUp className="h-4 w-4 mr-2" />
											Zbaliť panel
										</>
									) : (
										<>
											<ChevronDown className="h-4 w-4 mr-2" />
											Rozbaliť panel
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

export default NotificationDropdown;
