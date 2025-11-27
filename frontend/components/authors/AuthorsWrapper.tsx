"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, User, BookOpen, Calendar, Filter, ArrowRight, MapPin, Award } from "lucide-react";

interface Author {
  id: number;
  name: string;
  birthYear: number;
  deathYear?: number;
  nationality: string;
  bookCount: number;
  popularBooks: string[];
  description: string;
  active: boolean;
  portrait: string;
  awards?: string[];
  birthPlace?: string;
}

const AuthorsWrapper: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "active">("all");
  const authorsPerPage = 6;

  // Mock data with portraits
  const authors: Author[] = [
    {
      id: 1,
      name: "F. Scott Fitzgerald",
      birthYear: 1896,
      deathYear: 1940,
      nationality: "Americký",
      bookCount: 8,
      popularBooks: ["Veľký Gatsby", "Tender Is the Night", "This Side of Paradise"],
      description: "Americký spisovateľ známy svojimi románmi o Jazz Age. Jeho diela reflektujú americký sen a jeho temnú stránku.",
      active: false,
      portrait: "👨‍💼",
      birthPlace: "Saint Paul, Minnesota, USA"
    },
    {
      id: 2,
      name: "Ernest Hemingway",
      birthYear: 1899,
      deathYear: 1961,
      nationality: "Americký",
      bookCount: 12,
      popularBooks: ["Starec a more", "Zbohom zbraniam", "Komu zvonia do hrobu"],
      description: "Nositel Nobelovej ceny za literatúru, známy minimalistickým štýlom. Bojoval v oboch svetových vojnách.",
      active: false,
      portrait: "🧔‍♂️",
      awards: ["Nobelova cena za literatúru (1954)", "Pulitzerova cena (1953)"],
      birthPlace: "Oak Park, Illinois, USA"
    },
    {
      id: 3,
      name: "George Orwell",
      birthYear: 1903,
      deathYear: 1950,
      nationality: "Britský",
      bookCount: 9,
      popularBooks: ["1984", "Farma zvierat", "Hold Katalánsku"],
      description: "Britský spisovateľ a žurnalista, známy svojimi politickými dielami. Bojoval proti totalitarizmu.",
      active: false,
      portrait: "👓",
      birthPlace: "Motihari, India"
    },
    {
      id: 4,
      name: "Jane Austen",
      birthYear: 1775,
      deathYear: 1817,
      nationality: "Britský",
      bookCount: 6,
      popularBooks: ["Pýcha a predsudok", "Rozum a cit", "Emma"],
      description: "Anglická spisovateľka známa svojimi románmi o anglickej spoločnosti. Považovaná za priekopníčku moderného románu.",
      active: false,
      portrait: "👩‍💼",
      birthPlace: "Steventon, Hampshire, Anglicko"
    },
    {
      id: 5,
      name: "Fjodor Dostojevskij",
      birthYear: 1821,
      deathYear: 1881,
      nationality: "Ruský",
      bookCount: 11,
      popularBooks: ["Zločin a trest", "Bratia Karamazovovci", "Idiot"],
      description: "Ruský spisovateľ a filozof, majster psychologického románu. Preskúmal ľudskú dušu a existenciálne témy.",
      active: false,
      portrait: "🧔",
      birthPlace: "Moskva, Rusko"
    },
    {
      id: 6,
      name: "J.K. Rowling",
      birthYear: 1965,
      nationality: "Britský",
      bookCount: 15,
      popularBooks: ["Harry Potter a Kameň mudrcov", "Harry Potter a Vězeň z Azkabanu", "The Casual Vacancy"],
      description: "Britská spisovateľka, známa predovšetkým sériou Harry Potter. Jedna z najúspešnejších spisovateľov všetkých čias.",
      active: true,
      portrait: "👩‍🏫",
      awards: ["Rad britského impéria", "Cena Hans Christian Andersen"],
      birthPlace: "Yate, Gloucestershire, Anglicko"
    },
    {
      id: 7,
      name: "Agatha Christie",
      birthYear: 1890,
      deathYear: 1976,
      nationality: "Britský",
      bookCount: 85,
      popularBooks: ["Vražda v Orient exprese", "Desať malých černochov", "Vražda Rogera Ackroyda"],
      description: "Kráľovná detektívky, jedna z najobľúbenejších spisovateľov všetkých čias. Autorka postáv Hercula Poirota a Miss Marple.",
      active: false,
      portrait: "👵",
      awards: ["Cena Edgar Allan Poe", "Rad britského impéria"],
      birthPlace: "Torquay, Devon, Anglicko"
    },
    {
      id: 8,
      name: "Stephen King",
      birthYear: 1947,
      nationality: "Americký",
      bookCount: 64,
      popularBooks: ["To", "Carrie", "The Shining", "Temná veža"],
      description: "Americký spisovateľ hororu, fantasy a sci-fi. Považovaný za kráľa hororu a jedného z najplodnejších autorov.",
      active: true,
      portrait: "👴",
      awards: ["Národná knižná cena", "Cena Bram Stoker", "Cena World Fantasy"],
      birthPlace: "Portland, Maine, USA"
    }
  ];

  // Filter authors based on search and filters
  const filteredAuthors = authors.filter(author => {
    const matchesSearch = 
      author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.popularBooks.some(book => book.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = 
      selectedFilter === "all" || 
      (selectedFilter === "active" && author.active);

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastAuthor = currentPage * authorsPerPage;
  const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
  const currentAuthors = filteredAuthors.slice(indexOfFirstAuthor, indexOfLastAuthor);
  const totalPages = Math.ceil(filteredAuthors.length / authorsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getAuthorLifespan = (author: Author) => {
    return author.deathYear 
      ? `${author.birthYear} - ${author.deathYear}`
      : `${author.birthYear} - súčasnosť`;
  };

  const getAuthorAge = (author: Author) => {
    if (author.deathYear) {
      return author.deathYear - author.birthYear;
    } else {
      return new Date().getFullYear() - author.birthYear;
    }
  };

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
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Autori
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Preskúmajte našu zbierku autorov. Nájdite svojich obľúbených spisovateľov a ich diela.
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
                placeholder="Hľadať autorov, národnosti, knihy..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={selectedFilter === "all" ? "default" : "outline"}
                onClick={() => {
                  setSelectedFilter("all");
                  setCurrentPage(1);
                }}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Všetci
              </Button>
              <Button 
                variant={selectedFilter === "active" ? "default" : "outline"}
                onClick={() => {
                  setSelectedFilter("active");
                  setCurrentPage(1);
                }}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Súčasní
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Authors Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="mb-12"
        >
          <AnimatePresence>
            {currentAuthors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentAuthors.map((author) => (
                  <motion.div
                    key={author.id}
                    variants={itemVariants}
                    layout
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-4xl">{author.portrait}</div>
                            <div>
                              <CardTitle className="text-xl">{author.name}</CardTitle>
                              <CardDescription className="flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" />
                                {getAuthorLifespan(author)}
                                <span className="text-xs bg-muted px-2 py-1 rounded">
                                  {getAuthorAge(author)} rokov
                                </span>
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={author.active ? "default" : "secondary"}>
                            {author.active ? "Súčasný" : "Historický"}
                          </Badge>
                        </div>
                        
                        {author.birthPlace && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {author.birthPlace}
                          </div>
                        )}
                      </CardHeader>
                      
                      <CardContent className="pb-3">
                        <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {author.nationality}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {author.bookCount} diel
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {author.description}
                        </p>

                        {author.awards && author.awards.length > 0 && (
                          <div className="space-y-2 mb-3">
                            <p className="text-sm font-medium flex items-center gap-2">
                              <Award className="h-3 w-3" />
                              Ocenenia:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {author.awards.slice(0, 2).map((award, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {award}
                                </Badge>
                              ))}
                              {author.awards.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{author.awards.length - 2} ďalších
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Populárne diela:</p>
                          <div className="flex flex-wrap gap-1">
                            {author.popularBooks.slice(0, 3).map((book, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {book}
                              </Badge>
                            ))}
                            {author.popularBooks.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{author.popularBooks.length - 3} ďalších
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter>
                        <Button className="w-full flex items-center gap-2 group-hover:bg-primary/90">
                          Prezrieť autora
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
                <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenašli sa žiadni autori</h3>
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

        {/* Enhanced Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{authors.length}</div>
              <div className="text-sm text-muted-foreground">Autorov</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {authors.reduce((sum, author) => sum + author.bookCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Celkom kníh</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {authors.filter(a => a.active).length}
              </div>
              <div className="text-sm text-muted-foreground">Súčasných</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(authors.map(a => a.nationality)).size}
              </div>
              <div className="text-sm text-muted-foreground">Národností</div>
            </div>
          </div>
          
          {/* Additional Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-xl mx-auto mt-6">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-orange-600">
                {Math.round(authors.reduce((sum, author) => sum + author.bookCount, 0) / authors.length)}
              </div>
              <div className="text-xs text-muted-foreground">Priemer kníh na autora</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-cyan-600">
                {authors.filter(a => a.awards && a.awards.length > 0).length}
              </div>
              <div className="text-xs text-muted-foreground">Ocenených autorov</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-pink-600">
                {Math.round(authors.reduce((sum, author) => sum + getAuthorAge(author), 0) / authors.length)}
              </div>
              <div className="text-xs text-muted-foreground">Priemerný vek</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AuthorsWrapper;