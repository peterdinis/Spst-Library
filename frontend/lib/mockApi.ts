import {
	User,
	Book,
	BorrowRecord,
	Notification,
	LoginFormData,
	RegisterFormData,
} from "./types";
import {
	mockUsers,
	mockBooks,
	mockBorrowRecords,
	mockNotifications,
	getInitialMockData,
} from "./mockData";
import {
	authStorage,
	borrowStorage,
	notificationStorage,
	bookStorage,
} from "./storage";

// Initialize mock data in localStorage if not present
export const initializeMockData = () => {
	if (typeof window === "undefined") return;

	if (!bookStorage.getBooks().length) {
		bookStorage.setBooks(mockBooks);
	}
	if (!borrowStorage.getRecords().length) {
		borrowStorage.setRecords(mockBorrowRecords);
	}
	if (!notificationStorage.getNotifications().length) {
		notificationStorage.setNotifications(mockNotifications);
	}
};

// Simulate API delay
const delay = (ms: number = 500) =>
	new Promise((resolve) => setTimeout(resolve, ms));

// Auth API
export const mockAuthApi = {
	login: async (data: LoginFormData): Promise<User> => {
		await delay();
		const user = mockUsers.find((u) => u.email === data.email);

		if (!user) {
			throw new Error("Používateľ s týmto emailom neexistuje");
		}

		// In a real app, we'd verify password here
		// For mock, we accept any password
		authStorage.setUser(user);
		return user;
	},

	register: async (data: RegisterFormData): Promise<User> => {
		await delay();

		// Check if user already exists
		const existingUser = mockUsers.find((u) => u.email === data.email);
		if (existingUser) {
			throw new Error("Používateľ s týmto emailom už existuje");
		}

		// Create new user
		const newUser: User = {
			id: `user_${Date.now()}`,
			email: data.email,
			fullName: data.fullName,
			role: "user",
			avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.fullName}`,
			memberSince: new Date().toISOString(),
		};

		mockUsers.push(newUser);
		return newUser;
	},

	logout: async (): Promise<void> => {
		await delay(200);
		authStorage.removeUser();
	},

	getCurrentUser: (): User | null => {
		return authStorage.getUser() as User | null;
	},

	updateProfile: async (
		userId: string,
		updates: Partial<User>,
	): Promise<User> => {
		await delay();
		const user = authStorage.getUser() as User | null;

		if (!user || user.id !== userId) {
			throw new Error("Neautorizovaný prístup");
		}

		const updatedUser: User = { ...user, ...updates } as User;
		authStorage.setUser(updatedUser);

		// Update in mockUsers array
		const index = mockUsers.findIndex((u) => u.id === userId);
		if (index !== -1) {
			mockUsers[index] = updatedUser;
		}

		return updatedUser;
	},
};

// Books API
export const mockBooksApi = {
	getAll: async (): Promise<Book[]> => {
		await delay(300);
		const books = bookStorage.getBooks();
		return books.length ? books : mockBooks;
	},

	getById: async (id: string): Promise<Book | null> => {
		await delay(300);
		const books = bookStorage.getBooks();
		const allBooks = books.length ? books : mockBooks;
		return allBooks.find((b: Book) => b.id === id) || null;
	},

	getByAuthor: async (authorId: string): Promise<Book[]> => {
		await delay(300);
		const books = bookStorage.getBooks();
		const allBooks = books.length ? books : mockBooks;
		return allBooks.filter((b: Book) => b.authorId === authorId);
	},

	getByCategory: async (categoryId: string): Promise<Book[]> => {
		await delay(300);
		const books = bookStorage.getBooks();
		const allBooks = books.length ? books : mockBooks;
		return allBooks.filter((b: Book) => b.categoryId === categoryId);
	},

	updateAvailability: (bookId: string, change: number) => {
		const books = bookStorage.getBooks();
		const allBooks = books.length ? books : mockBooks;
		const book = allBooks.find((b: Book) => b.id === bookId);

		if (book) {
			const updatedBook = {
				...book,
				availableCopies: Math.max(
					0,
					Math.min(book.totalCopies, book.availableCopies + change),
				),
			};
			bookStorage.updateBook(bookId, updatedBook);
			return updatedBook;
		}
		return null;
	},
};

// Borrow API
export const mockBorrowApi = {
	borrowBook: async (userId: string, bookId: string): Promise<BorrowRecord> => {
		await delay();

		const book = await mockBooksApi.getById(bookId);
		if (!book) {
			throw new Error("Kniha nebola nájdená");
		}

		if (book.availableCopies <= 0) {
			throw new Error("Kniha nie je dostupná");
		}

		// Check if user already borrowed this book
		const records = borrowStorage.getRecords();
		const activeBorrow = records.find(
			(r: BorrowRecord) =>
				r.userId === userId && r.bookId === bookId && r.status === "active",
		);

		if (activeBorrow) {
			throw new Error("Túto knihu už máte vypožičanú");
		}

		// Create borrow record
		const borrowDate = new Date();
		const dueDate = new Date();
		dueDate.setDate(dueDate.getDate() + 30); // 30 days loan period

		const borrowRecord: BorrowRecord = {
			id: `borrow_${Date.now()}`,
			userId,
			bookId,
			bookTitle: book.title,
			bookCoverUrl: book.coverUrl,
			borrowDate: borrowDate.toISOString(),
			dueDate: dueDate.toISOString(),
			status: "active",
		};

		borrowStorage.addRecord(borrowRecord);

		// Update book availability
		mockBooksApi.updateAvailability(bookId, -1);

		// Create notification
		const notification: Notification = {
			id: `notif_${Date.now()}`,
			userId,
			type: "borrow",
			title: "Kniha úspešne vypožičaná",
			message: `Úspešne ste si vypožičali knihu "${book.title}". Termín vrátenia je ${new Date(dueDate).toLocaleDateString("sk-SK")}.`,
			read: false,
			createdAt: new Date().toISOString(),
			relatedBookId: bookId,
			relatedBorrowId: borrowRecord.id,
		};
		notificationStorage.addNotification(notification);

		return borrowRecord;
	},

	returnBook: async (borrowId: string): Promise<BorrowRecord> => {
		await delay();

		const records = borrowStorage.getRecords();
		const borrowRecord = records.find((r: BorrowRecord) => r.id === borrowId);

		if (!borrowRecord) {
			throw new Error("Záznam o vypožičaní nebol nájdený");
		}

		if (borrowRecord.status === "returned") {
			throw new Error("Táto kniha už bola vrátená");
		}

		// Update borrow record
		const updatedRecord = {
			...borrowRecord,
			returnDate: new Date().toISOString(),
			status: "returned" as const,
		};
		borrowStorage.updateRecord(borrowId, updatedRecord);

		// Update book availability
		mockBooksApi.updateAvailability(borrowRecord.bookId, 1);

		// Create notification
		const notification: Notification = {
			id: `notif_${Date.now()}`,
			userId: borrowRecord.userId,
			type: "return",
			title: "Kniha vrátená",
			message: `Úspešne ste vrátili knihu "${borrowRecord.bookTitle}". Ďakujeme!`,
			read: false,
			createdAt: new Date().toISOString(),
			relatedBookId: borrowRecord.bookId,
			relatedBorrowId: borrowId,
		};
		notificationStorage.addNotification(notification);

		return updatedRecord;
	},

	getUserBorrows: async (userId: string): Promise<BorrowRecord[]> => {
		await delay(300);
		const records = borrowStorage.getRecords();
		return records.filter((r: BorrowRecord) => r.userId === userId);
	},

	getActiveBorrows: async (userId: string): Promise<BorrowRecord[]> => {
		await delay(300);
		const records = borrowStorage.getRecords();
		return records.filter(
			(r: BorrowRecord) => r.userId === userId && r.status === "active",
		);
	},

	checkUserHasBorrowed: async (
		userId: string,
		bookId: string,
	): Promise<boolean> => {
		const records = borrowStorage.getRecords();
		return records.some(
			(r: BorrowRecord) =>
				r.userId === userId && r.bookId === bookId && r.status === "active",
		);
	},
};

// Notifications API
export const mockNotificationsApi = {
	getUserNotifications: async (userId: string): Promise<Notification[]> => {
		await delay(300);
		const notifications = notificationStorage.getNotifications();
		return notifications.filter((n: Notification) => n.userId === userId);
	},

	markAsRead: async (notificationId: string): Promise<void> => {
		await delay(200);
		notificationStorage.markAsRead(notificationId);
	},

	markAllAsRead: async (userId: string): Promise<void> => {
		await delay(200);
		notificationStorage.markAllAsRead(userId);
	},

	getUnreadCount: async (userId: string): Promise<number> => {
		const notifications =
			await mockNotificationsApi.getUserNotifications(userId);
		return notifications.filter((n) => !n.read).length;
	},
};
