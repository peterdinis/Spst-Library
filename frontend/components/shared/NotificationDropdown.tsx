"use client";

import { FC, useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, BookOpen, RotateCcw, AlertCircle, Clock, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/providers/AuthContext';
import { mockNotificationsApi } from '@/lib/mockApi';
import { Notification } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { sk } from 'date-fns/locale';

const NotificationDropdown: FC = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (user) {
            loadNotifications();
        }
    }, [user]);

    const loadNotifications = async () => {
        if (!user) return;

        try {
            const userNotifications = await mockNotificationsApi.getUserNotifications(user.id);
            setNotifications(userNotifications);
            setUnreadCount(userNotifications.filter(n => !n.read).length);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await mockNotificationsApi.markAsRead(notificationId);
            await loadNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!user) return;

        try {
            await mockNotificationsApi.markAllAsRead(user.id);
            await loadNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'borrow':
                return <BookOpen className="h-4 w-4 text-blue-500" />;
            case 'return':
                return <RotateCcw className="h-4 w-4 text-green-500" />;
            case 'overdue':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            case 'reminder':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'system':
                return <Info className="h-4 w-4 text-gray-500" />;
            default:
                return <Bell className="h-4 w-4" />;
        }
    };

    if (!user) return null;

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1"
                        >
                            <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </Badge>
                        </motion.div>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-[500px] overflow-y-auto">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifikácie</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="h-auto p-1 text-xs"
                        >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Označiť všetky
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>Žiadne notifikácie</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`flex flex-col items-start gap-2 p-3 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''
                                    }`}
                                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                            >
                                <div className="flex items-start gap-2 w-full">
                                    <div className="mt-0.5">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-medium leading-tight">
                                                {notification.title}
                                            </p>
                                            {!notification.read && (
                                                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
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
