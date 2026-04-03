export const mockAuthors = [
  { id: "1", name: "J.K. Rowling", bio: "Britská autorka známa sériou o Harrym Potterovi." },
  { id: "2", name: "J.R.R. Tolkien", bio: "Anglický spisovateľ, autor Pána prsteňov." },
  { id: "3", name: "George R.R. Martin", bio: "Americký autor série Pieseň ľadu a ohňa." },
];

export const mockCategories = [
  { id: "1", name: "Fantasy" },
  { id: "2", name: "Sci-Fi" },
  { id: "3", name: "Román" },
];

export const mockBooks = [
  {
    id: "1",
    title: "Harry Potter a Kameň mudrcov",
    description: "Prvý diel populárnej série o mladom čarodejníkovi, ktorý objaví svoj skutočný pôvod.",
    coverUrl: "https://images.unsplash.com/photo-1626618011154-1b5e1b2138eb?q=80&w=400&auto=format&fit=crop",
    isbn: "978-80-00-00001",
    availableCopies: 3,
    author: "J.K. Rowling",
    authorId: "1",
    category: "Fantasy",
    categoryId: "1",
  },
  {
    id: "2",
    title: "Pán prsteňov: Spoločenstvo Prsteňa",
    description: "Epický fantasy príbeh o ceste za zničením Vládnuceho prsteňa.",
    coverUrl: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=400&auto=format&fit=crop",
    isbn: "978-80-00-00002",
    availableCopies: 0,
    author: "J.R.R. Tolkien",
    authorId: "2",
    category: "Fantasy",
    categoryId: "1",
  },
  {
    id: "3",
    title: "Hra o tróny",
    description: "Zápas vznešených rodín o Železný trón na kontinente Westeros.",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop",
    isbn: "978-80-00-00003",
    availableCopies: 5,
    author: "George R.R. Martin",
    authorId: "3",
    category: "Fantasy",
    categoryId: "1",
  },
];

export const mockBorrowedBooks = [
  {
    borrowId: "b1",
    bookId: "2",
    title: "Pán prsteňov: Spoločenstvo Prsteňa",
    coverUrl: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=400&auto=format&fit=crop",
    author: "J.R.R. Tolkien",
    borrowDate: new Date(Date.now() - 1000000000).toISOString(),
    returnDate: null,
    status: "borrowed"
  }
];

export const mockUser = {
  id: "u1",
  name: "Alexander Veľký",
  email: "alexander.velky@spst.sk",
  role: "Študent",
  joinDate: "2023-09-02",
  avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=256&q=80"
};
