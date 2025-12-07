import { Book, Author, Category } from "./types";
import { mockBooks, mockAuthors, mockCategories } from "./mockData";
import {
	CreateBookData,
	UpdateBookData,
	CreateAuthorData,
	UpdateAuthorData,
	CreateCategoryData,
	UpdateCategoryData,
} from "./validations";

// Simulate API delay
const delay = (ms: number = 500) =>
	new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage (in real app, this would be in a database)
let booksData: Book[] = [...mockBooks];
let authorsData: Author[] = [...mockAuthors];
let categoriesData: Category[] = [...mockCategories];

// Initialize from localStorage if available
if (typeof window !== "undefined") {
	const storedBooks = localStorage.getItem("library_books");
	const storedAuthors = localStorage.getItem("library_authors");
	const storedCategories = localStorage.getItem("library_categories");

	if (storedBooks) booksData = JSON.parse(storedBooks);
	if (storedAuthors) authorsData = JSON.parse(storedAuthors);
	if (storedCategories) categoriesData = JSON.parse(storedCategories);
}

// Helper to save to localStorage
const saveToStorage = () => {
	if (typeof window !== "undefined") {
		localStorage.setItem("library_books", JSON.stringify(booksData));
		localStorage.setItem("library_authors", JSON.stringify(authorsData));
		localStorage.setItem("library_categories", JSON.stringify(categoriesData));
	}
};

// ============= BOOKS CRUD =============

export const mockBooksCrudApi = {
	// Get all books
	getAll: async (): Promise<Book[]> => {
		await delay();
		return [...booksData];
	},

	// Get book by ID
	getById: async (id: string): Promise<Book | null> => {
		await delay();
		return booksData.find((book) => book.id === id) || null;
	},

	// Create book
	create: async (data: CreateBookData): Promise<Book> => {
		await delay();

		// Validate author exists
		const author = authorsData.find((a) => a.id === data.authorId);
		if (!author) {
			throw new Error("Autor neexistuje");
		}

		// Validate category exists
		const category = categoriesData.find((c) => c.id === data.categoryId);
		if (!category) {
			throw new Error("Kategória neexistuje");
		}

		// Check if ISBN already exists
		const existingBook = booksData.find((b) => b.isbn === data.isbn);
		if (existingBook) {
			throw new Error("Kniha s týmto ISBN už existuje");
		}

		const newBook: Book = {
			id: `book_${Date.now()}`,
			...data,
			authorName: author.name,
			categoryName: category.name,
			coverUrl: data.coverUrl || undefined,
			createdAt: new Date().toISOString(),
		};

		booksData.push(newBook);
		saveToStorage();
		return newBook;
	},

	// Update book
	update: async (data: UpdateBookData): Promise<Book> => {
		await delay();

		const index = booksData.findIndex((book) => book.id === data.id);
		if (index === -1) {
			throw new Error("Kniha nebola nájdená");
		}

		const existingBook = booksData[index];

		// If authorId changed, validate and update authorName
		let authorName = existingBook.authorName;
		if (data.authorId && data.authorId !== existingBook.authorId) {
			const author = authorsData.find((a) => a.id === data.authorId);
			if (!author) {
				throw new Error("Autor neexistuje");
			}
			authorName = author.name;
		}

		// If categoryId changed, validate and update categoryName
		let categoryName = existingBook.categoryName;
		if (data.categoryId && data.categoryId !== existingBook.categoryId) {
			const category = categoriesData.find((c) => c.id === data.categoryId);
			if (!category) {
				throw new Error("Kategória neexistuje");
			}
			categoryName = category.name;
		}

		// Check ISBN uniqueness if changed
		if (data.isbn && data.isbn !== existingBook.isbn) {
			const duplicateBook = booksData.find(
				(b) => b.isbn === data.isbn && b.id !== data.id,
			);
			if (duplicateBook) {
				throw new Error("Kniha s týmto ISBN už existuje");
			}
		}

		const updatedBook: Book = {
			...existingBook,
			...data,
			authorName,
			categoryName,
			id: existingBook.id, // Ensure ID doesn't change
		};

		booksData[index] = updatedBook;
		saveToStorage();
		return updatedBook;
	},

	// Delete book
	delete: async (id: string): Promise<void> => {
		await delay();

		const index = booksData.findIndex((book) => book.id === id);
		if (index === -1) {
			throw new Error("Kniha nebola nájdená");
		}

		booksData.splice(index, 1);
		saveToStorage();
	},
};

// ============= AUTHORS CRUD =============

