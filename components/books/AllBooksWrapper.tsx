"use client"

import { Filter, Search, BookOpen } from "lucide-react";
import { FC, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { BookCard } from "./BookCard";

const mockBooks = [
    {
        id: "1",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        category: "Classic Literature",
        isbn: "978-0-06-112008-4",
        publishedYear: 1960,
        available: true,
        description: "A gripping tale of racial injustice and the loss of innocence in the American South."
    },
    {
        id: "2",
        title: "1984",
        author: "George Orwell",
        category: "Science Fiction",
        isbn: "978-0-452-28423-4",
        publishedYear: 1949,
        available: false,
        dueDate: "2024-01-15",
        description: "A dystopian social science fiction novel about totalitarian control."
    },
    {
        id: "3",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Classic Literature",
        isbn: "978-0-7432-7356-5",
        publishedYear: 1925,
        available: true,
        description: "A critique of the American Dream set in the Jazz Age."
    },
    {
        id: "4",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        category: "Romance",
        isbn: "978-0-14-143951-8",
        publishedYear: 1813,
        available: true,
        description: "A romantic novel of manners set in Georgian England."
    },
    {
        id: "5",
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        category: "Coming of Age",
        isbn: "978-0-316-76948-0",
        publishedYear: 1951,
        available: false,
        dueDate: "2024-01-20",
        description: "A controversial novel about teenage rebellion and alienation."
    },
    {
        id: "6",
        title: "Lord of the Flies",
        author: "William Golding",
        category: "Adventure",
        isbn: "978-0-571-05686-2",
        publishedYear: 1954,
        available: true,
        description: "A story about a group of British boys stranded on an uninhabited island."
    }
];

const AllBooksWrapper: FC = () => {
    const [books] = useState(mockBooks);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [availabilityFilter, setAvailabilityFilter] = useState("all");

    const categories = useMemo(() => Array.from(new Set(books.map(book => book.category))), [books]);

    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
            const matchesAvailability = availabilityFilter === "all" ||
                (availabilityFilter === "available" && book.available) ||
                (availabilityFilter === "borrowed" && !book.available);
            return matchesSearch && matchesCategory && matchesAvailability;
        });
    }, [books, searchTerm, selectedCategory, availabilityFilter]);

    const availableCount = books.filter(book => book.available).length;
    const borrowedCount = books.filter(book => !book.available).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <BookOpen className="h-7 w-7 text-primary" /> Book Catalog
                    </h1>
                    <p className="text-gray-500">Browse and borrow books from our collection</p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 mt-6">
                        <Badge className="bg-green-100 text-green-800 border border-green-200"> 
                            {availableCount} Available
                        </Badge>
                        <Badge className="bg-red-100 text-red-800 border border-red-200">
                            {borrowedCount} Borrowed
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                            {books.length} Total
                        </Badge>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 animate-slide-up">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <div className="flex items-center space-x-2 mb-5">
                            <Filter className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-semibold text-gray-700">Filter Books</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search books or authors..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 focus:ring-primary focus:border-primary"
                                />
                            </div>

                            {/* Category Filter */}
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Availability Filter */}
                            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Availability" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Books</SelectItem>
                                    <SelectItem value="available">Available Only</SelectItem>
                                    <SelectItem value="borrowed">Borrowed Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Books Grid */}
                {filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBooks.map((book, index) => (
                            <div 
                                key={book.id} 
                                className="transform transition hover:scale-105 animate-scale-in"
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                <BookCard book={book} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 animate-fade-in">
                        <p className="text-gray-400 text-lg font-medium">No books found matching your criteria.</p>
                        <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllBooksWrapper;
