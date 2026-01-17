"use client";

import { BookOpen, User, Calendar, Eye } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Doc } from "convex/_generated/dataModel";


// Rozšírený typ pre knihu s autorom a kategóriou
interface BookWithRelations extends Doc<"books"> {
  author: Doc<"authors">;
  category: Doc<"categories">;
  // Môžeme pridať computed fields
  isAvailable: boolean;
}

interface BookCardProps {
  book: BookWithRelations;
}

export const BookCard = ({ book }: BookCardProps) => {
  // Vypočítať či je kniha dostupná
  const isAvailable = book.availableCopies > 0 && book.status === "available";
  
  return (
    <Card className="hover-lift shadow-card group h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-smooth line-clamp-2">
              {book.title}
            </CardTitle>
            <div className="flex items-center space-x-1 mt-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm">{book.author.name}</span>
            </div>
          </div>
          <Badge
            variant={isAvailable ? "default" : "secondary"}
            className={
              isAvailable
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-amber-100 text-amber-800 border-amber-200"
            }
          >
            {isAvailable ? "Dostupná" : "Požičaná"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        <div className="space-y-2 text-sm text-muted-foreground">
          {book.category && (
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>{book.category.name}</span>
            </div>
          )}
          {book.publishedYear && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Publikované: {book.publishedYear}</span>
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
        <Link to={`/books/${book._id}`} className="w-full">
          <Button
            variant="default"
            className="w-full flex items-center cursor-pointer space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Detail knihy</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};