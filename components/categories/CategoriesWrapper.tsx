"use client"

import { FC, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    Beaker,
    Calculator,
    Globe,
    Palette,
    Music,
    Dumbbell,
    Languages
} from "lucide-react";
import Pagination from "../shared/Pagination";
import Link from "next/link";
import SearchBar from "../shared/SearchBar";
import { motion } from "framer-motion"; // ✅ přidáno

const categories = [
    {
        id: "fiction",
        name: "Fiction",
        description: "Novels, short stories, and imaginative literature",
        icon: BookOpen,
        color: "bg-blue-500",
        count: 342
    },
    {
        id: "science",
        name: "Science",
        description: "Physics, chemistry, biology, and earth sciences",
        icon: Beaker,
        color: "bg-green-500",
        count: 156
    },
    {
        id: "mathematics",
        name: "Mathematics",
        description: "Algebra, geometry, calculus, and statistics",
        icon: Calculator,
        color: "bg-purple-500",
        count: 89
    },
    {
        id: "history",
        name: "History",
        description: "World history, local history, and historical biographies",
        icon: Globe,
        color: "bg-orange-500",
        count: 234
    },
    {
        id: "arts",
        name: "Arts & Crafts",
        description: "Drawing, painting, sculpture, and creative projects",
        icon: Palette,
        color: "bg-pink-500",
        count: 127
    },
    {
        id: "music",
        name: "Music",
        description: "Music theory, instruments, and musical biographies",
        icon: Music,
        color: "bg-indigo-500",
        count: 78
    },
    {
        id: "sports",
        name: "Sports & Health",
        description: "Physical education, sports rules, and health guides",
        icon: Dumbbell,
        color: "bg-red-500",
        count: 94
    },
    {
        id: "languages",
        name: "Languages",
        description: "Language learning, grammar, and linguistics",
        icon: Languages,
        color: "bg-teal-500",
        count: 163
    }
];

const CategoriesWrapper: FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const filteredCategories = useMemo(() => {
        return categories.filter(category =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text">
                        Book Categories
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                        Explore our diverse collection of books organized by subject areas
                    </p>

                    <div className="max-w-md mx-auto">
                        <SearchBar
                            onSearch={handleSearch}
                            placeholder="Search categories..."
                            className="mb-6"
                        />
                    </div>
                </div>

                {currentCategories.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No categories found</h3>
                        <p className="text-muted-foreground">Try adjusting your search terms</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {currentCategories.map((category, index) => {
                                const IconComponent = category.icon;
                                return (
                                    <motion.div
                                        key={category.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1, type: "spring", stiffness: 120 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="shadow-2xl"
                                    >
                                        <Link
                                            href={`/categories/${category.id}`}
                                            className="block transition-smooth"
                                        >
                                            <Card className="h-full shadow-card hover:shadow-glow transition-smooth border-0">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="p-2 rounded-lg bg-primary/10">
                                                            <IconComponent className="h-6 w-6 text-primary" />
                                                        </div>
                                                        <Badge variant="secondary" className="bg-secondary/60">
                                                            {category.count} books
                                                        </Badge>
                                                    </div>
                                                    <CardTitle className="text-lg">{category.name}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {category.description}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </main>
        </div>
    )
}

export default CategoriesWrapper;
