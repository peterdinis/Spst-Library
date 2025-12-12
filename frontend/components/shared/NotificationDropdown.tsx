"use client";

import { FC } from "react";
import {
	Bell,
	BookOpen,
	RotateCcw,
	AlertCircle,
	Clock,
	Info,
	Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { sk } from "date-fns/locale";
import { useNotifications } from "@/hooks/useNotifications";

const NotificationDropdown: FC = () => {
	const { notifications, unreadCount, markAsRead, markAllAsRead } =
		useNotifications();

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case "borrow":
				return <BookOpen className="h-4 w-4 text-blue-600" />;
			case "return":
				return <RotateCcw className="h-4 w-4 text-green-600" />;
			case "overdue":
				return <AlertCircle className="h-4 w-4 text-red-600" />;
			case "reminder":
				return <Clock className="h-4 w-4 text-orange-600" />;
			case "system":
				return <Info className="h-4 w-4 text-purple-600" />;
			default:
				return <Bell className="h-4 w-4" />;
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
						>
							{unreadCount > 9 ? "9+" : unreadCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<DropdownMenuLabel className="flex items-center justify-between">
					<span>Notifikácie</span>
					{unreadCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={markAllAsRead}
							className="h-auto p-1 text-xs"
						>
							<Check className="h-3 w-3 mr-1" />
							Označiť všetky
						</Button>
					)}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{notifications.length === 0 ? (
					<div className="p-4 text-center text-sm text-muted-foreground">
						Žiadne notifikácie
					</div>
				) : (
					<div className="max-h-[400px] overflow-y-auto">
						{notifications.map((notification) => (
							<DropdownMenuItem
								key={notification.id}
								className={`flex flex-col items-start gap-2 p-3 cursor-pointer ${
									!notification.read ? "bg-muted/50" : ""
								}`}
								onClick={() =>
									!notification.read && markAsRead(notification.id)
								}
							>
								<div className="flex items-start gap-2 w-full">
									<div className="mt-0.5">
										{getNotificationIcon(notification.type)}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between gap-2">
											<p className="font-medium text-sm leading-tight">
												{notification.title}
											</p>
											{!notification.read && (
												<div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
											)}
										</div>
										<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
											{notification.message}
										</p>
										<p className="text-xs text-muted-foreground mt-1">
											{formatDistanceToNow(new Date(notification.createdAt), {
												addSuffix: true,
												locale: sk,
											})}
										</p>
									</div>
								</div>
							</DropdownMenuItem>
						))}
					</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default NotificationDropdown;
