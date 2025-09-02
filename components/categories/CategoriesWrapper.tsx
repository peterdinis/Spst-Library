"use client";

import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  name: string;
  description: string;
  bookCount: number;
  availableCount: number;
  popularBooks: string[];
  color: string;
  icon: string;
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Classic Literature",
    description:
      "Timeless works that have shaped literature and continue to influence readers today.",
    bookCount: 45,
    availableCount: 32,
    popularBooks: [
      "To Kill a Mockingbird",
      "The Great Gatsby",
      "Pride and Prejudice",
    ],
    color: "bg-primary/10 text-primary border-primary/20",
    icon: "📚",
  },
  {
    id: "2",
    name: "Science Fiction",
    description:
      "Explore futuristic worlds, advanced technology, and imaginative stories.",
    bookCount: 38,
    availableCount: 25,
    popularBooks: ["1984", "Dune", "Foundation"],
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "🚀",
  },
  {
    id: "3",
    name: "Romance",
    description: "Stories of love, relationships, and emotional journeys.",
    bookCount: 52,
    availableCount: 41,
    popularBooks: ["Pride and Prejudice", "Jane Eyre", "The Notebook"],
    color: "bg-pink-100 text-pink-700 border-pink-200",
    icon: "💕",
  },
  {
    id: "4",
    name: "Mystery & Thriller",
    description: "Suspenseful stories that keep you on the edge of your seat.",
    bookCount: 41,
    availableCount: 29,
    popularBooks: [
      "Gone Girl",
      "The Girl with the Dragon Tattoo",
      "Sherlock Holmes",
    ],
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: "🔍",
  },
  {
    id: "5",
    name: "Biography & History",
    description:
      "True stories of remarkable people and significant historical events.",
    bookCount: 33,
    availableCount: 27,
    popularBooks: ["Steve Jobs", "Sapiens", "The Diary of Anne Frank"],
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: "📖",
  },
  {
    id: "6",
    name: "Young Adult",
    description:
      "Coming-of-age stories and adventures perfect for teenage readers.",
    bookCount: 47,
    availableCount: 35,
    popularBooks: [
      "The Hunger Games",
      "Harry Potter",
      "The Fault in Our Stars",
    ],
    color: "bg-green-100 text-green-700 border-green-200",
    icon: "🌟",
  },
  {
    id: "7",
    name: "Adventure",
    description:
      "Thrilling journeys and exciting escapades across different worlds.",
    bookCount: 29,
    availableCount: 23,
    popularBooks: [
      "Lord of the Flies",
      "Robinson Crusoe",
      "The Adventures of Tom Sawyer",
    ],
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: "🗺️",
  },
  {
    id: "8",
    name: "Self-Help",
    description: "Books to inspire personal growth and development.",
    bookCount: 31,
    availableCount: 28,
    popularBooks: ["How to Win Friends", "The 7 Habits", "Atomic Habits"],
    color: "bg-teal-100 text-teal-700 border-teal-200",
    icon: "💡",
  },
  {
    id: "9",
    name: "Fantasy",
    description: "Magical worlds, mythical creatures, and epic quests.",
    bookCount: 56,
    availableCount: 42,
    popularBooks: [
      "The Lord of the Rings",
      "Harry Potter",
      "A Game of Thrones",
    ],
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    icon: "🐉",
  },
  {
    id: "10",
    name: "Horror",
    description: "Chilling tales that will keep you up at night.",
    bookCount: 27,
    availableCount: 18,
    popularBooks: ["It", "The Shining", "Dracula"],
    color: "bg-red-100 text-red-700 border-red-200",
    icon: "👻",
  },
  {
    id: "11",
    name: "Science & Technology",
    description: "Explore the latest advancements and scientific discoveries.",
    bookCount: 39,
    availableCount: 31,
    popularBooks: [
      "A Brief History of Time",
      "The Innovators",
      "The Code Book",
    ],
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    icon: "🔬",
  },
  {
    id: "12",
    name: "Cooking & Food",
    description:
      "Delicious recipes and culinary adventures from around the world.",
    bookCount: 34,
    availableCount: 29,
    popularBooks: [
      "Salt, Fat, Acid, Heat",
      "The Joy of Cooking",
      "Mastering the Art of French Cooking",
    ],
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: "🍳",
  },
];

const CategoriesWrapper: FC = () => {
  const [categories] = useState(mockCategories);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 8;

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const totalBooks = categories.reduce((sum, cat) => sum + cat.bookCount, 0);
  const totalAvailable = categories.reduce(
    (sum, cat) => sum + cat.availableCount,
    0,
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const statsVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Book Categories
          </h1>
          <p className="text-muted-foreground mb-6">
            Explore our diverse collection organized by genre and subject
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search categories..."
              className="pl-10 pr-4 py-2 w-full max-w-md border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Stats */}
          <motion.div
            className="bg-card p-6 rounded-lg shadow-card mb-6"
            variants={statsVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {totalBooks}
                </div>
                <div className="text-sm text-muted-foreground">Total Books</div>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-success" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {totalAvailable}
                </div>
                <div className="text-sm text-muted-foreground">
                  Available Now
                </div>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {categories.length}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Categories Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`page-${currentPage}-${searchQuery}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {currentCategories.map((category, index) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <Card className="h-full hover-lift shadow-card group overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl">{category.icon}</div>
                      <Badge className={category.color}>
                        {category.availableCount} available
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-smooth">
                      {category.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {category.description}
                    </p>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-foreground">
                        Popular Books:
                      </div>
                      <div className="space-y-1">
                        {category.popularBooks.slice(0, 3).map((book, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-muted-foreground flex items-center"
                          >
                            <BookOpen className="h-3 w-3 mr-1" />
                            {book}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {category.bookCount} total books
                      </span>
                      <Link
                        href={`/books?category=${encodeURIComponent(category.name)}`}
                      >
                        <Button variant="outline" size="sm">
                          Browse
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="flex justify-center items-center space-x-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => handlePageChange(page)}
                className="w-10 h-10"
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Results count */}
        <motion.div
          className="text-center text-muted-foreground mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Showing {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, filteredCategories.length)} of{" "}
          {filteredCategories.length} categories
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-lg text-white">
            <h2 className="text-2xl font-bold mb-2">
              Can't find what you're looking for?
            </h2>
            <p className="mb-4 opacity-90">
              Our librarians are here to help you discover your next great read
            </p>
            <Button variant="secondary" size="lg">
              Contact Librarian
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoriesWrapper;
