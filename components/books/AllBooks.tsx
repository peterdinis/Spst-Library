"use client"

import { FC, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Book,
    Calendar,
    User,
    Star,
    BookOpen,
    Clock,
    Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Pagination from "../shared/Pagination";
import SearchBar from "../shared/SearchBar";


const books = [
    {
        id: "1",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Fiction",
        isbn: "978-0-7432-7356-5",
        publishedYear: 1925,
        rating: 4.2,
        status: "Available",
        copies: 5,
        description: "A classic American novel about the Jazz Age and the American Dream"
    },
    {
        id: "2",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        category: "Fiction",
        isbn: "978-0-06-112008-4",
        publishedYear: 1960,
        rating: 4.5,
        status: "Available",
        copies: 3,
        description: "A gripping tale of racial injustice and childhood innocence"
    },
    {
        id: "3",
        title: "1984",
        author: "George Orwell",
        category: "Fiction",
        isbn: "978-0-452-28423-4",
        publishedYear: 1949,
        rating: 4.6,
        status: "Checked Out",
        copies: 0,
        description: "A dystopian social science fiction novel and cautionary tale"
    },
    {
        id: "4",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        category: "Fiction",
        isbn: "978-0-14-143951-8",
        publishedYear: 1813,
        rating: 4.3,
        status: "Available",
        copies: 4,
        description: "A romantic novel of manners set in Georgian England"
    },
    {
        id: "5",
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        category: "Fiction",
        isbn: "978-0-316-76948-0",
        publishedYear: 1951,
        rating: 3.8,
        status: "Available",
        copies: 2,
        description: "A controversial novel about teenage rebellion and angst"
    },
    {
        id: "6",
        title: "Lord of the Flies",
        author: "William Golding",
        category: "Fiction",
        isbn: "978-0-571-05686-2",
        publishedYear: 1954,
        rating: 4.0,
        status: "Available",
        copies: 6,
        description: "A novel about a group of British boys stranded on an uninhabited island"
    },
    {
        id: "7",
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        category: "Fantasy",
        isbn: "978-0-547-92822-7",
        publishedYear: 1937,
        rating: 4.7,
        status: "Available",
        copies: 8,
        description: "A fantasy adventure novel about Bilbo Baggins and his journey"
    },
    {
        id: "8",
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        category: "Fantasy",
        isbn: "978-0-7475-3269-9",
        publishedYear: 1997,
        rating: 4.8,
        status: "Available",
        copies: 12,
        description: "The first book in the beloved Harry Potter series"
    },
    {
        id: "9",
        title: "Animal Farm",
        author: "George Orwell",
        category: "Fiction",
        isbn: "978-0-452-28424-1",
        publishedYear: 1945,
        rating: 4.1,
        status: "Available",
        copies: 5,
        description: "An allegorical novella about farm animals who rebel against their human farmer"
    },
    {
        id: "10",
        title: "Brave New World",
        author: "Aldous Huxley",
        category: "Science Fiction",
        isbn: "978-0-06-085052-4",
        publishedYear: 1932,
        rating: 4.0,
        status: "Available",
        copies: 3,
        description: "A dystopian novel set in a futuristic World State"
    },
    {
        id: "11",
        title: "The Chronicles of Narnia",
        author: "C.S. Lewis",
        category: "Fantasy",
        isbn: "978-0-06-623851-4",
        publishedYear: 1950,
        rating: 4.4,
        status: "Available",
        copies: 7,
        description: "A series of seven fantasy novels set in the magical land of Narnia"
    },
    {
        id: "12",
        title: "Jane Eyre",
        author: "Charlotte Brontë",
        category: "Fiction",
        isbn: "978-0-14-144114-6",
        publishedYear: 1847,
        rating: 4.2,
        status: "Checked Out",
        copies: 0,
        description: "A coming-of-age novel about an orphaned girl who becomes a governess"
    }
];

const AllBooks: FC = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filteredBooks = useMemo(() => {
        return books.filter(book =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const getStatusColor = (status: string) => {
        return status === "Available" ? "bg-green-500/20 text-green-700 dark:text-green-300" : "bg-red-500/20 text-red-700 dark:text-red-300";
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(rating)
                            ? "text-yellow-500 fill-current"
                            : "text-muted-foreground"
                            }`}
                    />
                ))}
                <span className="text-sm text-muted-foreground ml-1">({rating})</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text">
                        Všetky knihy
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                        Discover and explore all books available in our school library
                    </p>

                    <div className="max-w-md mx-auto">
                        <SearchBar
                            onSearch={handleSearch}
                            placeholder="Search books, authors, or categories..."
                            className="mb-6"
                        />
                    </div>

                    <div className="flex justify-center items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{filteredBooks.length} Books Found</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4" />
                            <span>Multiple Categories</span>
                        </div>
                    </div>
                </div>

                {currentBooks.length === 0 ? (
                    <div className="text-center py-12">
                        <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No books found</h3>
                        <p className="text-muted-foreground">Try adjusting your search terms</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 shadow-2xl md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {currentBooks.map((book, index) => (
                                <motion.div
                                    key={book.id}
                                    className="block"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                >
                                    <Card className="h-full shadow-2xl hover:shadow-glow transition-smooth border-0">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    <Book className="h-5 w-5 text-primary" />
                                                </div>
                                                <Badge className={getStatusColor(book.status)}>
                                                    {book.status}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-lg line-clamp-2 min-h-[3.5rem]">
                                                {book.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                <User className="h-4 w-4" />
                                                <span className="truncate">{book.author}</span>
                                            </div>

                                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>{book.publishedYear}</span>
                                                <span>•</span>
                                                <span>{book.category}</span>
                                            </div>

                                            {renderStars(book.rating)}

                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                {book.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center space-x-1 text-sm">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">
                                                        {book.copies > 0 ? `${book.copies} available` : 'Out of stock'}
                                                    </span>
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                    {book.isbn}
                                                </Badge>
                                            </div>

                                            <div className="pt-4">
                                                <Link
                                                    href={`/books/${book.id}`}
                                                    className="inline-block w-full text-center bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </main>
        </div>
    )
}

export default AllBooks;
