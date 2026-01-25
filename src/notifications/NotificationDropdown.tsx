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
  Filter,
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
  HelpCircle
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export type NotificationType = 
  | 'borrow_due'
  | 'reservation_ready'
  | 'fine_issued'
  | 'membership_expiry'
  | 'system'
  | 'promotional';

export type NotificationChannel = 
  | 'email'
  | 'sms'
  | 'push'
  | 'in_app';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    borrowingId?: string;
    bookTitle?: string;
    dueDate?: number;
    daysRemaining?: number;
    fineAmount?: number;
    reason?: string;
    expiryDate?: number;
  };
  channel: NotificationChannel;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  sentAt?: number;
  readAt?: number;
  createdAt: number;
  priority?: 'low' | 'medium' | 'high';
  _createdAt?: Date;
}

export interface NotificationGroup {
  date: string;
  notifications: Notification[];
}

// Enhanced mock data
const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "user_123",
    type: "borrow_due",
    title: "Kniha sa blíži k dátumu splatnosti",
    message: "Kniha 'JavaScript: The Good Parts' má dátum splatnosti 15.12.2024. Zostáva 3 dni.",
    data: {
      borrowingId: "borrow_1",
      bookTitle: "JavaScript: The Good Parts",
      dueDate: Date.now() + 3 * 24 * 60 * 60 * 1000,
      daysRemaining: 3
    },
    channel: "in_app",
    status: "delivered",
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    sentAt: Date.now() - 2 * 60 * 60 * 1000,
    readAt: undefined,
    priority: "high"
  },
  {
    id: "2",
    userId: "user_123",
    type: "fine_issued",
    title: "Nová pokuta",
    message: "Máte novú pokutu vo výške 2.50 € za knihu 'Clean Code'.",
    data: {
      borrowingId: "borrow_2",
      bookTitle: "Clean Code",
      fineAmount: 2.50,
      reason: "Oneskorený návrat"
    },
    channel: "email",
    status: "read",
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    sentAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    readAt: Date.now() - 12 * 60 * 60 * 1000,
    priority: "medium"
  },
  {
    id: "3",
    userId: "user_123",
    type: "system",
    title: "Nové funkcie v knižnici",
    message: "Pridali sme nové funkcie: rezervácie online, elektronické knihy a viac.",
    channel: "in_app",
    status: "delivered",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    sentAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    readAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    priority: "low"
  },
  {
    id: "4",
    userId: "user_123",
    type: "membership_expiry",
    title: "Členstvo expiruje čoskoro",
    message: "Vaše členstvo v knižnici expiruje 31.12.2024. Zostáva 15 dní.",
    data: {
      expiryDate: Date.now() + 15 * 24 * 60 * 60 * 1000,
      daysRemaining: 15
    },
    channel: "email",
    status: "sent",
    createdAt: Date.now() - 6 * 60 * 60 * 1000,
    sentAt: Date.now() - 6 * 60 * 60 * 1000,
    priority: "high"
  },
  {
    id: "5",
    userId: "user_123",
    type: "reservation_ready",
    title: "Rezervácia pripravená na vyzdvihnutie",
    message: "Kniha 'The Pragmatic Programmer' je pripravená na vyzdvihnutie.",
    data: {
      bookTitle: "The Pragmatic Programmer"
    },
    channel: "sms",
    status: "delivered",
    createdAt: Date.now() - 30 * 60 * 1000,
    sentAt: Date.now() - 30 * 60 * 1000,
    priority: "medium"
  },
  {
    id: "6",
    userId: "user_123",
    type: "promotional",
    title: "Vianočná akcia",
    message: "Počas vianočných sviatkov máme 20% zľavu na nové knihy!",
    channel: "in_app",
    status: "delivered",
    createdAt: Date.now() - 5 * 60 * 1000,
    sentAt: Date.now() - 5 * 60 * 1000,
    priority: "low"
  },
  {
    id: "7",
    userId: "user_123",
    type: "fine_issued",
    title: "Pokuta za poškodenie knihy",
    message: "Máte pokutu 5.00 € za poškodenie knihy 'Design Patterns'.",
    data: {
      bookTitle: "Design Patterns",
      fineAmount: 5.00,
      reason: "Poškodenie"
    },
    channel: "in_app",
    status: "failed",
    createdAt: Date.now() - 10 * 60 * 1000,
    sentAt: Date.now() - 10 * 60 * 1000,
    priority: "high"
  },
  {
    id: "8",
    userId: "user_123",
    type: "borrow_due",
    title: "Dve knihy blížiace sa k splatnosti",
    message: "Knihy 'React Patterns' a 'TypeScript Handbook' majú splatnosť zajtra.",
    data: {
      bookTitle: "React Patterns & TypeScript Handbook",
      dueDate: Date.now() + 24 * 60 * 60 * 1000,
      daysRemaining: 1
    },
    channel: "push",
    status: "delivered",
    createdAt: Date.now() - 15 * 60 * 1000,
    sentAt: Date.now() - 15 * 60 * 1000,
    priority: "high"
  }
];

