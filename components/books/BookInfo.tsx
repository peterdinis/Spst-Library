"use client"

import { useParams } from "next/navigation";
import { FC, useState } from "react";

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
    const {id} = useParams()
    const [isFavorite, setIsFavorite] = useState(false);

      const book = books.find(b => b.id === bookId);

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Book not found</h2>
            <p className="text-muted-foreground mb-4">The book you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/books')}>Back to Books</Button>
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
            className={`h-5 w-5 ${
              i < Math.floor(rating)
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Book link copied to clipboard.",
    });
  };
  
    return (
        <>NOTHING</>
    )
}

export default BookInfo;