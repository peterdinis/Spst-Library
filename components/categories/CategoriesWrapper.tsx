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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "@/hooks/categories/useCategories";
import { ITEMS_PER_PAGE } from "@/constants/applicationConstants";
import { Category } from "@/types/categoryTypes";
import { useDebounce } from "@/hooks/shared/useDebounce";

const CategoriesWrapper: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const { data, isLoading, error } = useCategories(
    currentPage,
    ITEMS_PER_PAGE,
    debouncedSearch || undefined,
  );

  const categories = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 0;
  const totalBooks = categories.reduce(
    (sum: number, cat: Category) => sum + cat.books.length,
    0,
  );
  const totalAvailable = categories.reduce(
    (sum: number, cat: Category) =>
      sum +
      cat.books.filter(
        (book: any) => book.available !== false,
      ).length,
    0,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const statsVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          Nepodarilo sa načítať kategórie: {(error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Kategórie kníh
          </h1>
          <p className="text-muted-foreground mb-6">
            Preskúmajte našu rozmanitú zbierku podľa žánru a tém
          </p>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Hľadať kategórie..."
              className="pl-10 pr-4 py-2 w-full max-w-md border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Štatistiky */}
          <motion.div
            className="bg-card p-6 rounded-lg shadow-card mb-6"
            variants={statsVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {totalBooks}
                </div>
                <div className="text-sm text-muted-foreground">
                  Celkový počet kníh
                </div>
              </motion.div>
              <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-success" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {totalAvailable}
                </div>
                <div className="text-sm text-muted-foreground">
                  Dostupné teraz
                </div>
              </motion.div>
              <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {data?.meta.total ?? 0}
                </div>
                <div className="text-sm text-muted-foreground">Kategórie</div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`page-${currentPage}-${searchQuery}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {categories.map((category: Category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full shadow-card group overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl">📚</div>
                      <Badge>{category.books.length} kníh</Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-smooth">
                      {category.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {category.description ?? "Popis nie je k dispozícii."}
                    </p>

                    <div className="flex items-center cursor-pointer justify-between text-sm">
                      <span className="text-muted-foreground">
                        {category.books.length} celkom
                      </span>
                      <Link
                        href={`/categories/${category.id}`}
                      >
                        <Button variant="outline" size="sm">
                          Prezrieť
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Stránkovanie */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mb-8">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesWrapper;
