"use client";

import { useState, useMemo } from "react";
import { trpc } from "@/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 6;

export default function AuthorsPage() {
  const { data: authors, isLoading } = trpc.authors.getAll.useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAuthors = useMemo(() => {
    if (!authors) return [];
    return authors.filter((a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.bio || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, authors]);

  const totalPages = Math.max(1, Math.ceil(filteredAuthors.length / ITEMS_PER_PAGE));
  const paginatedAuthors = filteredAuthors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);

  return (
    <div className="space-y-12 pb-16">
      <div className="flex flex-col text-center items-center justify-center gap-4 bg-gradient-to-b from-primary/10 to-transparent py-16 rounded-3xl">
        <div className="p-4 bg-primary/20 rounded-full mb-2">
          <User className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight">Katalóg Autorov</h1>
        <p className="text-xl text-slate-500 max-w-2xl">
          Objavte výnimočných spisovateľov a preštudujte si ich fascinujúce životopisy obsiahnuté v našej knižnici.
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
            placeholder="Hľadať autora podľa mena..." 
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-lg shadow-none"
          />
        </div>
      </div>

      {paginatedAuthors.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {paginatedAuthors.map((author) => (
              <motion.div
                key={author.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full bg-card/60 backdrop-blur-md border-slate-200/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-3xl overflow-hidden group">
                  <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                    <div className="absolute -bottom-8 left-6">
                      <div className="h-16 w-16 rounded-2xl bg-background shadow-lg flex items-center justify-center border border-slate-100 dark:border-slate-800 rotate-3 group-hover:rotate-0 transition-transform">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pt-12">
                    <CardTitle className="text-2xl font-bold">{author.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm line-clamp-4">
                      {author.bio || "Životopis momentálne nie je k dispozícii v našej databáze."}
                    </p>
                  </CardContent>
                </Card>
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
          <h3 className="text-2xl font-bold">Nenašli sa žiadni autori</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">Skúste zadať iné meno spisovateľa.</p>
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
