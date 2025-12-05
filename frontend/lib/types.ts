export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'user' | 'admin';
    avatar?: string;
    phone?: string;
    address?: string;
    memberSince: string;
}

export interface Author {
    id: string;
    name: string;
    biography: string;
    photoUrl?: string;
    birthDate?: string;
    nationality?: string;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    createdAt: string;
}

export interface Book {
    id: string;
    title: string;
    authorId: string;
    authorName: string;
    categoryId: string;
    categoryName: string;
    isbn: string;
    description: string;
    coverUrl?: string;
    publishedYear: number;
    totalCopies: number;
    availableCopies: number;
    createdAt: string;
}

export interface BorrowRecord {
    id: string;
    userId: string;
    bookId: string;
    bookTitle: string;
    bookCoverUrl?: string;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    status: 'active' | 'returned' | 'overdue';
    notes?: string;
}

export type NotificationType = 'borrow' | 'return' | 'overdue' | 'reminder' | 'system';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    relatedBookId?: string;
    relatedBorrowId?: string;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface CreateBookFormData {
    title: string;
    authorId: string;
    categoryId: string;
    isbn: string;
    description: string;
    coverUrl?: string;
    publishedYear: number;
    totalCopies: number;
}

export interface CreateAuthorFormData {
    name: string;
    biography: string;
    photoUrl?: string;
    birthDate?: string;
    nationality?: string;
}

export interface CreateCategoryFormData {
    name: string;
    description: string;
}
