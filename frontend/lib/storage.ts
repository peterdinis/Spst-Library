// Local storage utilities for persisting data

const STORAGE_KEYS = {
	AUTH_USER: "library_auth_user",
	BORROW_RECORDS: "library_borrow_records",
	NOTIFICATIONS: "library_notifications",
	BOOKS: "library_books",
} as const;

// Generic storage functions
export const storage = {
	get: <T>(key: string): T | null => {
		if (typeof window === "undefined") return null;
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : null;
		} catch (error) {
			console.error(`Error getting ${key} from localStorage:`, error);
			return null;
		}
	},

	set: <T>(key: string, value: T): void => {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error setting ${key} in localStorage:`, error);
		}
	},

	remove: (key: string): void => {
		if (typeof window === "undefined") return;
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.error(`Error removing ${key} from localStorage:`, error);
		}
	},

	clear: (): void => {
		if (typeof window === "undefined") return;
		try {
			localStorage.clear();
		} catch (error) {
			console.error("Error clearing localStorage:", error);
		}
	},
};

// Specific storage functions for auth
export const authStorage = {
	getUser: () => storage.get(STORAGE_KEYS.AUTH_USER),
	setUser: (user: any) => storage.set(STORAGE_KEYS.AUTH_USER, user),
	removeUser: () => storage.remove(STORAGE_KEYS.AUTH_USER),
};

// Specific storage functions for borrow records
export const borrowStorage = {
	getRecords: (): any[] => storage.get(STORAGE_KEYS.BORROW_RECORDS) || [],
	setRecords: (records: any[]) =>
		storage.set(STORAGE_KEYS.BORROW_RECORDS, records),
	addRecord: (record: any) => {
		const records = borrowStorage.getRecords();
		borrowStorage.setRecords([...records, record]);
	},
	updateRecord: (id: string, updates: any) => {
		const records = borrowStorage.getRecords();
		const updatedRecords = records.map((r: any) =>
			r.id === id ? { ...r, ...updates } : r,
		);
		borrowStorage.setRecords(updatedRecords);
	},
};

// Specific storage functions for notifications
export const notificationStorage = {
	getNotifications: (): any[] => storage.get(STORAGE_KEYS.NOTIFICATIONS) || [],
	setNotifications: (notifications: any[]) =>
		storage.set(STORAGE_KEYS.NOTIFICATIONS, notifications),
	addNotification: (notification: any) => {
		const notifications = notificationStorage.getNotifications();
		notificationStorage.setNotifications([notification, ...notifications]);
	},
	markAsRead: (id: string) => {
		const notifications = notificationStorage.getNotifications();
		const updated = notifications.map((n: any) =>
			n.id === id ? { ...n, read: true } : n,
		);
		notificationStorage.setNotifications(updated);
	},
	markAllAsRead: (userId: string) => {
		const notifications = notificationStorage.getNotifications();
		const updated = notifications.map((n: any) =>
			n.userId === userId ? { ...n, read: true } : n,
		);
		notificationStorage.setNotifications(updated);
	},
};

// Specific storage functions for books
export const bookStorage = {
	getBooks: (): any[] => storage.get(STORAGE_KEYS.BOOKS) || [],
	setBooks: (books: any[]) => storage.set(STORAGE_KEYS.BOOKS, books),
	updateBook: (id: string, updates: any) => {
		const books = bookStorage.getBooks();
		const updatedBooks = books.map((b: any) =>
			b.id === id ? { ...b, ...updates } : b,
		);
		bookStorage.setBooks(updatedBooks);
	},
};
