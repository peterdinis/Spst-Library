"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, ArrowLeft, Star, FileText, Hash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { BorrowData, BorrowDialog } from "../borrow/BorrowDialog";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { useBook } from "@/hooks/books/useBookDetail";

export default function BookDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [showBorrowDialog, setShowBorrowDialog] = useState(false);
  const bookId = Number(id);
  const { data: book, isLoading, error } = useBook(Number(id));

  const handleBorrow = (borrowData: BorrowData) => {
    if (!book) return;

    toast({
      title: "Kniha bola úspešne požičaná!",
      description: `${borrowData.name} ${borrowData.lastName} si požičal/a "${book.name}" od ${borrowData.fromDate.toLocaleDateString()} do ${borrowData.toDate.toLocaleDateString()}`,
    });

    // TODO: API volanie na backend pre borrow
  };

  const handleReturn = () => {
    if (!book) return;

    toast({
      title: "Kniha bola vrátená!",
      description: `Ďakujeme za vrátenie "${book.name}".`,
    });

    // TODO: API volanie na backend pre return
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">
            Načítavam detaily knihy...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">
          Nepodarilo sa načítať knihu: {(error as Error).message}
        </p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Kniha nenájdená</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Späť */}
        <div className="mb-6 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => router.push("/books")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Späť na knihy</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hlavný obsah */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hlavička knihy */}
            <Card className="shadow-card animate-slide-up">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold mb-2">
                      {book.name}
                    </CardTitle>
                    <CardDescription className="text-lg flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>autor: {book.author?.name}</span>
                    </CardDescription>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {book.bookTags?.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge variant="secondary" className={`text-lg px-4 py-2`}>
                      K dispozícii
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Popis */}
            <Card
              className="shadow-card animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Popis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </CardContent>
            </Card>

            {/* Štítky */}
            {book.bookTags && book.bookTags.length > 0 && (
              <Card
                className="shadow-card animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Hash className="h-5 w-5" />
                    <span>Štítky</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {book.bookTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-accent/10"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Bočný panel */}
          <div className="space-y-6">
            {/* Akcie */}
            <Card className="shadow-card animate-scale-in">
              <CardHeader>
                <CardTitle>Akcie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setShowBorrowDialog(true)}
                  className="w-full"
                  size="lg"
                >
                  Požičať knihu
                </Button>

                <Link
                  href={`/books?author=${encodeURIComponent(
                    book.author?.name ?? "",
                  )}`}
                >
                  <Button variant="ghost" className="w-full" size="lg">
                    Viac od autora
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Detaily knihy */}
            <Card
              className="shadow-card animate-scale-in"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader>
                <CardTitle>Detaily knihy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vytvorené:</span>
                    <span>{new Date(book.createdAt).toLocaleDateString()}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kategória:</span>
                    <Badge variant="outline">{book.category?.name}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hodnotenia */}
            <Card
              className="shadow-card animate-scale-in"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <CardTitle>Hodnotenia</CardTitle>
              </CardHeader>
              <CardContent>
                {book.ratings && book.ratings.length > 0 ? (
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 fill-secondary text-secondary" />
                    <span className="font-semibold">
                      {book.ratings.length} hodnotení
                    </span>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Zatiaľ žiadne hodnotenia
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialóg pre požičanie */}
      <BorrowDialog
        bookId={bookId}
        open={showBorrowDialog}
        onOpenChange={setShowBorrowDialog}
        bookTitle={book.name}
        onConfirm={handleBorrow}
      />
    </div>
  );
}
