"use client";

import { FC, JSX, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, BookOpen, Library, Users, Clock, ArrowRight, Filter } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description: string;
  bookCount: number;
  availableBooks: number;
  icon: JSX.Element;
  color: string;
  popular: boolean;
}

const CategoriesWrapper: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "popular">("all");
  const categoriesPerPage = 6;

  // Mock data
  const categories: Category[] = [
    {
      id: 1,
      name: "Romány",
      description: "Klasické a moderné romány z celého sveta",
      bookCount: 156,
      availableBooks: 128,
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-blue-500/20 text-blue-600 border-blue-200",
      popular: true
    },
    {
      id: 2,
      name: "Detektívky",
      description: "Napínavé príbehy plné záhad a vyšetrovania",
      bookCount: 89,
      availableBooks: 67,
      icon: <Library className="w-6 h-6" />,
      color: "bg-green-500/20 text-green-600 border-green-200",
      popular: true
    },
    {
      id: 3,
      name: "Fantasy",
      description: "Svety plné čarov, príšer a dobrodružstiev",
      bookCount: 134,
      availableBooks: 112,
      icon: <Users className="w-6 h-6" />,
      color: "bg-purple-500/20 text-purple-600 border-purple-200",
      popular: true
    },
    {
      id: 4,
      name: "Sci-fi",
      description: "Vízie budúcnosti a vesmírnych dobrodružstiev",
      bookCount: 78,
      availableBooks: 65,
      icon: <Clock className="w-6 h-6" />,
      color: "bg-orange-500/20 text-orange-600 border-orange-200",
      popular: false
    },
    {
      id: 5,
      name: "Historické",
      description: "Príbehy z minulosti a historické udalosti",
      bookCount: 92,
      availableBooks: 78,
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-amber-500/20 text-amber-600 border-amber-200",
      popular: false
    },
    {
      id: 6,
      name: "Biografie",
      description: "Životné príbehy významných osobností",
      bookCount: 67,
      availableBooks: 54,
      icon: <Users className="w-6 h-6" />,
      color: "bg-red-500/20 text-red-600 border-red-200",
      popular: false
    },
    {
      id: 7,
      name: "Poézia",
      description: "Básnické zbierky a verše",
      bookCount: 45,
      availableBooks: 38,
      icon: <Library className="w-6 h-6" />,
      color: "bg-pink-500/20 text-pink-600 border-pink-200",
      popular: false
    },
    {
      id: 8,
      name: "Cestopisy",
      description: "Príbehy z cest a objavovania sveta",
      bookCount: 53,
      availableBooks: 42,
      icon: <Clock className="w-6 h-6" />,
      color: "bg-cyan-500/20 text-cyan-600 border-cyan-200",
      popular: true
    },
    {
      id: 9,
      name: "Dráma",
      description: "Divadelné hry a dramatické texty",
      bookCount: 38,
      availableBooks: 31,
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-indigo-500/20 text-indigo-600 border-indigo-200",
      popular: false
    }
  ];

  // Filter categories based on search and filters
  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      selectedFilter === "all" || 
      (selectedFilter === "popular" && category.popular);

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
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
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const totalBooks = categories.reduce((sum, category) => sum + category.bookCount, 0);
  const totalAvailable = categories.reduce((sum, category) => sum + category.availableBooks, 0);

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Knižné Kategórie
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Preskúmajte našu knižnicu podľa žánrov. Nájdite svoju obľúbenú kategóriu.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-blue-500/10 border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{categories.length}</div>
              <div className="text-sm text-blue-600 font-medium">Kategórií</div>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{totalBooks}</div>
              <div className="text-sm text-green-600 font-medium">Celkom kníh</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{totalAvailable}</div>
              <div className="text-sm text-purple-600 font-medium">Dostupné knihy</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Hľadať kategórie..."
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
                Všetky
              </Button>
              <Button 
                variant={selectedFilter === "popular" ? "default" : "outline"}
                onClick={() => {
                  setSelectedFilter("popular");
                  setCurrentPage(1);
                }}
                className="flex items-center gap-2"
              >
                <Library className="h-4 w-4" />
                Populárne
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="mb-12"
        >
          <AnimatePresence>
            {currentCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCategories.map((category) => (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    layout
                    whileHover={{ 
                      y: -8, 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Card className={`h-full border-2 hover:shadow-xl transition-all duration-300 cursor-pointer ${category.color}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-lg ${category.color.split(' ')[0]}`}>
                            {category.icon}
                          </div>
                          {category.popular && (
                            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 border-yellow-300">
                              Populárne
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                          {category.description}
                        </p>

                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm">
                            <div className="font-semibold">{category.bookCount} kníh</div>
                            <div className="text-muted-foreground">
                              {category.availableBooks} dostupných
                            </div>
                          </div>
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ 
                                width: `${(category.availableBooks / category.bookCount) * 100}%` 
                              }}
                            />
                          </div>
                        </div>

                        <Button 
                          variant="outline" 
                          className="w-full flex items-center gap-2 group"
                        >
                          Prezrieť kategóriu
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
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
                <Library className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenašli sa žiadne kategórie</h3>
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

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Kategórií</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalBooks}</div>
              <div className="text-sm text-muted-foreground">Celkom kníh</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {categories.filter(c => c.popular).length}
              </div>
              <div className="text-sm text-muted-foreground">Populárnych</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((totalAvailable / totalBooks) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Dostupnosť</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesWrapper;