import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, User, Clock, Eye } from "lucide-react";
import Link from "next/link";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  publishedYear: number;
  available: boolean;
  dueDate?: string;
  coverImage?: string;
  description?: string;
}

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {

  return (
    <Card className="hover-lift shadow-card group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-smooth line-clamp-2">
              {book.title}
            </CardTitle>
            <div className="flex items-center space-x-1 mt-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm">{book.author}</span>
            </div>
          </div>
          <Badge 
            variant={book.available ? "default" : "secondary"}
            className={book.available ? "bg-success text-success-foreground" : ""}
          >
            {book.available ? "Available" : "Borrowed"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>{book.category}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Published: {book.publishedYear}</span>
          </div>
          {!book.available && book.dueDate && (
            <div className="flex items-center space-x-2 text-destructive">
              <Clock className="h-4 w-4" />
              <span>Due: {new Date(book.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        {book.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {book.description}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Link href={`/books/${book.id}`} className="w-full">
          <Button variant="default" className="w-full flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};