"use client"

import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import Navigation from "../shared/Navigation";
import { ArrowLeft, Award, Book, BookOpen, Calendar, Clock, Heart, Star, User } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import {motion} from "framer-motion"
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import Link from "next/link";

const books = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    isbn: "978-0-7432-7356-5",
    publishedYear: 1925,
    rating: 4.2,
    status: "Available",
    copies: 5,
    description: "A classic American novel about the Jazz Age and the American Dream. Set in the summer of 1922, the story follows Nick Carraway as he becomes neighbor to the mysterious Jay Gatsby, who throws lavish parties in hopes of winning back his lost love, Daisy Buchanan.",
    pages: 180,
    language: "English",
    publisher: "Scribner",
    tags: ["Classic", "American Literature", "Romance", "Drama"]
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    isbn: "978-0-06-112008-4",
    publishedYear: 1960,
    rating: 4.5,
    status: "Available",
    copies: 3,
    description: "A gripping tale of racial injustice and childhood innocence in the American South during the 1930s.",
    pages: 376,
    language: "English",
    publisher: "J. B. Lippincott & Co.",
    tags: ["Classic", "Social Issues", "Coming of Age"]
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    isbn: "978-0-452-28423-4",
    publishedYear: 1949,
    rating: 4.6,
    status: "Checked Out",
    copies: 0,
    description: "A dystopian social science fiction novel and cautionary tale about totalitarian surveillance.",
    pages: 328,
    language: "English",
    publisher: "Secker & Warburg",
    tags: ["Dystopian", "Political Fiction", "Science Fiction"]
  }
];

const BookInfo: FC = () => {
  const { id } = useParams()
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter()

  const book = books.find(b => b.id === id);

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Book not found</h2>
            <p className="text-muted-foreground mb-4">The book you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/books')}>Back to Books</Button>
          </div>
        </main>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    return status === "Available" ? "bg-green-500/20 text-green-700 dark:text-green-300" : "bg-red-500/20 text-red-700 dark:text-red-300";
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < Math.floor(rating)
                ? "text-yellow-500 fill-current"
                : "text-muted-foreground"
              }`}
          />
        ))}
        <span className="text-lg font-medium ml-2">{rating}</span>
      </div>
    );
  };

  const handleReserve = () => {
    toast({
      title: "Book Reserved",
      description: `${book.title} has been reserved for you.`,
    });
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${book.title} ${isFavorite ? "removed from" : "added to"} your favorites.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="outline" 
            className="mb-6"
            onClick={() => router.push('/books')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Book Cover & Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="shadow-card hover:shadow-glow transition-smooth">
                <CardContent className="p-6">
                  <div className="aspect-[3/4] bg-gradient-subtle rounded-lg mb-6 flex items-center justify-center">
                    <Book className="h-24 w-24 text-primary/30" />
                  </div>
                  
                  <div className="space-y-4">
                    <Badge className={getStatusColor(book.status)}>
                      {book.status}
                    </Badge>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {book.copies > 0 ? `${book.copies} copies available` : 'Out of stock'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        disabled={book.status !== "Available"}
                        onClick={handleReserve}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        {book.status === "Available" ? "Reserve Book" : "Not Available"}
                      </Button>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={handleFavorite}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                          {isFavorite ? 'Favorited' : 'Favorite'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Book Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2 space-y-6"
            >
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">
                  {book.title}
                </h1>
                <div className="flex items-center space-x-4 text-lg text-muted-foreground mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <Link 
                      href={`/authors/${book.author.replace(' ', '-').toLowerCase()}`}
                      className="hover:text-primary transition-colors"
                    >
                      {book.author}
                    </Link>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{book.publishedYear}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  {renderStars(book.rating)}
                </div>
              </div>

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About this book</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {book.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Pages</h3>
                      <p className="font-semibold">{book.pages}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Language</h3>
                      <p className="font-semibold">{book.language}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Publisher</h3>
                      <p className="font-semibold">{book.publisher}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">ISBN</h3>
                      <p className="font-semibold text-sm">{book.isbn}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Category</h3>
                      <Badge variant="outline">{book.category}</Badge>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Rating</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{book.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {book.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Books Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-primary" />
                      More from this author
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {books
                        .filter(b => b.author === book.author && b.id !== book.id)
                        .slice(0, 2)
                        .map((relatedBook) => (
                          <Link
                            key={relatedBook.id}
                            href={`/books/${relatedBook.id}`}
                            className="block p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
                          >
                            <h3 className="font-medium mb-1">{relatedBook.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {relatedBook.publishedYear} • {relatedBook.category}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs">{relatedBook.rating}</span>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={getStatusColor(relatedBook.status)}
                              >
                                {relatedBook.status}
                              </Badge>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default BookInfo;