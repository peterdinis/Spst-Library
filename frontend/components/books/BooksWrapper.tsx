"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, BookOpen, User, Calendar, Filter, X } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
  available: boolean;
  description: string;
}

const BooksWrapper: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [availability, setAvailability] = useState<string>("all");
  const [yearRange, setYearRange] = useState<[number, number]>([1800, 2024]);
  const booksPerPage = 6;

  // Mock data
  const books: Book[] = [
    {
      id: 1,
      title: "Veľký Gatsby",
      author: "F. Scott Fitzgerald",
      year: 1925,
      genre: "Román",
      available: true,
      description: "Klasický americký román o sne, láske a spoločenskej triede."
    },
    {
      id: 2,
      title: "Starec a more",
      author: "Ernest Hemingway",
      year: 1952,
      genre: "Dobrodružný",
      available: true,
      description: "Príbeh o love starejka a jeho boji s obrovskou rybou."
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      year: 1949,
      genre: "Sci-fi",
      available: false,
      description: "Antiutopický román o totalitnej spoločnosti."
    },
    {
      id: 4,
      title: "Pýcha a predsudok",
      author: "Jane Austen",
      year: 1813,
      genre: "Romantika",
      available: true,
      description: "Romantický príbeh z anglickej spoločnosti 19. storočia."
    },
    {
      id: 5,
      title: "Zločin a trest",
      author: "Fjodor Dostojevskij",
      year: 1866,
      genre: "Psychologický",
      available: true,
      description: "Psychologická štúdia o morálke a výčitkách svedomia."
    },
    {
      id: 6,
      title: "Harry Potter a Kameň mudrcov",
      author: "J.K. Rowling",
      year: 1997,
      genre: "Fantasy",
      available: false,
      description: "Prvý diel série o mladom čarodejníkovi."
    },
    {
      id: 7,
      title: "Malý princ",
      author: "Antoine de Saint-Exupéry",
      year: 1943,
      genre: "Filozofická",
      available: true,
      description: "Filozofická rozprávka o priateľstve a živote."
    },
    {
      id: 8,
      title: "Vražda v Orient exprese",
      author: "Agatha Christie",
      year: 1934,
      genre: "Detektívka",
      available: true,
      description: "Slávna detektívka s Herculom Poirotom."
    }
  ];

  // Get all unique genres
  const genres = ["all", ...new Set(books.map(book => book.genre))];

  // Filter books based on search and filters
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
    
    const matchesAvailability = 
      availability === "all" || 
      (availability === "available" && book.available) ||
      (availability === "unavailable" && !book.available);

    const matchesYear = book.year >= yearRange[0] && book.year <= yearRange[1];

    return matchesSearch && matchesGenre && matchesAvailability && matchesYear;
  });

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSelectedGenre("all");
    setAvailability("all");
    setYearRange([1800, 2024]);
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedGenre !== "all" || availability !== "all" || yearRange[0] > 1800 || yearRange[1] < 2024;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Knižný Katalóg
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Preskúmajte našu rozsiahlu zbierku kníh. Vyhľadávajte podľa názvu, autora alebo žánru.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Hľadať knihy, autorov, žánre..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Vymazať filtre
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={handleFilterToggle}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtre {hasActiveFilters && "•"}
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-6 border rounded-lg bg-background"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Genre Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Žáner</label>
                    <select
                      value={selectedGenre}
                      onChange={(e) => {
                        setSelectedGenre(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      {genres.map(genre => (
                        <option key={genre} value={genre}>
                          {genre === "all" ? "Všetky žánre" : genre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Availability Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Dostupnosť</label>
                    <select
                      value={availability}
                      onChange={(e) => {
                        setAvailability(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="all">Všetky</option>
                      <option value="available">Dostupné</option>
                      <option value="unavailable">Vypožičané</option>
                    </select>
                  </div>

                  {/* Year Range Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Rok vydania: {yearRange[0]} - {yearRange[1]}
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Od"
                        value={yearRange[0]}
                        onChange={(e) => {
                          setYearRange([Number(e.target.value), yearRange[1]]);
                          setCurrentPage(1);
                        }}
                        min={1800}
                        max={2024}
                        className="w-full"
                      />
                      <Input
                        type="number"
                        placeholder="Do"
                        value={yearRange[1]}
                        onChange={(e) => {
                          setYearRange([yearRange[0], Number(e.target.value)]);
                          setCurrentPage(1);
                        }}
                        min={1800}
                        max={2024}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Active Filters Badges */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap gap-2"
          >
            {selectedGenre !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Žáner: {selectedGenre}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedGenre("all")}
                />
              </Badge>
            )}
            {availability !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {availability === "available" ? "Dostupné" : "Vypožičané"}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setAvailability("all")}
                />
              </Badge>
            )}
            {(yearRange[0] > 1800 || yearRange[1] < 2024) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Rok: {yearRange[0]} - {yearRange[1]}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setYearRange([1800, 2024])}
                />
              </Badge>
            )}
          </motion.div>
        )}

        {/* Books Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="mb-12"
        >
          <AnimatePresence>
            {currentBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    variants={itemVariants}
                    layout
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={book.available ? "default" : "secondary"}>
                            {book.available ? "Dostupné" : "Vypožičané"}
                          </Badge>
                          <Badge variant="outline">{book.genre}</Badge>
                        </div>
                        <CardTitle className="text-xl line-clamp-2">{book.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <User className="h-4 w-4" />
                          {book.author}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {book.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Rok vydania: {book.year}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          disabled={!book.available}
                        >
                          {book.available ? "Požičať si" : "Nedostupné"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenašli sa žiadne knihy</h3>
                <p className="text-muted-foreground">
                  Skúste zmeniť vyhľadávací výraz alebo filtrovanie.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(prev => Math.max(prev - 1, 1));
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{filteredBooks.length}</div>
              <div className="text-sm text-muted-foreground">Nájdené knihy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredBooks.filter(b => b.available).length}
              </div>
              <div className="text-sm text-muted-foreground">Dostupné</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {filteredBooks.filter(b => !b.available).length}
              </div>
              <div className="text-sm text-muted-foreground">Vypožičané</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(filteredBooks.map(b => b.genre)).size}
              </div>
              <div className="text-sm text-muted-foreground">Žánrov</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BooksWrapper;