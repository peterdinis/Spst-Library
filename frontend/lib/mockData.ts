import {
	User,
	Author,
	Category,
	Book,
	BorrowRecord,
	Notification,
} from "./types";

// Mock Users
export const mockUsers: User[] = [
	{
		id: "1",
		email: "admin@library.sk",
		fullName: "Admin Používateľ",
		role: "admin",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
		phone: "+421 900 123 456",
		address: "Bratislava, Slovensko",
		memberSince: "2023-01-15T10:00:00Z",
	},
	{
		id: "2",
		email: "user@library.sk",
		fullName: "Ján Novák",
		role: "user",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jan",
		phone: "+421 900 654 321",
		address: "Košice, Slovensko",
		memberSince: "2023-06-20T14:30:00Z",
	},
	{
		id: "3",
		email: "maria@library.sk",
		fullName: "Mária Kováčová",
		role: "user",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
		phone: "+421 900 789 012",
		address: "Žilina, Slovensko",
		memberSince: "2024-02-10T09:15:00Z",
	},
];

// Mock Authors
export const mockAuthors: Author[] = [
	{
		id: "1",
		name: "J.K. Rowling",
		biography:
			"Joanne Rowlingová je britská spisovateľka, ktorá sa proslavila svojou sériou kníh o Harrym Potterovi. Narodila sa 31. júla 1965 v Yate v Anglicku. Pred úspechom s Harrym Potterom pracovala ako učiteľka angličtiny. Prvá kniha série, Harry Potter a Kameň mudrcov, bola vydaná v roku 1997 a stala sa celosvetovým fenoménom.",
		photoUrl:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
		birthDate: "1965-07-31",
		nationality: "Britská",
		createdAt: "2023-01-01T00:00:00Z",
	},
	{
		id: "2",
		name: "George Orwell",
		biography:
			"George Orwell, vlastným menom Eric Arthur Blair, bol anglický spisovateľ a novinár. Narodil sa 25. júna 1903 v Indii. Je známy svojimi dystopickými románmi 1984 a Farma zvierat, ktoré kritizujú totalitné režimy. Jeho diela sú považované za klasiku svetovej literatúry a majú veľký vplyv na politické myslenie.",
		photoUrl:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
		birthDate: "1903-06-25",
		nationality: "Britská",
		createdAt: "2023-01-01T00:00:00Z",
	},
	{
		id: "3",
		name: "Agatha Christie",
		biography:
			"Agatha Christie bola britská spisovateľka detektívnych románov a poviedok. Narodila sa 15. septembra 1890 v Torquay v Anglicku. Je autorkou viac ako 60 detektívnych románov a 14 poviedkových zbierok. Jej najznámejšie postavy sú detektív Hercule Poirot a slečna Marple. Je najprekladanejšou autorkou v histórii.",
		photoUrl:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
		birthDate: "1890-09-15",
		nationality: "Britská",
		createdAt: "2023-01-01T00:00:00Z",
	},
	{
		id: "4",
		name: "Milan Kundera",
		biography:
			"Milan Kundera je česko-francúzsky spisovateľ. Narodil sa 1. apríla 1929 v Brne. Jeho najznámejším dielom je román Neznesiteľná ľahkosť bytia. V roku 1975 emigroval do Francúzska, kde žije dodnes. Jeho diela sa vyznačujú filozofickým prístupom a skúmaním ľudskej existencie.",
		photoUrl:
			"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
		birthDate: "1929-04-01",
		nationality: "Česko-francúzska",
		createdAt: "2023-01-01T00:00:00Z",
	},
	{
		id: "5",
		name: "Gabriel García Márquez",
		biography:
			"Gabriel García Márquez bol kolumbijský spisovateľ, novinár a nositeľ Nobelovej ceny za literatúru. Narodil sa 6. marca 1927 v Aracataca v Kolumbii. Je považovaný za jedného z najvýznamnejších autorov 20. storočia a zakladateľa magického realizmu. Jeho najslávnejším dielom je román Sto rokov samoty.",
		photoUrl:
			"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
		birthDate: "1927-03-06",
		nationality: "Kolumbijská",
		createdAt: "2023-01-01T00:00:00Z",
	},
];

