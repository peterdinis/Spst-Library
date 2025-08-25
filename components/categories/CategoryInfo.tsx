"use client"

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Star, Calendar } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

const categoryDetails = {
    fiction: {
        name: "Fiction",
        description: "Dive into worlds of imagination with our extensive fiction collection. From classic novels to contemporary bestsellers, discover stories that captivate and inspire.",
        books: [
            {
                id: 1,
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                year: 1960,
                rating: 4.8,
                description: "A gripping tale of racial injustice and childhood innocence in the American South."
            },
            {
                id: 2,
                title: "1984",
                author: "George Orwell",
                year: 1949,
                rating: 4.7,
                description: "A dystopian masterpiece about totalitarianism and the power of truth."
            },
            {
                id: 3,
                title: "Pride and Prejudice",
                author: "Jane Austen",
                year: 1813,
                rating: 4.6,
                description: "A witty exploration of love, marriage, and social expectations."
            },
            {
                id: 4,
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                year: 1925,
                rating: 4.5,
                description: "A Jazz Age tale of wealth, love, and the American Dream."
            }
        ]
    },
    science: {
        name: "Science",
        description: "Explore the wonders of the natural world through our comprehensive science collection. From basic principles to cutting-edge research.",
        books: [
            {
                id: 5,
                title: "A Brief History of Time",
                author: "Stephen Hawking",
                year: 1988,
                rating: 4.9,
                description: "An accessible exploration of cosmology and the nature of time."
            },
            {
                id: 6,
                title: "The Origin of Species",
                author: "Charles Darwin",
                year: 1859,
                rating: 4.7,
                description: "The groundbreaking work that introduced the theory of evolution."
            }
        ]
    }
};

const CateoryInfo: FC = () => {

    const { categoryId } = useParams<{ categoryId: string }>();
    const category = categoryDetails[categoryId as keyof typeof categoryDetails];

    if (!category) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
                    <Link href="/categories">
                        <Button>Back to Categories</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">

            <main className="container mx-auto px-4 py-8">
                <div className="mb-6 animate-fade-in">
                    <Link
                        href="/categories"
                        className="inline-flex items-center text-primary hover:text-primary-glow mb-4 transition-smooth"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Categories
                    </Link>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
                            {category.name}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            {category.description}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.books.map((book, index) => (
                        <Card
                            key={book.id}
                            className="shadow-card hover:shadow-glow transition-smooth border-0 bg-gradient-card hover-float animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between mb-2">
                                    <BookOpen className="h-6 w-6 text-primary flex-shrink-0" />
                                    <div className="flex items-center space-x-1">
                                        <Star className="h-4 w-4 text-secondary fill-current" />
                                        <span className="text-sm font-medium">{book.rating}</span>
                                    </div>
                                </div>
                                <CardTitle className="text-lg leading-tight">{book.title}</CardTitle>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <span>by {book.author}</span>
                                    <Badge variant="outline" className="flex items-center space-x-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>{book.year}</span>
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {book.description}
                                </p>
                                <Button
                                    className="w-full mt-4 bg-gradient-accent hover:shadow-soft transition-smooth"
                                    size="sm"
                                >
                                    View Details
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default CateoryInfo;