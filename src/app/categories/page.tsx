"use client";

import { useState, useMemo } from "react";
import { trpc } from "@/trpc/client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Library, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const ITEMS_PER_PAGE = 12;

export default function CategoriesPage() {
  const { data: categories, isLoading } = trpc.categories.getAll.useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, categories]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE));
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);

  return (
    <div className="space-y-12 pb-16">
      <div className="flex flex-col text-center items-center justify-center gap-4 bg-gradient-to-b from-primary/10 to-transparent py-16 rounded-3xl">
        <div className="p-4 bg-primary/20 rounded-full mb-2">
          <Library className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight">Kategórie</h1>
        <p className="text-xl text-slate-500 max-w-2xl">
          Prehľadávajte našu zbierku na základe literárnych žánrov a tematických okruhov.
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto mb-12 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary rounded-full blur-md opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
        <div className="relative flex items-center bg-background rounded-full border border-slate-200 dark:border-slate-800 shadow-xl pl-4 pr-2 py-2">
          <Search className="h-6 w-6 text-primary mr-3" />
          <Input 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Hľadať kategóriu..." 
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-lg shadow-none"
          />
        </div>
      </div>

      {paginatedCategories.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {paginatedCategories.map((category) => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/books?search=${encodeURIComponent(category.name)}`} className="block h-full border-transparent">
                  <Card className="h-full bg-card/60 backdrop-blur-md border-slate-200/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer rounded-3xl group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="flex flex-col items-center justify-center text-center py-10 relative z-10">
                      <div className="p-4 bg-primary/10 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors group-hover:scale-110 duration-300">
                        <Library className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{category.name}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 px-4 bg-muted/30 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700"
        >
          <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold">Nenašli sa žiadne kategórie</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">Skúste iný vyhľadávací výraz.</p>
        </motion.div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 pt-12 pb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-full shadow-sm hover:border-primary/50 h-12 w-12"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex bg-secondary/50 rounded-full p-1 border shadow-inner">
            <span className="text-sm font-semibold bg-background px-6 py-2.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-800">
              {currentPage} / {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full shadow-sm hover:border-primary/50 h-12 w-12"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