// Mock Categories
export const mockCategories: Category[] = [
	{
		id: "1",
		name: "Fantasy",
		description:
			"Fantastické príbehy plné mágie, dobrodružstva a mytických bytostí. Žáner, ktorý prenáša čitateľov do imaginárnych svetov.",
		createdAt: "2023-01-01T00:00:00Z",
	},
	{
		id: "2",
		name: "Sci-Fi",
		description:
			"Vedecko-fantastické diela skúmajúce budúcnosť, technológie, vesmír a alternatívne reality.",
		createdAt: "2023-01-01T00:00:00Z",
	},
	{
		id: "3",
		name: "Detektívky",
		description:
			"Napínavé príbehy plné záhad, vyšetrovania a odhaľovania tajomstiev.",
		createdAt: "2023-01-01T00:00:00Z",
	},
	{
		id: "4",
		name: "Klasika",
		description:
			"Nadčasové literárne diela, ktoré ovplyvnili generácie čitateľov a formovali svetovú literatúru.",
		createdAt: "2023-01-01T00:00:00Z",
	},
	{
		id: "5",
		name: "Romantika",
		description: "Príbehy o láske, vzťahoch a emocionálnych putovaniach.",
		createdAt: "2023-01-01T00:00:00Z",
	},
];

// Mock Books
export const mockBooks: Book[] = [
	{
		id: "1",
		title: "Harry Potter a Kameň mudrcov",
		authorId: "1",
		authorName: "J.K. Rowling",
		categoryId: "1",
		categoryName: "Fantasy",
		isbn: "978-80-00-02875-5",
		description:
			"Prvá kniha zo série o Harrym Potterovi. Harry Potter sa dozvedá, že je čarodejník a začína svoje dobrodružstvo v Rokforte, škole čarodejníctva a mágie.",
		coverUrl:
			"https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
		publishedYear: 1997,
		totalCopies: 5,
		availableCopies: 3,
		createdAt: "2023-01-15T10:00:00Z",
	},
	{
		id: "2",
		title: "Harry Potter a Tajomná komnata",
		authorId: "1",
		authorName: "J.K. Rowling",
		categoryId: "1",
		categoryName: "Fantasy",
		isbn: "978-80-00-02876-2",
		description:
			"Druhá kniha série. Harry sa vracia do Rokfortu a musí čeliť novým záhadám a nebezpečenstvám spojeným s Tajomnou komnatou.",
		coverUrl:
			"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
		publishedYear: 1998,
		totalCopies: 4,
		availableCopies: 4,
		createdAt: "2023-01-15T10:00:00Z",
	},
	{
		id: "3",
		title: "1984",
		authorId: "2",
		authorName: "George Orwell",
		categoryId: "2",
		categoryName: "Sci-Fi",
		isbn: "978-80-551-6572-1",
		description:
			"Dystopický román o totalitnej spoločnosti, kde Veľký brat sleduje každý krok občanov. Príbeh Winstona Smitha, ktorý sa pokúša vzbúriť proti systému.",
		coverUrl:
			"https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
		publishedYear: 1949,
		totalCopies: 6,
		availableCopies: 2,
		createdAt: "2023-02-01T10:00:00Z",
	},
	{
		id: "4",
		title: "Farma zvierat",
		authorId: "2",
		authorName: "George Orwell",
		categoryId: "4",
		categoryName: "Klasika",
		isbn: "978-80-551-6573-8",
		description:
			"Alegorický príbeh o zvieratách, ktoré sa vzbúria proti farmárovi. Satira na totalitné režimy a korupciu moci.",
		coverUrl:
			"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
		publishedYear: 1945,
		totalCopies: 5,
		availableCopies: 5,
		createdAt: "2023-02-01T10:00:00Z",
	},
	{
		id: "5",
		title: "Vražda v Orient exprese",
		authorId: "3",
		authorName: "Agatha Christie",
		categoryId: "3",
		categoryName: "Detektívky",
		isbn: "978-80-7391-234-5",
		description:
			"Hercule Poirot vyšetruje vraždu v luxusnom vlaku Orient Express. Jeden z najslávnejších detektívnych románov všetkých čias.",
		coverUrl:
			"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
		publishedYear: 1934,
		totalCopies: 4,
		availableCopies: 1,
		createdAt: "2023-03-10T10:00:00Z",
	},
	{
		id: "6",
		title: "Smrť na Níle",
		authorId: "3",
		authorName: "Agatha Christie",
		categoryId: "3",
		categoryName: "Detektívky",
		isbn: "978-80-7391-235-2",
		description:
			"Hercule Poirot sa ocitá na luxusnej plavbe po Níle, kde dôjde k vražde. Musí odhaliť vraha skôr, ako loď dorazí do prístavu.",
		coverUrl:
			"https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
		publishedYear: 1937,
		totalCopies: 3,
		availableCopies: 3,
		createdAt: "2023-03-10T10:00:00Z",
	},
	{
		id: "7",
		title: "Neznesiteľná ľahkosť bytia",
		authorId: "4",
		authorName: "Milan Kundera",
		categoryId: "4",
		categoryName: "Klasika",
		isbn: "978-80-7391-456-1",
		description:
			"Filozofický román o láske, sexe a politike v Československu počas Pražskej jari. Skúma otázky ľudskej existencie a voľby.",
		coverUrl:
			"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
		publishedYear: 1984,
		totalCopies: 4,
		availableCopies: 4,
		createdAt: "2023-04-05T10:00:00Z",
	},
	{
		id: "8",
		title: "Sto rokov samoty",
		authorId: "5",
		authorName: "Gabriel García Márquez",
		categoryId: "4",
		categoryName: "Klasika",
		isbn: "978-80-556-2341-7",
		description:
			"Magicko-realistický príbeh rodiny Buendíovcov v mestečku Macondo. Jedno z najvýznamnejších diel latinsko-americkej literatúry.",
		coverUrl:
			"https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop",
		publishedYear: 1967,
		totalCopies: 5,
		availableCopies: 2,
		createdAt: "2023-04-20T10:00:00Z",
	},
];