// Utility functions
const getNotificationIcon = (type: NotificationType) => {
  const baseClasses = "h-4 w-4";
  switch (type) {
    case 'borrow_due':
      return <Clock className={`${baseClasses} text-amber-500`} />;
    case 'fine_issued':
      return <AlertCircle className={`${baseClasses} text-red-500`} />;
    case 'membership_expiry':
      return <CreditCard className={`${baseClasses} text-purple-500`} />;
    case 'reservation_ready':
      return <BookOpen className={`${baseClasses} text-green-500`} />;
    case 'system':
      return <Settings className={`${baseClasses} text-blue-500`} />;
    case 'promotional':
      return <Sparkles className={`${baseClasses} text-pink-500`} />;
    default:
      return <Bell className={`${baseClasses} text-gray-500`} />;
  }
};

const getPriorityIcon = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'high':
      return <AlertTriangle className="h-3 w-3 text-red-500" />;
    case 'medium':
      return <AlertCircle className="h-3 w-3 text-amber-500" />;
    case 'low':
      return <Info className="h-3 w-3 text-blue-500" />;
  }
};

const getNotificationColor = (type: NotificationType, priority?: 'low' | 'medium' | 'high') => {
  let baseColor = '';
  switch (type) {
    case 'borrow_due':
      baseColor = 'amber';
      break;
    case 'fine_issued':
      baseColor = 'red';
      break;
    case 'membership_expiry':
      baseColor = 'purple';
      break;
    case 'reservation_ready':
      baseColor = 'green';
      break;
    case 'system':
      baseColor = 'blue';
      break;
    case 'promotional':
      baseColor = 'pink';
      break;
    default:
      baseColor = 'gray';
  }

  const intensity = priority === 'high' ? '500' : priority === 'medium' ? '400' : '300';
  
  return {
    bg: `bg-${baseColor}-${intensity}/5`,
    border: `border-${baseColor}-${intensity}/20`,
    text: `text-${baseColor}-${intensity}`,
    hover: `hover:bg-${baseColor}-${intensity}/10`,
    glow: priority === 'high' ? `shadow-lg shadow-${baseColor}-${intensity}/10` : ''
  };
};

const getChannelIcon = (channel: NotificationChannel) => {
  switch (channel) {
    case 'email':
      return <Mail className="h-3 w-3" />;
    case 'sms':
      return <MessageSquare className="h-3 w-3" />;
    case 'push':
      return <Bell className="h-3 w-3" />;
    case 'in_app':
      return <Zap className="h-3 w-3" />;
  }
};

const formatTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `Pred ${days} dň${days === 1 ? 'om' : 'ami'}`;
  if (hours > 0) return `Pred ${hours} hod${hours === 1 ? 'inou' : 'inami'}`;
  if (minutes > 0) return `Pred ${minutes} min${minutes === 1 ? 'útou' : 'útami'}`;
  return 'Teraz';
};

const groupNotificationsByDate = (notifications: Notification[]): NotificationGroup[] => {
  const groups: { [key: string]: Notification[] } = {};
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  
  notifications.forEach(notification => {
    const date = new Date(notification.createdAt);
    const dateString = date.toDateString();
    
    let groupKey: string;
    if (dateString === today) {
      groupKey = 'Dnes';
    } else if (dateString === yesterday) {
      groupKey = 'Včera';
    } else if (date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      const daysAgo = Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000));
      groupKey = `Pred ${daysAgo} dňami`;
    } else {
      groupKey = date.toLocaleDateString('sk-SK', { day: 'numeric', month: 'long' });
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(notification);
  });
  
  return Object.entries(groups).map(([date, notifications]) => ({
    date,
    notifications: notifications.sort((a, b) => b.createdAt - a.createdAt)
  }));
};

