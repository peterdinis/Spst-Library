"use client";

import { FC, useMemo, useState } from "react";
import Link from "next/link";
import {
  Filter,
  Search,
  BookOpen,
  X,
  Sparkles,
  Library,
  User,
  Calendar,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBooks } from "@/hooks/books/useAllBooks";

// -------------------- TYPES --------------------
interface Author {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Rating {
  id: string;
  score: number;
}

interface BookTag {
  id: string;
  name: string;
}

interface Book {
  id: string;
  name: string; // backend field
  description?: string;
  createdAt: string;

  // relations
  author: Author;
  category: Category;
  ratings: Rating[];
  bookTags: BookTag[];

  // frontend-specific (mock for now, until BE supports)
  available?: boolean;
  dueDate?: string;
  publishedYear?: number;
  coverImage?: string;
}

// -------------------- BOOK CARD --------------------
interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const available = book.available ?? true;
  return (
    <Card className="hover-lift shadow-card group h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-smooth line-clamp-2">
              {book.name}
            </CardTitle>
            {book.author && (
              <div className="flex items-center space-x-1 mt-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="text-sm">{book.author.name}</span>
              </div>
            )}
          </div>
          <Badge
            variant={available ? "default" : "secondary"}
            className={
              available
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-amber-100 text-amber-800 border-amber-200"
            }
          >
            {available ? "Available" : "Borrowed"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        <div className="space-y-2 text-sm text-muted-foreground">
          {book.category && (
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>{book.category.name}</span>
            </div>
          )}
          {book.publishedYear && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Published: {book.publishedYear}</span>
            </div>
          )}
          {!available && book.dueDate && (
            <div className="flex items-center space-x-2 text-destructive">
              <Clock className="h-4 w-4" />
              <span>Due: {new Date(book.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {book.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {book.description}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Link href={`/books/${book.id}`} className="w-full">
          <Button
            variant="default"
            className="w-full flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

// -------------------- ALL BOOKS WRAPPER --------------------
const AllBooksWrapper: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // 🚀 fetchujeme dáta z API
  const { data, isLoading, isError } = useBooks({
    search: searchTerm,
    page: currentPage,
    limit: itemsPerPage,
  });

  const books: Book[] = data?.data ?? [];
  const totalBooks = data?.total ?? 0;
  const totalPages = data?.lastPage ?? 1;

  // apply availability + sort lokálne
  const filteredBooks = useMemo(() => {
    let result = [...books];

    const matchesAvailability = (book: Book) =>
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && book.available) ||
      (availabilityFilter === "borrowed" && !book.available);

    result = result.filter(matchesAvailability);

    result.sort((a, b) => {
      if (sortBy === "title") return a.name.localeCompare(b.name);
      if (sortBy === "author")
        return (a.author?.name ?? "").localeCompare(b.author?.name ?? "");
      if (sortBy === "year")
        return (b.publishedYear ?? 0) - (a.publishedYear ?? 0);
      return 0;
    });

    return result;
  }, [books, availabilityFilter, sortBy]);

  const availableCount = books.filter((book) => book.available).length;
  const borrowedCount = books.filter((book) => book.available === false).length;

  const clearFilters = () => {
    setSearchTerm("");
    setAvailabilityFilter("all");
    setSortBy("title");
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    searchTerm !== "",
    availabilityFilter !== "all",
    sortBy !== "title",
  ].filter(Boolean).length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-sky-100 mb-2 flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg text-white">
                  <Library className="h-7 w-7" />
                </div>
                Book Catalog
              </h1>
              <p className="text-gray-500">
                Browse and borrow books from our collection
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-white dark:bg-background rounded-lg p-3 shadow-sm border">
                <div className="text-sm text-gray-500 dark:text-sky-100">
                  Total Books
                </div>
                <div className="text-xl font-bold text-primary">
                  {totalBooks}
                </div>
              </div>
              <div className="bg-white dark:bg-background rounded-lg p-3 shadow-sm border">
                <div className="text-sm text-gray-500 dark:text-sky-100">
                  Available
                </div>
                <div className="text-xl font-bold text-green-600">
                  {availableCount}
                </div>
              </div>
              <div className="bg-white dark:bg-background rounded-lg p-3 shadow-sm border">
                <div className="text-sm text-gray-500 dark:text-sky-100">
                  Borrowed
                </div>
                <div className="text-xl font-bold text-amber-600">
                  {borrowedCount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-sky-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Explore Our Collection
          </h2>

          <div className="flex items-center gap-3">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Clear filters ({activeFiltersCount})
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 md:hidden"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div
          className={`mb-8 transition-all duration-300 ${showFilters ? "block" : "hidden md:block"}`}
        >
          <div className="bg-white dark:bg-stone-950 p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              {/* Search */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="search"
                  className="text-sm font-medium text-gray-700 dark:text-sky-100 mb-1 block"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400 dark:text-sky-100" />
                  </div>
                  <Input
                    id="search"
                    placeholder="Search books or authors..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <label
                  htmlFor="availability"
                  className="text-sm font-medium text-gray-700 dark:text-sky-100 mb-1 block"
                >
                  Availability
                </label>
                <Select
                  value={availabilityFilter}
                  onValueChange={(value) => {
                    setAvailabilityFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger id="availability" className="w-full">
                    <SelectValue placeholder="All Books" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Books</SelectItem>
                    <SelectItem value="available">Available Only</SelectItem>
                    <SelectItem value="borrowed">Borrowed Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div>
                <label
                  htmlFor="sort"
                  className="text-sm font-medium text-gray-700 dark:text-sky-100 mb-1 block"
                >
                  Sort By
                </label>
                <Select
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger id="sort" className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="year">Publication Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-16">Loading books...</div>
        ) : isError ? (
          <div className="text-center py-16 text-red-500">
            Failed to load books.
          </div>
        ) : filteredBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="transform transition-all duration-300 hover:scale-[1.02] animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-stone-900 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 dark:text-sky-100">
                  Page {currentPage} of {totalPages}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) pageNum = i + 1;
                      else if (currentPage <= 3) pageNum = i + 1;
                      else if (currentPage >= totalPages - 2)
                        pageNum = totalPages - 4 + i;
                      else pageNum = currentPage - 2 + i;

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          className="w-10 h-10 p-0"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="px-2">...</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 p-0"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 animate-fade-in bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search or filters. We couldn't find any books
              matching your criteria.
            </p>
            <Button onClick={clearFilters} variant="outline" className="mt-4">
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBooksWrapper;
