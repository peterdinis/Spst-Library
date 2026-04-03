"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { trpc } from "@/trpc/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Search, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
      <div className="relative overflow-hidden flex flex-col text-center items-center justify-center gap-4 bg-slate-900 text-white dark:bg-slate-800 py-16 rounded-3xl shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-60" />
        <div className="relative z-10 p-4 bg-white/10 rounded-full mb-2 backdrop-blur-md">
          <User className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="relative z-10 text-5xl font-extrabold tracking-tight">Katalóg Autorov</h1>
        <p className="relative z-10 text-xl text-slate-200 max-w-2xl">
          Objavte výnimočných spisovateľov a preštudujte si ich fascinujúce životopisy obsiahnuté v našej knižnici.
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto mb-12 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary rounded-full blur-md opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
        <div className="relative flex items-center bg-background dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-700 shadow-xl pl-4 pr-2 py-2">
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
                <Card className="group flex h-full flex-col overflow-hidden rounded-3xl border-slate-200/50 bg-card/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800/80 dark:bg-slate-900/80">
                  <div className="relative h-24 bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-primary/20 dark:to-slate-800">
                    <div className="absolute -bottom-8 left-6">
                      <div className="flex h-16 w-16 rotate-3 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-background shadow-lg transition-transform group-hover:rotate-0 dark:border-slate-700 dark:bg-slate-900">
                        {author.imageUrl ? (
                          <Image
                            src={author.imageUrl}
                            alt={`${author.name} — náhľad`}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-8 w-8 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pt-12">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">{author.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pb-2">
                    <p className="line-clamp-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {author.bio || "Životopis momentálne nie je k dispozícii v našej databáze."}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2 pb-8">
                    <Link
                      href={`/authors/${author.id}`}
                      className={cn(
                        buttonVariants({ variant: "secondary", size: "lg" }),
                        "w-full rounded-xl py-2.5 text-base font-semibold"
                      )}
                    >
                      Profil a knihy
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 px-4 bg-muted/30 dark:bg-slate-900/60 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700"
        >
          <Search className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold">Nenašli sa žiadni autori</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">Skúste zadať iné meno spisovateľa.</p>
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
          <div className="flex bg-secondary/50 dark:bg-slate-800/70 rounded-full p-1 border border-slate-200 dark:border-slate-700 shadow-inner">
            <span className="text-sm font-semibold bg-background dark:bg-slate-900 px-6 py-2.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
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