// Enhanced Notification Item with better UX
interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

const NotificationItem = React.memo<NotificationItemProps>(({ 
  notification, 
  onMarkAsRead, 
  onDelete,
  index 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isRead, setIsRead] = useState(!!notification.readAt);
  
  const colors = getNotificationColor(notification.type, notification.priority);
  
  const handleMarkAsRead = () => {
    if (!isRead) {
      setIsRead(true);
      onMarkAsRead(notification.id);
    }
  };
  
  const handleDelete = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDelete(notification.id);
    }, 250);
  };
  
  const getActionIcon = () => {
    if (notification.type === 'borrow_due') return <Calendar className="h-3 w-3" />;
    if (notification.type === 'fine_issued') return <DollarSign className="h-3 w-3" />;
    if (notification.type === 'reservation_ready') return <BookOpen className="h-3 w-3" />;
    return <ChevronRight className="h-3 w-3" />;
  };
  
  return (
    <div
      className={cn(
        "relative group p-4 rounded-xl border transition-all duration-300 backdrop-blur-sm",
        colors.bg,
        colors.border,
        colors.glow,
        !isRead && "ring-1 ring-offset-1 ring-offset-background",
        isRead ? "opacity-80" : "",
        isExiting ? "opacity-0 scale-95 -translate-x-4" : "opacity-100 scale-100 translate-x-0",
        "hover:scale-[1.02] hover:shadow-lg cursor-pointer transform-gpu",
        index === 0 && "animate-slide-in"
      )}
      style={{
        animationDelay: `${index * 50}ms`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleMarkAsRead}
    >
      {/* Priority indicator */}
      {notification.priority === 'high' && (
        <div className="absolute -left-2 top-1/2 -translate-y-1/2">
          <div className="h-4 w-1 rounded-full bg-red-500 animate-pulse" />
        </div>
      )}
      
      {/* Status dot */}
      {!isRead && (
        <div className="absolute -right-1 -top-1">
          <div className="relative">
            <div className="absolute inset-0 animate-ping bg-blue-500 rounded-full opacity-75" />
            <div className="relative h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-background" />
          </div>
        </div>
      )}
      
      <div className="flex items-start gap-3">
        {/* Icon with glow effect */}
        <div className={cn(
          "relative mt-0.5",
          !isRead && "animate-pulse-slow"
        )}>
          <div className={cn(
            "absolute inset-0 rounded-full blur-sm",
            colors.bg.replace('bg-', 'bg-').replace('/5', '/20')
          )} />
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header with priority */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <h4 className={cn(
                "font-semibold text-sm truncate",
                isRead ? "text-muted-foreground" : "text-foreground"
              )}>
                {notification.title}
              </h4>
              {notification.priority && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {getPriorityIcon(notification.priority)}
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">Priorita: {notification.priority}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
              {formatTimeAgo(notification.createdAt)}
            </span>
          </div>
          
          {/* Message */}
          <p className={cn(
            "text-sm leading-relaxed line-clamp-2",
            isRead ? "text-muted-foreground/80" : "text-muted-foreground"
          )}>
            {notification.message}
          </p>
          
          {/* Metadata chips */}
          <div className="flex flex-wrap gap-1.5">
            {notification.data?.bookTitle && (
              <Badge 
                variant="outline" 
                className="text-xs px-2 py-0.5 backdrop-blur-sm bg-background/50"
              >
                <BookOpen className="h-2.5 w-2.5 mr-1" />
                {notification.data.bookTitle}
              </Badge>
            )}
            {notification.data?.fineAmount && (
              <Badge 
                variant="destructive" 
                className="text-xs px-2 py-0.5"
              >
                <DollarSign className="h-2.5 w-2.5 mr-1" />
                {notification.data.fineAmount} €
              </Badge>
            )}
            {notification.data?.daysRemaining !== undefined && (
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-0.5"
              >
                <Clock className="h-2.5 w-2.5 mr-1" />
                {notification.data.daysRemaining} dní
              </Badge>
            )}
          </div>
          
          {/* Footer with actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                {getChannelIcon(notification.channel)}
                <span className="capitalize">{notification.channel.replace('_', ' ')}</span>
              </div>
              
              {notification.status === 'failed' && (
                <Badge variant="destructive" className="text-xs px-2 py-0">
                  <AlertCircle className="h-2.5 w-2.5 mr-1" />
                  Chyba
                </Badge>
              )}
            </div>
            
            <div className={cn(
              "flex items-center gap-1 transition-all duration-200",
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
            )}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead();
                      }}
                    >
                      {isRead ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">{isRead ? "Označiť ako neprečítané" : "Označiť ako prečítané"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Action clicked:', notification.id);
                      }}
                    >
                      {getActionIcon()}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Akcia</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

NotificationItem.displayName = 'NotificationItem';

// Enhanced Settings Panel Component
const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    push: true,
    in_app: true,
    borrowDue: true,
    fines: true,
    membership: true,
    promotions: false,
    system: true,
    sound: true,
    vibration: true,
    quietHours: false,
    quietStart: "22:00",
    quietEnd: "07:00",
    digestEmail: true,
    digestFrequency: "daily",
    priorityThreshold: "medium"
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    // Simulate save action
    setTimeout(() => {
      console.log("Settings saved", settings);
    }, 500);
  };

  const handleReset = () => {
    setSettings({
      email: true,
      sms: false,
      push: true,
      in_app: true,
      borrowDue: true,
      fines: true,
      membership: true,
      promotions: false,
      system: true,
      sound: true,
      vibration: true,
      quietHours: false,
      quietStart: "22:00",
      quietEnd: "07:00",
      digestEmail: true,
      digestFrequency: "daily",
      priorityThreshold: "medium"
    });
    setHasChanges(true);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Nastavenia notifikácií
          </h3>
          <p className="text-xs text-muted-foreground">
            Prispôsobte si spôsob prijímania upozornení
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-8 px-3"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Uložiť
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8 px-3"
          >
            Obnoviť
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Globálne vypnutie</Label>
            <p className="text-xs text-muted-foreground">Vypnite všetky notifikácie naraz</p>
          </div>
          <Switch checked={false} onCheckedChange={() => {}} />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Komunikačné kanály
        </h3>
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Email', icon: Mail, description: 'Odošle sa na váš email' },
            { key: 'sms', label: 'SMS', icon: MessageSquare, description: 'Odošle sa ako SMS správa' },
            { key: 'push', label: 'Push notifikácie', icon: Bell, description: 'Zobrazí sa v prehliadači' },
            { key: 'in_app', label: 'V aplikácii', icon: Zap, description: 'Zobrazí sa v aplikácii' }
          ].map(({ key, label, icon: Icon, description }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/50 flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <Label className="text-sm font-medium">{label}</Label>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
              <Switch 
                checked={settings[key as keyof typeof settings] as boolean}
                onCheckedChange={(checked) => handleSettingChange(key, checked)}
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtrovanie notifikácií
        </h3>
        <div className="space-y-3">
          {[
            { key: 'borrowDue', label: 'Splatnosť výpožičiek', icon: Calendar },
            { key: 'fines', label: 'Pokuty', icon: DollarSign },
            { key: 'membership', label: 'Členstvo', icon: User },
            { key: 'promotions', label: 'Propagačné', icon: Sparkles },
            { key: 'system', label: 'Systémové', icon: Settings }
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <Label className="text-sm font-medium">{label}</Label>
              </div>
              <Switch 
                checked={settings[key as keyof typeof settings] as boolean}
                onCheckedChange={(checked) => handleSettingChange(key, checked)}
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Rozšírené nastavenia
        </h3>
        
        <div className="space-y-4 p-3 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Tiché hodiny</Label>
              <p className="text-xs text-muted-foreground">Vypnutie notifikácií počas noci</p>
            </div>
            <Switch 
              checked={settings.quietHours}
              onCheckedChange={(checked) => handleSettingChange('quietHours', checked)}
            />
          </div>
          
          {settings.quietHours && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-2">
                <Label className="text-xs">Začiatok</Label>
                <Input 
                  type="time" 
                  value={settings.quietStart}
                  onChange={(e) => handleSettingChange('quietStart', e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Koniec</Label>
                <Input 
                  type="time" 
                  value={settings.quietEnd}
                  onChange={(e) => handleSettingChange('quietEnd', e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 p-3 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Emailový súhrn</Label>
              <p className="text-xs text-muted-foreground">Denný alebo týždenný prehľad</p>
            </div>
            <Switch 
              checked={settings.digestEmail}
              onCheckedChange={(checked) => handleSettingChange('digestEmail', checked)}
            />
          </div>
          
          {settings.digestEmail && (
            <div className="space-y-2">
              <Label className="text-xs">Frekvencia</Label>
              <Select 
                value={settings.digestFrequency}
                onValueChange={(value) => handleSettingChange('digestFrequency', value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Denný</SelectItem>
                  <SelectItem value="weekly">Týždenný</SelectItem>
                  <SelectItem value="biweekly">Dvojtýždenný</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-3 p-3 rounded-lg border">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Prioritný filter</Label>
              <span className="text-xs font-medium px-2 py-1 rounded bg-accent">
                {settings.priorityThreshold}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Zobrazuj iba notifikácie s vyššou alebo rovnakou prioritou
            </p>
            <div className="pt-2">
              <Slider 
                value={[
                  settings.priorityThreshold === 'low' ? 0 : 
                  settings.priorityThreshold === 'medium' ? 50 : 100
                ]}
                onValueChange={(value) => {
                  const threshold = value[0] === 0 ? 'low' : value[0] === 50 ? 'medium' : 'high';
                  handleSettingChange('priorityThreshold', threshold);
                }}
                className="w-full"
                max={100}
                step={50}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Nízka</span>
                <span>Stredná</span>
                <span>Vysoká</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Ďalšie možnosti</h4>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-3.5 w-3.5 mr-2" />
            Exportovať
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Upload className="h-3.5 w-3.5 mr-2" />
            Importovať
          </Button>
        </div>
        <div className="flex items-center justify-center pt-4">
          <Button variant="ghost" size="sm" className="h-8">
            <HelpCircle className="h-3.5 w-3.5 mr-2" />
            Nápoveda k nastaveniam
          </Button>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyNotifications = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
      <div className="relative h-24 w-24 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
        <Bell className="h-12 w-12 text-white" />
      </div>
    </div>
    <h3 className="font-semibold text-xl mb-2 bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
      Žiadne notifikácie
    </h3>
    <p className="text-sm text-muted-foreground mb-6 max-w-xs">
      Nemáte žiadne notifikácie. Všetky vaše upozornenia sa zobrazia tu.
    </p>
    <Button variant="outline" size="sm">
      <Sparkles className="h-4 w-4 mr-2" />
      Prezrieť novinky
    </Button>
  </div>
);

// Loading Skeleton
const NotificationSkeleton = () => (
  <div className="space-y-4 p-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Separator className="flex-1" />
        </div>
        <div className="space-y-3">
          {[1, 2].map((j) => (
            <div key={j} className="p-4 rounded-xl border bg-card">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Main Component
interface NotificationDropdownProps {
  className?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ className }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState(440);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Initialize with mock data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 800);
  }, []);
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "unread") return !notification.readAt;
    if (activeTab === "high") return notification.priority === "high";
    return true;
  });
  
  const filteredGroupedNotifications = groupNotificationsByDate(filteredNotifications);
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.readAt).length;
  const highPriorityCount = notifications.filter(n => n.priority === "high").length;
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({
        ...notification,
        readAt: notification.readAt || Date.now()
      }))
    );
    setHasNewNotifications(false);
  };
  
  // Mark single as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, readAt: Date.now() }
          : notification
      )
    );
  };
  
  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Delete all notifications
  const deleteAllNotifications = () => {
    setNotifications([]);
  };
  
  // Simulate new notification
  const simulateNewNotification = () => {
    const types: NotificationType[] = ['borrow_due', 'fine_issued', 'reservation_ready'];
    const newNotification: Notification = {
      id: `sim_${Date.now()}`,
      userId: "user_123",
      type: types[Math.floor(Math.random() * types.length)],
      title: `Nové upozornenie ${Math.floor(Math.random() * 1000)}`,
      message: "Toto je simulované upozornenie pre demo účely.",
      channel: "in_app",
      status: "delivered",
      createdAt: Date.now(),
      sentAt: Date.now(),
      priority: Math.random() > 0.7 ? "high" : Math.random() > 0.5 ? "medium" : "low"
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setHasNewNotifications(true);
    
    // Add haptic feedback if supported
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };
  
  return (
    <TooltipProvider>
      <div className={cn("relative", className)} ref={dropdownRef}>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative h-11 w-11 rounded-xl transition-all duration-300",
                "hover:bg-accent hover:text-accent-foreground hover:scale-110",
                "bg-linear-to-br from-background to-accent/50",
                hasNewNotifications && "animate-pulse-slow shadow-lg shadow-blue-500/20",
                "border border-border/50 backdrop-blur-sm"
              )}
            >
              <div className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-pink-500 text-xs font-bold text-white shadow-lg animate-bounce">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="end" 
            className={cn(
              "p-0 animate-in slide-in-from-top-5 duration-300 border-border/50 backdrop-blur-md bg-background/95",
              "max-h-[85vh] overflow-hidden"
            )}
            collisionPadding={16}
            sideOffset={8}
            style={{ width: dropdownWidth }}
            ref={contentRef}
            onInteractOutside={(e) => {
              // Prevent closing when clicking on content
              if (contentRef.current?.contains(e.target as Node)) {
                e.preventDefault();
              }
            }}
          >
            {/* Header with stats */}
            <div className="sticky top-0 z-50 bg-linear-to-b from-background/95 to-background/80 backdrop-blur-xl border-b border-border/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <DropdownMenuLabel className="p-0 text-lg font-bold bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Notifikácie
                  </DropdownMenuLabel>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-muted-foreground">
                        {unreadCount} neprečítaných
                      </span>
                    </div>
                    {highPriorityCount > 0 && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-muted-foreground">
                          {highPriorityCount} vysoká priorita
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={simulateNewNotification}
                      >
                        <Zap className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">Simulovať novú notifikáciu</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={markAllAsRead} disabled={unreadCount === 0}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Označiť všetky ako prečítané
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setShowSettings(!showSettings);
                        setActiveTab(showSettings ? "all" : "settings");
                      }}>
                        <Settings className="h-4 w-4 mr-2" />
                        {showSettings ? "Späť na notifikácie" : "Nastavenia"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
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
                  <TabsTrigger 
                    value="all" 
                    className="text-xs"
                    disabled={showSettings}
                  >
                    Všetky
                    {notifications.length > 0 && (
                      <span className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded">
                        {notifications.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="unread" 
                    className="text-xs"
                    disabled={showSettings}
                  >
                    Neprečítané
                    {unreadCount > 0 && (
                      <span className="ml-1.5 text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded">
                        {unreadCount}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="high" 
                    className="text-xs"
                    disabled={showSettings}
                  >
                    Vysoká
                    {highPriorityCount > 0 && (
                      <span className="ml-1.5 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded">
                        {highPriorityCount}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="text-xs"
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Content Area */}
            <div className="max-h-[60vh] overflow-hidden">
              {showSettings ? (
                <ScrollArea className="h-[60vh]">
                  <NotificationSettings />
                </ScrollArea>
              ) : isLoading ? (
                <NotificationSkeleton />
              ) : filteredNotifications.length === 0 ? (
                <EmptyNotifications />
              ) : (
                <ScrollArea className="h-[60vh]">
                  <div className="p-4">
                    {filteredGroupedNotifications.map((group, groupIndex) => (
                      <div key={`${group.date}-${groupIndex}`} className="mb-8">
                        <div className="sticky top-0 z-10 bg-linear-to-b from-background/95 via-background/90 to-transparent pb-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
                            <span className="text-xs font-semibold text-muted-foreground px-3 py-1 rounded-full bg-accent/50 backdrop-blur-sm">
                              {group.date}
                            </span>
                            <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {group.notifications.map((notification, index) => (
                            <NotificationItem
                              key={notification.id}
                              notification={notification}
                              onMarkAsRead={markAsRead}
                              onDelete={deleteNotification}
                              index={index}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
            
            {/* Footer - only show when not in settings */}
            {!showSettings && filteredNotifications.length > 0 && (
              <div className="sticky bottom-0 border-t border-border/50 bg-linear-to-t from-background via-background to-background/80 p-3">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    className="text-sm group"
                    onClick={() => console.log('View all notifications')}
                    size="sm"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      Zobraziť všetky
                    </span>
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        setDropdownWidth(prev => prev === 440 ? 600 : 440);
                      }}
                    >
                      {dropdownWidth === 440 ? "Rozbaliť" : "Zbaliť"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Floating indicator */}
        {hasNewNotifications && unreadCount > 0 && !isOpen && (
          <div className="absolute -top-0.5 -right-0.5">
            <div className="relative">
              <div className="absolute inset-0 animate-ping bg-linear-to-br from-blue-500 to-purple-500 rounded-full opacity-75" />
              <div className="relative h-2.5 w-2.5 rounded-full bg-linear-to-br from-blue-500 to-purple-500 border-2 border-background shadow-lg" />
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};