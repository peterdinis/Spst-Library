"use client";

import { useState, useEffect } from 'react';
import { Notification } from '@/lib/types';
import { mockNotificationsApi } from '@/lib/mockApi';
import { useAuth } from '@/components/providers/AuthContext';

export const useNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const loadNotifications = async () => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        setIsLoading(true);
        try {
            const userNotifications = await mockNotificationsApi.getUserNotifications(user.id);
            const count = await mockNotificationsApi.getUnreadCount(user.id);
            setNotifications(userNotifications);
            setUnreadCount(count);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await mockNotificationsApi.markAsRead(notificationId);
            await loadNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;

        try {
            await mockNotificationsApi.markAllAsRead(user.id);
            await loadNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    useEffect(() => {
        loadNotifications();

        // Poll for new notifications every 5 seconds
        const interval = setInterval(loadNotifications, 5000);

        return () => clearInterval(interval);
    }, [user]);

    return {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        refresh: loadNotifications,
    };
};