// Mock Borrow Records
export const mockBorrowRecords: BorrowRecord[] = [
	{
		id: "1",
		userId: "2",
		bookId: "1",
		bookTitle: "Harry Potter a Kameň mudrcov",
		bookCoverUrl:
			"https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
		borrowDate: "2024-11-15T10:00:00Z",
		dueDate: "2024-12-15T10:00:00Z",
		status: "active",
		notes: "Prvé vypožičanie",
	},
	{
		id: "2",
		userId: "2",
		bookId: "3",
		bookTitle: "1984",
		bookCoverUrl:
			"https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
		borrowDate: "2024-10-01T10:00:00Z",
		dueDate: "2024-11-01T10:00:00Z",
		returnDate: "2024-10-28T14:30:00Z",
		status: "returned",
		notes: "Vrátené včas",
	},
	{
		id: "3",
		userId: "3",
		bookId: "5",
		bookTitle: "Vražda v Orient exprese",
		bookCoverUrl:
			"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
		borrowDate: "2024-11-01T10:00:00Z",
		dueDate: "2024-11-20T10:00:00Z",
		status: "overdue",
		notes: "Po termíne vrátenia",
	},
];

// Mock Notifications
export const mockNotifications: Notification[] = [
	{
		id: "1",
		userId: "2",
		type: "borrow",
		title: "Kniha úspešne vypožičaná",
		message:
			'Úspešne ste si vypožičali knihu "Harry Potter a Kameň mudrcov". Termín vrátenia je 15.12.2024.',
		read: false,
		createdAt: "2024-11-15T10:00:00Z",
		relatedBookId: "1",
		relatedBorrowId: "1",
	},
	{
		id: "2",
		userId: "2",
		type: "reminder",
		title: "Pripomienka vrátenia knihy",
		message:
			'Knihu "Harry Potter a Kameň mudrcov" je potrebné vrátiť do 3 dní.',
		read: false,
		createdAt: "2024-12-05T09:00:00Z",
		relatedBookId: "1",
		relatedBorrowId: "1",
	},
	{
		id: "3",
		userId: "2",
		type: "return",
		title: "Kniha vrátená",
		message: 'Úspešne ste vrátili knihu "1984". Ďakujeme!',
		read: true,
		createdAt: "2024-10-28T14:30:00Z",
		relatedBookId: "3",
		relatedBorrowId: "2",
	},
	{
		id: "4",
		userId: "3",
		type: "overdue",
		title: "Kniha po termíne vrátenia",
		message:
			'Kniha "Vražda v Orient exprese" je po termíne vrátenia. Prosím, vráťte ju čo najskôr.',
		read: false,
		createdAt: "2024-11-21T08:00:00Z",
		relatedBookId: "5",
		relatedBorrowId: "3",
	},
	{
		id: "5",
		userId: "2",
		type: "system",
		title: "Vitajte v knižnici",
		message:
			"Vitajte v našej online knižnici! Môžete si prezerať a vypožičiavať knihy.",
		read: true,
		createdAt: "2023-06-20T14:30:00Z",
	},
];

// Helper function to get initial data
export const getInitialMockData = () => ({
	users: mockUsers,
	authors: mockAuthors,
	categories: mockCategories,
	books: mockBooks,
	borrowRecords: mockBorrowRecords,
	notifications: mockNotifications,
});