export const mockAuthorsCrudApi = {
	// Get all authors
	getAll: async (): Promise<Author[]> => {
		await delay();
		return [...authorsData];
	},

	// Get author by ID
	getById: async (id: string): Promise<Author | null> => {
		await delay();
		return authorsData.find((author) => author.id === id) || null;
	},

	// Create author
	create: async (data: CreateAuthorData): Promise<Author> => {
		await delay();

		// Check if author with same name exists
		const existingAuthor = authorsData.find(
			(a) => a.name.toLowerCase() === data.name.toLowerCase(),
		);
		if (existingAuthor) {
			throw new Error("Autor s týmto menom už existuje");
		}

		const newAuthor: Author = {
			id: `author_${Date.now()}`,
			...data,
			photoUrl: data.photoUrl || undefined,
			birthDate: data.birthDate || undefined,
			nationality: data.nationality || undefined,
			createdAt: new Date().toISOString(),
		};

		authorsData.push(newAuthor);
		saveToStorage();
		return newAuthor;
	},

	// Update author
	update: async (data: UpdateAuthorData): Promise<Author> => {
		await delay();

		const index = authorsData.findIndex((author) => author.id === data.id);
		if (index === -1) {
			throw new Error("Autor nebol nájdený");
		}

		const existingAuthor = authorsData[index];

		// Check name uniqueness if changed
		if (data.name && data.name !== existingAuthor.name) {
			const duplicateAuthor = authorsData.find(
				(a) =>
					a.name.toLowerCase() === data.name!.toLowerCase() && a.id !== data.id,
			);
			if (duplicateAuthor) {
				throw new Error("Autor s týmto menom už existuje");
			}
		}

		const updatedAuthor: Author = {
			...existingAuthor,
			...data,
			id: existingAuthor.id,
		};

		authorsData[index] = updatedAuthor;

		// Update author name in all books
		booksData = booksData.map((book) =>
			book.authorId === updatedAuthor.id
				? { ...book, authorName: updatedAuthor.name }
				: book,
		);

		saveToStorage();
		return updatedAuthor;
	},

	// Delete author
	delete: async (id: string): Promise<void> => {
		await delay();

		const index = authorsData.findIndex((author) => author.id === id);
		if (index === -1) {
			throw new Error("Autor nebol nájdený");
		}

		// Check if author has books
		const hasBooks = booksData.some((book) => book.authorId === id);
		if (hasBooks) {
			throw new Error(
				"Nemôžete vymazať autora, ktorý má knihy. Najprv vymažte všetky jeho knihy.",
			);
		}

		authorsData.splice(index, 1);
		saveToStorage();
	},
};

// ============= CATEGORIES CRUD =============

export const mockCategoriesCrudApi = {
	// Get all categories
	getAll: async (): Promise<Category[]> => {
		await delay();
		return [...categoriesData];
	},

	// Get category by ID
	getById: async (id: string): Promise<Category | null> => {
		await delay();
		return categoriesData.find((category) => category.id === id) || null;
	},

	// Create category
	create: async (data: CreateCategoryData): Promise<Category> => {
		await delay();

		// Check if category with same name exists
		const existingCategory = categoriesData.find(
			(c) => c.name.toLowerCase() === data.name.toLowerCase(),
		);
		if (existingCategory) {
			throw new Error("Kategória s týmto názvom už existuje");
		}

		const newCategory: Category = {
			id: `category_${Date.now()}`,
			...data,
			createdAt: new Date().toISOString(),
		};

		categoriesData.push(newCategory);
		saveToStorage();
		return newCategory;
	},

	// Update category
	update: async (data: UpdateCategoryData): Promise<Category> => {
		await delay();

		const index = categoriesData.findIndex(
			(category) => category.id === data.id,
		);
		if (index === -1) {
			throw new Error("Kategória nebola nájdená");
		}

		const existingCategory = categoriesData[index];

		// Check name uniqueness if changed
		if (data.name && data.name !== existingCategory.name) {
			const duplicateCategory = categoriesData.find(
				(c) =>
					c.name.toLowerCase() === data.name!.toLowerCase() && c.id !== data.id,
			);
			if (duplicateCategory) {
				throw new Error("Kategória s týmto názvom už existuje");
			}
		}

		const updatedCategory: Category = {
			...existingCategory,
			...data,
			id: existingCategory.id,
		};

		categoriesData[index] = updatedCategory;

		// Update category name in all books
		booksData = booksData.map((book) =>
			book.categoryId === updatedCategory.id
				? { ...book, categoryName: updatedCategory.name }
				: book,
		);

		saveToStorage();
		return updatedCategory;
	},

	// Delete category
	delete: async (id: string): Promise<void> => {
		await delay();

		const index = categoriesData.findIndex((category) => category.id === id);
		if (index === -1) {
			throw new Error("Kategória nebola nájdená");
		}

		// Check if category has books
		const hasBooks = booksData.some((book) => book.categoryId === id);
		if (hasBooks) {
			throw new Error(
				"Nemôžete vymazať kategóriu, ktorá má knihy. Najprv presuňte alebo vymažte všetky knihy.",
			);
		}

		categoriesData.splice(index, 1);
		saveToStorage();
	},
};

// Export helper to refresh data
export const refreshCrudData = () => {
	if (typeof window !== "undefined") {
		const storedBooks = localStorage.getItem("library_books");
		const storedAuthors = localStorage.getItem("library_authors");
		const storedCategories = localStorage.getItem("library_categories");

		if (storedBooks) booksData = JSON.parse(storedBooks);
		if (storedAuthors) authorsData = JSON.parse(storedAuthors);
		if (storedCategories) categoriesData = JSON.parse(storedCategories);
	}
};
