import { BookOpen, User, Calendar, Eye, Users } from "lucide-react";
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
import { motion } from "framer-motion";

interface BookWithRelations extends Doc<"books"> {
  author: Doc<"authors">;
  category: Doc<"categories">;
}

interface BookCardProps {
  book: BookWithRelations;
}

export const BookCard = ({ book }: BookCardProps) => {
  const isAvailable = book.availableCopies > 0 && book.status === "available";
  const availabilityPercentage = (book.availableCopies / book.totalCopies) * 100;
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="hover-lift shadow-card group h-full flex flex-col border-border/50 hover:border-primary/30 transition-all duration-300">
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
                  ? "bg-green-500/10 text-green-700 border-green-200 hover:bg-green-500/20"
                  : "bg-amber-500/10 text-amber-700 border-amber-200 hover:bg-amber-500/20"
              }
            >
              {isAvailable ? "Dostupné" : "Vypredané"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-4 grow">
          <div className="space-y-3">
            {book.category && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{book.category.name}</span>
              </div>
            )}
            
            {book.publishedYear && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Publikované: {book.publishedYear}</span>
              </div>
            )}

            {/* Dostupnosť - kópie */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Dostupnosť:</span>
                </div>
                <span className="font-semibold">
                  {book.availableCopies}/{book.totalCopies} kópií
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${availabilityPercentage}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`h-full rounded-full ${
                    availabilityPercentage > 50
                      ? "bg-green-500"
                      : availabilityPercentage > 20
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                />
              </div>
              
              {/* Availability status text */}
              <div className="text-xs text-muted-foreground">
                {book.availableCopies === book.totalCopies ? (
                  <span className="text-green-600">Všetky kópie sú dostupné</span>
                ) : book.availableCopies === 0 ? (
                  <span className="text-red-600">Žiadne kópie nie sú dostupné</span>
                ) : (
                  <span>{book.availableCopies} z {book.totalCopies} kópií je dostupných</span>
                )}
              </div>
            </div>

            {book.description && (
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {book.description}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Link to={`/books/${book._id}`} className="w-full">
            <Button
              variant="default"
              className="w-full flex items-center cursor-pointer space-x-2 group-hover:bg-primary/90 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>Detail knihy</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};