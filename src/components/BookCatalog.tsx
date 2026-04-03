"use client";

import { trpc } from "@/trpc/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, BookOpen, ExternalLink, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 8;

export function BookCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [tempAuthor, setTempAuthor] = useState<string>("all");
  const [tempCategory, setTempCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading } = trpc.books.getAll.useQuery({
    search: debouncedSearch || undefined,
    authorId: selectedAuthor === "all" ? undefined : selectedAuthor,
    categoryId: selectedCategory === "all" ? undefined : selectedCategory,
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  const { data: authors } = trpc.authors.getAll.useQuery();
  const { data: categories } = trpc.categories.getAll.useQuery();

  const books = data?.items || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (isLoading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
      {[...Array(4)].map((_, i) => <div key={i} className="h-[400px] bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-3xl" />)}
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Filtre a Vyhľadávanie */}
      <div className="space-y-8">
        <div className="relative max-w-4xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-100 transition duration-1000" />
            <div className="relative flex items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 shadow-2xl pl-8 pr-3 py-3">
              <Search className="h-6 w-6 text-indigo-500 mr-4" />
              <Input 
                  value={searchQuery}
                  onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                  }}
                  placeholder="Hľadať v tisíckach príbehov..." 
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-xl shadow-none flex-1 font-medium placeholder:text-slate-400"
              />
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/30">
                  <span className="text-xs font-black uppercase tracking-widest">Katalóg</span>
              </div>
            </div>
        </div>

        <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-4 p-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
                <Select value={tempAuthor} onValueChange={(val: string | null) => setTempAuthor(val || "all")}>
                    <SelectTrigger className="w-[220px] h-12 rounded-2xl border-none bg-white dark:bg-slate-950 shadow-sm font-bold text-slate-600">
                        <SelectValue placeholder="Všetci autori" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl shadow-2xl border-slate-200/50">
                        <SelectItem>Všetci autori</SelectItem>
                        {authors?.map(a => <SelectItem key={a.id} value={a.id} className="rounded-xl">{a.name}</SelectItem>)}
                    </SelectContent>
                </Select>

                <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block" />

                <Select value={tempCategory} onValueChange={(val: string | null) => setTempCategory(val || "all")}>
                    <SelectTrigger className="w-[220px] h-12 rounded-2xl border-none bg-white dark:bg-slate-950 shadow-sm font-bold text-slate-600">
                        <SelectValue placeholder="Všetky kategórie" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl shadow-2xl border-slate-200/50">
                        <SelectItem>Všetky kategórie</SelectItem>
                        {categories?.map(c => <SelectItem key={c.id} value={c.name} className="rounded-xl">{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>

                <Button 
                    onClick={() => {
                        setSelectedAuthor(tempAuthor);
                        setSelectedCategory(tempCategory);
                        setCurrentPage(1);
                    }}
                    disabled={tempAuthor === selectedAuthor && tempCategory === selectedCategory}
                    className="rounded-2xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg hover:shadow-indigo-500/25 border-none"
                >
                    Použiť filtre
                </Button>
            </div>

            {/* Active Filters Pills */}
            <AnimatePresence>
                {(selectedAuthor !== "all" || selectedCategory !== "all" || searchQuery) && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-wrap items-center justify-center gap-2"
                    >
                        {searchQuery && (
                            <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 rounded-full bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition-colors">
                                <span className="text-[10px] font-bold uppercase tracking-tight opacity-50">Hľadať:</span>
                                {searchQuery}
                                <button onClick={() => setSearchQuery("")} className="hover:bg-indigo-200 rounded-full p-0.5 ml-1">
                                    <ChevronRight className="h-3 w-3 rotate-45 transform" /> 
                                </button>
                            </Badge>
                        )}
                        {selectedAuthor !== "all" && (
                            <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 rounded-full bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100 transition-colors">
                                <span className="text-[10px] font-bold uppercase tracking-tight opacity-50">Autor:</span>
                                {authors?.find(a => a.id === selectedAuthor)?.name}
                                <button onClick={() => { setSelectedAuthor("all"); setTempAuthor("all"); }} className="hover:bg-emerald-200 rounded-full p-0.5 ml-1">
                                    <ChevronRight className="h-3 w-3 rotate-45 transform" />
                                </button>
                            </Badge>
                        )}
                        {selectedCategory !== "all" && (
                            <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 rounded-full bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-100 transition-colors">
                                <span className="text-[10px] font-bold uppercase tracking-tight opacity-50">Kategória:</span>
                                {categories?.find(c => c.id === selectedCategory)?.name}
                                <button onClick={() => { setSelectedCategory("all"); setTempCategory("all"); }} className="hover:bg-purple-200 rounded-full p-0.5 ml-1">
                                    <ChevronRight className="h-3 w-3 rotate-45 transform" />
                                </button>
                            </Badge>
                        )}
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedAuthor("all");
                                setSelectedCategory("all");
                                setTempAuthor("all");
                                setTempCategory("all");
                                setCurrentPage(1);
                            }}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500"
                        >
                            Vymazať všetko
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* Zoznam Kníh */}
      {books.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {books.map((book) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Link href={`/books/${book.id}`} className="block h-full group">
                  <Card className="flex flex-col h-full bg-white dark:bg-slate-950 border-slate-200/50 dark:border-slate-800/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-500/50 relative rounded-[2rem]">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                    
                    <CardHeader className="p-0 z-10 w-full relative">
                      {book.coverUrl ? (
                        <div className="relative w-full aspect-[3/4] overflow-hidden">
                          <motion.img 
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6 }}
                            src={book.coverUrl!} 
                            alt={book.title} 
                            className="w-full h-full object-cover group-hover:brightness-110 transition-all" 
                          />
                        </div>
                      ) : (
                        <div className="relative w-full aspect-[3/4] bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                          <BookOpen className="h-16 w-16 text-slate-200" />
                        </div>
                      )}
                      
                      <div className="absolute top-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl z-20">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{(book as any).category?.name || "Kniha"}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 p-8 z-10">
                      <div className="space-y-2 mb-4">
                        <CardTitle className="leading-tight text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {book.title}
                        </CardTitle>
                        <CardDescription className="text-sm font-bold text-slate-400 uppercase tracking-tight">
                          {(book as any).author?.name || "Neznámy autor"}
                        </CardDescription>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">
                        {book.description}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="p-8 pt-0 flex flex-col items-stretch gap-6 z-10">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Dostupnosť</span>
                        <span className={`font-black px-3 py-1 rounded-xl text-[10px] uppercase tracking-wider ${book.availableCopies > 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}>
                          {book.availableCopies > 0 ? `${book.availableCopies} na sklade` : "Nedostupná"}
                        </span>
                      </div>
                      <Button 
                        size="lg"
                        className="w-full rounded-2xl font-bold h-12 bg-slate-900 hover:bg-indigo-600 text-white transition-all shadow-xl hover:shadow-indigo-500/25 border-none"
                      >
                        Detail knihy
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
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
          className="text-center py-32 px-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800"
        >
          <div className="bg-white dark:bg-slate-950 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border border-slate-100 dark:border-slate-800">
            <Search className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white">Žiadne výsledky</h3>
          <p className="text-slate-500 mt-4 max-w-md mx-auto font-medium">Nenašli sme žiadne knihy zodpovedajúce vašim filtrom. Skúste ich upraviť alebo zrušiť.</p>
          <Button 
            variant="outline" 
            onClick={() => {
                setSearchQuery("");
                setSelectedAuthor("all");
                setSelectedCategory("all");
                setCurrentPage(1);
            }}
            className="mt-8 rounded-2xl px-8 h-12 border-slate-200 hover:bg-slate-50"
          >
              Zrušiť všetky filtre
          </Button>
        </motion.div>
      )}

      {/* Paginácia */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-8 pt-12">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-2xl h-14 px-6 hover:bg-slate-100 font-bold gap-2 text-slate-600 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
            Predošlá
          </Button>
          
          <div className="flex items-center gap-3">
            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-10 w-10 rounded-xl font-bold transition-all ${currentPage === i + 1 ? "bg-slate-900 text-white shadow-xl scale-110" : "hover:bg-slate-100 text-slate-500"}`}
                >
                    {i + 1}
                </button>
            ))}
          </div>

          <Button
            variant="ghost"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-2xl h-14 px-6 hover:bg-slate-100 font-bold gap-2 text-slate-600 disabled:opacity-30"
          >
            Nasledovná
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
